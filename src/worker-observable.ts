import { Observable, Subject } from 'rxjs';

export interface WorkerSubjectOptions {
  rawResponse?: boolean;
}

export class WorkerObservable<T> extends Observable<T> {
  protected readonly worker: Worker;
  private subject = new Subject<T>();

  constructor(worker: Worker, options: WorkerSubjectOptions = {}) {
    super((subscriber) => this.subject.subscribe(subscriber));

    const { rawResponse = false } = options;

    this.worker = worker;
    worker.onmessage = (event) => this.subject.next(rawResponse ? event : event.data);
    worker.onerror = (error) => {
      worker.terminate();
      this.subject.error(error);
    };
  }

  complete(terminate = false): void {
    this.worker.onmessage = null;
    this.worker.onerror = null;
    this.subject.complete();

    if (terminate) {
      this.worker.terminate();
    }
  }
}
