import { ObjectKind, ObjectDescriptor, IFolderHandle, IObjectStoreConnector } from '@crewdle/web-sdk';
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
    private readonly label;
    /**
     * The root directory handle.
     * @ignore
     */
    private root?;
    /**
     * The constructor.
     * @param storeKey The store key.
     * @param label The label.
     */
    constructor(storeKey: string, label: string);
    /**
     * Get a file.
     * @param path The path of the file.
     * @returns A promise that resolves with the file.
     */
    get(path: string): Promise<File>;
    /**
     * List the objects in a folder.
     * @param path The path of the folder.
     * @param recursive Whether to list recursively.
     * @returns A promise that resolves with the list of objects.
     */
    list(path: string, recursive?: boolean): Promise<ObjectDescriptor[]>;
    /**
     * Get a folder handle. If the folder does not exist, it will be created.
     * @param path The path of the folder.
     * @returns A promise that resolves with the folder handle.
     */
    getOrCreateFolderHandle(path?: string): Promise<IFolderHandle>;
    /**
     * Get the root folder handle.
     * @returns A promise that resolves with the root folder handle.
     */
    getRootFolderHandle(): Promise<IFolderHandle>;
    /**
     * Get a folder handle.
     * @param path The path of the folder.
     * @returns A promise that resolves with the folder handle.
     */
    getFolderHandle(path: string): Promise<[IFolderHandle, string, string[]]>;
    /**
     * Write a file.
     * @param file The file to write.
     * @param path The path to write the file to.
     * @returns A promise that resolves when the file is written.
     */
    writeFile(file: File, path?: string): Promise<void>;
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
