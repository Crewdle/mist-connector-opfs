import { IReadableStream } from "@crewdle/web-sdk-types";

/**
 * Represents a readable stream for the OPFS connector.
 */
export class OPFSReadableStream implements IReadableStream {
  private reader: ReadableStreamDefaultReader<Uint8Array>;

  /**
   * Creates an instance of OPFSReadableStream.
   * @param stream The underlying ReadableStream object.
   */
  constructor(stream: ReadableStream<Uint8Array>) {
    this.reader = stream.getReader();
  }

  /**
   * Reads the next chunk of data from the stream.
   * @returns A Promise that resolves to the next chunk of data as a Uint8Array, or null if the end of the stream has been reached.
   */
  async read(): Promise<Uint8Array | null> {
    const { done, value } = await this.reader.read();
    if (done) {
      return null;
    }

    return value;
  }

  /**
   * Closes the stream.
   * @returns A Promise that resolves when the stream is closed.
   */
  async close(): Promise<void> {
    await this.reader.cancel();
    this.reader.releaseLock();
  }
}
