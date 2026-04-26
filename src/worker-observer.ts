import { Observer } from 'rxjs';

export class WorkerObserver<T> implements Observer<T> {
  private isCompleted = false;

  constructor(protected readonly worker: Worker) {}

  next(input: T): void {
    if (this.isCompleted) {
      return;
    }

    this.worker.postMessage(input);
  }

  error(_err: unknown): void {
    this.isCompleted = true;
    this.worker.terminate();
  }

  complete(terminate = false): void {
    this.isCompleted = true;

    if (terminate) {
      this.worker.terminate();
    }
  }
}
