import { IWritableStream } from '@crewdle/web-sdk-types';
/**
 * Represents a writable stream for OPFS.
 */
export declare class OPFSWritableStream implements IWritableStream {
    private writable;
    /**
     * Creates a new instance of OPFSWritableStream.
     * @param writable The writable stream to write to.
     */
    constructor(writable: FileSystemWritableFileStream);
    /**
     * Writes a chunk of data to the stream.
     * @param chunk The chunk of data to write.
     * @returns A promise that resolves when the write operation is complete.
     */
    write(chunk: ArrayBuffer): Promise<void>;
    /**
     * Closes the stream.
     * @returns A promise that resolves when the stream is closed.
     */
    close(): Promise<void>;
}
