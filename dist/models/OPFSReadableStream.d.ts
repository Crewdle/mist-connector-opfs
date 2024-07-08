import { IReadableStream } from "@crewdle/web-sdk-types";
/**
 * Represents a readable stream for the OPFS connector.
 */
export declare class OPFSReadableStream implements IReadableStream {
    private reader;
    /**
     * Creates an instance of OPFSReadableStream.
     * @param stream The underlying ReadableStream object.
     */
    constructor(stream: ReadableStream<Uint8Array>);
    /**
     * Reads the next chunk of data from the stream.
     * @returns A Promise that resolves to the next chunk of data as a Uint8Array, or null if the end of the stream has been reached.
     */
    read(): Promise<Uint8Array | null>;
    /**
     * Closes the stream.
     * @returns A Promise that resolves when the stream is closed.
     */
    close(): Promise<void>;
}
