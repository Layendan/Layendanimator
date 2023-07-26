/*
Copyright 2020 Weiming Wu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
export default class Semaphore<T> {
  private currentRequests: {
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
    fnToCall: (...args: unknown[]) => Promise<T>;
    id: string;
    args: unknown[];
  }[];
  private runningRequests: number;
  private maxConcurrentRequests: number;
  private pauseTime: number;

  /**
   * Creates a semaphore that limits the number of concurrent Promises being handled
   * @param maxConcurrentRequests max number of concurrent promises being handled at any time
   * @param pauseTime time to wait between each function call in milliseconds
   */
  constructor(maxConcurrentRequests = 1, pauseTime = 0) {
    this.currentRequests = [];
    this.runningRequests = 0;
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.pauseTime = pauseTime;
  }

  removeFunction(id: string) {
    this.currentRequests = this.currentRequests.filter(req => req.id !== id);
  }

  /**
   * Returns a Promise that will eventually return the result of the function passed in.
   * Use this to limit the number of concurrent function executions
   * @param fnToCall function that has a cap on the number of concurrent executions
   * @param args any arguments to be passed to fnToCall
   * @returns Promise that will resolve with the resolved value as if the function passed in was directly called
   */
  callFunction(
    fnToCall: (...args: unknown[]) => Promise<T>,
    id: string,
    ...args: unknown[]
  ) {
    return new Promise<T>((resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        fnToCall,
        id,
        args
      });
      this.tryNext();
    });
  }

  /**
   * Tries to run the next function in the queue
   */
  tryNext() {
    if (!this.currentRequests.length) {
      return;
    } else if (this.runningRequests < this.maxConcurrentRequests) {
      const temp = this.currentRequests.shift();
      if (!temp) {
        return;
      }
      const { resolve, reject, fnToCall, args } = temp;
      this.runningRequests++;
      const req = fnToCall(...args);
      req
        .then(res => resolve(res))
        .catch(err => reject(err))
        .finally(() => {
          this.runningRequests--;
          new Promise(resolve => setTimeout(resolve, this.pauseTime)).then(() =>
            this.tryNext()
          );
        });
    }
  }
}
