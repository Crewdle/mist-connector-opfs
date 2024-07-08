import { ObjectDescriptor, IObjectStoreConnector, IFolderDescriptor, IFileDescriptor, ObjectKind, IWritableStream, IFile } from '@crewdle/web-sdk-types';
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
export declare class OPFSObjectStoreConnector implements IObjectStoreConnector {
    private readonly storeKey;
    /**
     * The root directory handle.
     * @ignore
     */
    private root?;
    /**
     * The constructor.
     * @param storeKey The store key.
     */
    constructor(storeKey: string);
    /**
     * Get a file.
     * @param path The path of the file.
     * @returns A promise that resolves with the file.
     */
    get(path: string): Promise<IFile>;
    /**
     * List the objects in a folder.
     * @param path The path of the folder.
     * @param recursive Whether to list recursively.
     * @returns A promise that resolves with the list of objects.
     */
    list(path: string, recursive?: boolean): Promise<ObjectDescriptor[]>;
    /**
     * Create a folder.
     * @param path The path of the folder to create.
     * @returns A promise that resolves when the folder is created.
     */
    createFolder(path: string): Promise<IFolderDescriptor>;
    /**
     * Write a file.
     * @param file The file to write.
     * @param path The path to write the file to.
     * @returns A promise that resolves when the file is written.
     */
    writeFile(file: File, path?: string): Promise<IFileDescriptor>;
    /**
     * Creates a writable stream for a file.
     * @param path The path to the file.
     * @returns A promise that resolves with an {@link IWritableStream | IWritableStream }.
     */
    createWritableStream(pathName: string): Promise<IWritableStream>;
    /**
     * Delete an object.
     * @param path The path of the object to delete.
     * @returns A promise that resolves with the kind of object that was deleted.
     */
    deleteObject(path: string): Promise<ObjectKind>;
    /**
     * Move an object.
     * @param path The path of the object to move.
     * @param newPath The path to move the object to.
     * @returns A promise that resolves with the kind of object that was moved.
     */
    moveObject(path: string, newPath: string): Promise<ObjectKind>;
    /**
     * Calculate the size of an object.
     * @param path The path of the object.
     * @returns A promise that resolves with the size of the object.
     */
    calculateSize(path: string): Promise<number>;
    /**
     * Get a folder handle. If the folder does not exist, it will be created.
     * @param path The path of the folder.
     * @returns A promise that resolves with the directory handle.
     * @ignore
     */
    private getOrCreateFolderHandle;
    /**
     * Get the root folder handle.
     * @returns A promise that resolves with the root folder handle.
     * @ignore
     */
    private getRootFolderHandle;
    /**
     * Get a folder handle.
     * @param path The path of the folder.
     * @returns A promise that resolves with the folder handle.
     * @ignore
     */
    private getFolderHandle;
    /**
     * Move a file.
     * @param fileHandle The file handle
     * @param path The path of the file
     * @param newPath The path to move the file to
     * @returns A promise that resolves when the file is moved.
     * @ignore
     */
    private moveFile;
    /**
     * Move a directory.
     * @param directoryHandle The directory handle
     * @param path The path of the directory
     * @param newPath The path to move the directory to
     * @returns A promise that resolves when the directory is moved.
     * @ignore
     */
    private moveDirectory;
    /**
     * Copy a directory.
     * @param directoryHandle The directory handle
     * @param path The path of the directory
     * @param newPath The path to copy the directory to
     * @returns A promise that resolves when the directory is copied.
     * @ignore
     */
    private copyDirectory;
}
