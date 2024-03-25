/**
 * Get the parts of a path
 * @category Object Storage
 * @param path The path to split
 * @returns The parts of the path
 * @ignore
 */
export function getPathParts(path: string): string[] {
  return path.split('/').filter((part) => part.length > 0);
}

/**
 * Get the path name of an object from a path and a name
 * @category Object Storage
 * @param path The path to the object
 * @param name The name of the object
 * @returns The path name of the object
 * @ignore
 */
export function getPathName(path: string, name: string): string {
  return path === '/' ? path + name : path + '/' + name;
}

/**
 * Split a path name into its path and name
 * @category Object Storage
 * @param pathName The path name to split
 * @returns The path and name of the object
 * @ignore
 */
export function splitPathName(pathName: string): [string, string] {
  const parts = getPathParts(pathName);
  const name = parts.pop() || '';
  const path = parts.join('/');
  return [path.length === 0 ? '/' : path, name];
}
