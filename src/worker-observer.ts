import { Observer } from 'rxjs';

export class WorkerObserver<T> implements Observer<T> {
  constructor(protected readonly worker: Worker) {}

  next(input: T): void {
    this.worker.postMessage(input);
  }

  error(_err: unknown): void {
    throw new Error('WorkerObserver does not support error()');
  }

  complete(terminate = false): void {
    if (terminate) {
      this.worker.terminate();
    }
  }
}
