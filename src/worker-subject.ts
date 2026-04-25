import { Subject } from 'rxjs';

export interface WorkerSubjectOptions {
  rawResponse?: boolean;
}

export class WorkerSubject<Input, Output> extends Subject<Output> {
  protected worker: Worker;

  constructor(worker: Worker, options: WorkerSubjectOptions = {}) {
    super();
    this.worker = worker;
    const { rawResponse = false } = options;

    worker.onmessage = event => super.next(rawResponse ? event : event.data);
    worker.onerror = error => {
      worker.terminate();
      this.error(error);
    };
  }

  // @ts-expect-error -- TS2416: intentionally overrides Subject<Output>.next with a
  // distinct Input type since messages sent to the worker differ from emitted Output.
  public next(input: Input): void {
    this.worker.postMessage(input);
  }

  public complete(terminate = false): void {
    this.worker.onmessage = null;
    this.worker.onerror = null;
    super.complete();

    if (terminate) {
      this.worker.terminate();
    }
  }
}
