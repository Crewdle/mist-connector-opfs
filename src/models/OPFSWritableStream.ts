import { IWritableStream } from '@crewdle/web-sdk-types';

/**
 * Represents a writable stream for OPFS.
 */
export class OPFSWritableStream implements IWritableStream {
  private writer: WritableStreamDefaultWriter<Uint8Array>;

  /**
   * Creates a new instance of OPFSWritableStream.
   * @param writer The writer for the stream.
   */
  constructor(private writable: FileSystemWritableFileStream) {
    this.writer = writer;
  }

  /**
   * Writes a chunk of data to the stream.
   * @param chunk The chunk of data to write.
   * @returns A promise that resolves when the write operation is complete.
   */
  async write(chunk: ArrayBuffer): Promise<void> {
    await this.writable.write(chunk);
  }

  /**
   * Closes the stream.
   * @returns A promise that resolves when the stream is closed.
   */
  async close(): Promise<void> {
    if (this.writable.locked) {
      // Wait for the stream to unlock
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (!this.writable.locked) {
            resolve();
            clearInterval(interval);
          }
        });
      });
    }

    await this.writable.close();
  }
}
