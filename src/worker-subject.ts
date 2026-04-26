import { Observer } from 'rxjs';
import { WorkerObservable, WorkerObservableOptions } from './worker-observable';
import { WorkerObserver } from './worker-observer';

export class WorkerSubject<Input, Output> extends WorkerObservable<Output> implements Observer<Input> {
  private readonly observer: WorkerObserver<Input>;

  constructor(worker: Worker, options: WorkerObservableOptions = {}) {
    super(worker, options);

    this.observer = new WorkerObserver<Input>(worker);
  }

  next(input: Input): void {
    if (this.isCompleted) {
      return;
    }

    this.observer.next(input);
  }

  error(err: unknown): void {
    this.worker.onmessage = null;
    this.worker.onerror = null;
    this.isCompleted = true;
    this.worker.terminate();
    this.subject.error(err);
  }
}
