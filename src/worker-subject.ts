import { Subject } from 'rxjs';

export class WorkerSubject<Input, Output> extends Subject<Output> {
  constructor(public worker: Worker, isRawResponse = false) {
    super();

    worker.onmessage = event => super.next(isRawResponse ? event : event.data);
    worker.onmessageerror = error => this.error(error);
    worker.onerror = error => this.error(error);
  }

  public next<Input>(input: Input): void {
    this.worker.postMessage(input);
  }

  public complete(terminate = false): void {
    super.complete();

    if (terminate) {
      this.worker.terminate();
    }
  }
}
