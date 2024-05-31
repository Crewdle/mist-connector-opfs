import type { ObjectDescriptor, IObjectStoreConnector, IFolderDescriptor, IFileDescriptor } from '@crewdle/web-sdk-types';
import { ObjectKind } from '@crewdle/web-sdk-types';
import { getPathName, getPathParts, splitPathName } from 'helpers';

/**
 * TODO - remove when new release of typescript is available
 * @ignore
 */
declare global {
  interface FileSystemDirectoryHandle {
    [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    keys(): AsyncIterableIterator<string>;
    values(): AsyncIterableIterator<FileSystemHandle>;
  }
}

/**
 * The OPFS object store connector - Connect to the OPFS file system
 * @category Connector
 */
export class OPFSObjectStoreConnector implements IObjectStoreConnector {
  /**
   * The root directory handle.
   * @ignore
   */
  private root?: FileSystemDirectoryHandle;

  /**
   * The constructor.
   * @param storeKey The store key.
   */
  constructor(
    private readonly storeKey: string,
  ) {}

  /**
   * Get a file.
   * @param path The path of the file.
   * @returns A promise that resolves with the file.
   */
  async get(path: string): Promise<File> {
    const [directoryHandle, objectName] = await this.getFolderHandle(path);
    for await (const value of directoryHandle.values()) {
      if (value.name !== objectName) {
        continue;
      }

      if (value.kind === 'directory') {
        throw new Error(`Cannot get file: ${path}`);
      } else {
        const fileHandle = await directoryHandle.getFileHandle(objectName);
        return await fileHandle.getFile();
      }
    }
    throw new Error(`Cannot get file: ${path}`);
  }

  /**
   * List the objects in a folder.
   * @param path The path of the folder.
   * @param recursive Whether to list recursively.
   * @returns A promise that resolves with the list of objects.
   */
  async list(path: string, recursive = false): Promise<ObjectDescriptor[]> {
    try {
      const descriptors: ObjectDescriptor[] = [];
      const [handle, objectName, pathParts] = await this.getFolderHandle(path);
      const directoryHandle = path === '/' ? handle : await handle.getDirectoryHandle(objectName);

      for await (const value of directoryHandle.values()) {
        const filePath = '/' + (pathParts.length > 0 ? pathParts.join('/') : '');
        const pathName = filePath.length > 1 ? filePath + '/' + value.name : '/' + value.name;
        if (value.kind === 'directory') {
          descriptors.push({
            kind: ObjectKind.Folder,
            name: value.name,
            path: filePath,
            pathName,
            entries: recursive ? await this.list(pathName, recursive) : [],
          });
        } else {
          const fileHandle = await directoryHandle.getFileHandle(value.name);
          const file = await fileHandle.getFile();
          descriptors.push({
            kind: ObjectKind.File,
            name: value.name,
            type: file.type,
            size: file.size,
            path: filePath,
            pathName,
          });
        }
      }
      return descriptors;
    } catch (e) {
      throw new Error(`Cannot list folder: ${path}`);
    }
  }

  /**
   * Create a folder.
   * @param path The path of the folder to create.
   * @returns A promise that resolves when the folder is created.
   */
  public async createFolder(path: string): Promise<IFolderDescriptor> {
    try {
      await this.getOrCreateFolderHandle(path);
      const [folderPath, name] = splitPathName(path);
      return {
        kind: ObjectKind.Folder,
        name,
        path: folderPath,
        pathName: path,
      };
    } catch (e) {
      throw new Error(`Cannot create folder: ${path}`);
    }
  }

  /**
   * Write a file.
   * @param file The file to write.
   * @param path The path to write the file to.
   * @returns A promise that resolves when the file is written.
   */
  public async writeFile(file: File, path?: string): Promise<IFileDescriptor> {
    try {
      const directoryHandle = await this.getOrCreateFolderHandle(path);
      const fileHandle = await directoryHandle.getFileHandle(file.name, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();

      return {
        kind: ObjectKind.File,
        name: file.name,
        type: file.type,
        size: file.size,
        path: path ?? '/',
        pathName: getPathName(path ?? '/', file.name),
      };
    } catch (e) {
      throw new Error(`Cannot write file: ${getPathName(path ?? '/', file.name)}`);
    }
  }

  /**
   * Delete an object.
   * @param path The path of the object to delete.
   * @returns A promise that resolves with the kind of object that was deleted.
   */
  public async deleteObject(path: string): Promise<ObjectKind> {
    const [directoryHandle, objectName] = await this.getFolderHandle(path);
    for await (const value of directoryHandle.values()) {
      if (value.name !== objectName) {
        continue;
      }
      try {
        if (value.kind === 'directory') {
          await directoryHandle.removeEntry(objectName, { recursive: true });
          return ObjectKind.Folder;
        } else {
          await directoryHandle.removeEntry(objectName);
          return ObjectKind.File;
        }
      } catch (e) {
        throw new Error(`Cannot delete file: ${path}`);
      }
    }

    throw new Error(`Cannot delete file: ${path}`);
  }

  /**
   * Move an object.
   * @param path The path of the object to move.
   * @param newPath The path to move the object to.
   * @returns A promise that resolves with the kind of object that was moved.
   */
  public async moveObject(path: string, newPath: string): Promise<ObjectKind> {
    try {
      const [directoryHandle, objectName] = await this.getFolderHandle(path);
      for await (const value of directoryHandle.values()) {
        if (value.name !== objectName) {
          continue;
        }

        if (value.kind === 'directory') {
          await this.moveDirectory(directoryHandle, path, newPath);
          return ObjectKind.Folder;
        } else {
          const fileHandle = await directoryHandle.getFileHandle(objectName);
          await this.moveFile(fileHandle, path, newPath);
          return ObjectKind.File;
        }
      }

      throw new Error(`Cannot move object: ${path}`);
    } catch (e) {
      throw new Error(`Cannot publish move operation: ${path}`);
    }
  }

  /**
   * Calculate the size of an object.
   * @param path The path of the object.
   * @returns A promise that resolves with the size of the object.
   */
  public async calculateSize(path: string): Promise<number> {
    const content = await this.list(path);
    let size = 0;

    for (const entry of content) {
      if (entry.kind === ObjectKind.File) {
        size += entry.size;
      } else {
        size += await this.calculateSize(entry.pathName);
      }
    }

    return size;
  }

  /**
   * Get a folder handle. If the folder does not exist, it will be created.
   * @param path The path of the folder.
   * @returns A promise that resolves with the directory handle.
   * @ignore
   */
  private async getOrCreateFolderHandle(path?: string): Promise<FileSystemDirectoryHandle> {
    try {
      let directoryHandle = await this.getRootFolderHandle();
      if (path) {
        const pathParts = getPathParts(path);
        for (const part of pathParts) {
          directoryHandle = await directoryHandle.getDirectoryHandle(part, { create: true });
        }
      }

      return directoryHandle;
    } catch (e) {
      throw new Error(`Cannot get or create folder: ${path}`);
    }
  }

  /**
   * Get the root folder handle.
   * @returns A promise that resolves with the root folder handle.
   * @ignore
   */
  private async getRootFolderHandle(): Promise<FileSystemDirectoryHandle> {
    if (this.root) {
      return this.root;
    }

    const opfsRoot = await navigator.storage.getDirectory();
    this.root = await opfsRoot.getDirectoryHandle(this.storeKey, { create: true });

    return this.root;
  }

  /**
   * Get a folder handle.
   * @param path The path of the folder.
   * @returns A promise that resolves with the folder handle.
   * @ignore
   */
  private async getFolderHandle(path: string): Promise<[FileSystemDirectoryHandle, string, string[]]> {
    try {
      let directoryHandle = await this.getRootFolderHandle();
      if (path === '/') {
        return [directoryHandle, '', []];
      }

      const pathParts = getPathParts(path);
      for (const [i, part] of pathParts.entries()) {
        if (i === pathParts.length - 1) {
          return [directoryHandle, part, pathParts];
        }
        directoryHandle = await directoryHandle.getDirectoryHandle(part);
      }
    } catch (e) {
      throw new Error(`Cannot get folder: ${path}`);
    }

    throw new Error(`Cannot get folder: ${path}`);
  }

  /**
   * Move a file.
   * @param fileHandle The file handle
   * @param path The path of the file
   * @param newPath The path to move the file to
   * @returns A promise that resolves when the file is moved.
   * @ignore
   */
  private async moveFile(fileHandle: FileSystemFileHandle, path: string, newPath: string): Promise<void> {
    try {
      const file = await fileHandle.getFile();
      const parts = newPath.split('/');
      const fileName = parts.slice(-1);
      const filePath = parts.slice(0, parts.length - 1).join('/')
      const newFile = new File([file], fileName[0], { type: file.type });
      await this.writeFile(newFile, filePath);
      await this.deleteObject(path);
    } catch (e) {
      throw new Error(`Cannot move file: ${path}`);
    }
  }

  /**
   * Move a directory.
   * @param directoryHandle The directory handle
   * @param path The path of the directory
   * @param newPath The path to move the directory to
   * @returns A promise that resolves when the directory is moved.
   * @ignore
   */
  private async moveDirectory(directoryHandle: FileSystemDirectoryHandle, path: string, newPath: string): Promise<void> {
    try {
      await this.getOrCreateFolderHandle(newPath);
      const [_, objectName] = splitPathName(path);
      const newHandle = await directoryHandle.getDirectoryHandle(objectName);
      await this.copyDirectory(newHandle, path, newPath);
      await this.deleteObject(path);
    } catch (e) {
      throw new Error(`Cannot move folder: ${path}`);
    }
  }

  /**
   * Copy a directory.
   * @param directoryHandle The directory handle
   * @param path The path of the directory
   * @param newPath The path to copy the directory to
   * @returns A promise that resolves when the directory is copied.
   * @ignore
   */
  private async copyDirectory(directoryHandle: FileSystemDirectoryHandle, path: string, newPath: string): Promise<void> {
    const content = await this.list(path, false);
    for (const entry of content) {
      if (entry.kind === ObjectKind.Folder) {
        await this.moveDirectory(directoryHandle, entry.pathName, getPathName(newPath, entry.name));
      } else {
        const fileHandle = await directoryHandle.getFileHandle(entry.name);
        await this.moveFile(fileHandle, entry.pathName, getPathName(newPath, entry.name));
      }
    }
  }
}
