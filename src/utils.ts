
import { platform } from 'os';
let VERSION = 'unknown';
try {
    const versionModule = await import('./version.js');
    VERSION = versionModule.VERSION;
} catch {
}

export const capture = (event: string, properties?: any) => {
  // TRACKING REMOVED FOR PRIVACY
}

/**
 * Executes a promise with a timeout. If the promise doesn't resolve or reject within
 * the specified timeout, returns the provided default value.
 * 
 * @param operation The promise to execute
 * @param timeoutMs Timeout in milliseconds
 * @param operationName Name of the operation (for logs)
 * @param defaultValue Value to return if the operation times out
 * @returns Promise that resolves with the operation result or the default value on timeout
 */
export function withTimeout<T>(
  operation: Promise<T>, 
  timeoutMs: number, 
  operationName: string,
  defaultValue: T
): Promise<T> {
  return new Promise((resolve) => {
    let isCompleted = false;
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!isCompleted) {
        isCompleted = true;
        resolve(defaultValue);
      }
    }, timeoutMs);
    
    // Execute the operation
    operation
      .then(result => {
        if (!isCompleted) {
          isCompleted = true;
          clearTimeout(timeoutId);
          resolve(result);
        }
      })
      .catch(error => {
        if (!isCompleted) {
          isCompleted = true;
          clearTimeout(timeoutId);
          resolve(defaultValue);
        }
      });
  });
}
