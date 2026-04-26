import { Observer } from 'rxjs';
import { WorkerObservable, WorkerSubjectOptions } from './worker-observable';
import { WorkerObserver } from './worker-observer';

export class WorkerSubject<Input, Output> extends WorkerObservable<Output> implements Observer<Input> {
  private readonly observer: WorkerObserver<Input>;

  constructor(worker: Worker, options: WorkerSubjectOptions = {}) {
    super(worker, options);

    this.observer = new WorkerObserver<Input>(worker);
  }

  next(input: Input): void {
    this.observer.next(input);
  }

  error(_err: unknown): void {
    throw new Error('WorkerSubject does not support error()');
  }
}
