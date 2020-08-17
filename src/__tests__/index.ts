import { MockedWorker } from './mocks';
import { WorkerSubject } from '../index';
import { Subject } from 'rxjs';

describe('WorkerSubject', () => {
  let worker;
  let event;

  describe('inheritance hierarchy', () => {
    it('should be an instance of the MockedWorker', () => {
      expect(new WorkerSubject(new MockedWorker())).toBeInstanceOf(WorkerSubject);
    });

    it('should be an extension of the Subject', () => {
      expect(new WorkerSubject(new MockedWorker())).toBeInstanceOf(Subject);
    });
  });

  describe('#constructor', () => {
    beforeEach(() => {
      worker = new MockedWorker();
      new WorkerSubject(worker);
    });

    it('should set "onmessage" handler', () => {
      expect(worker.onmessage).toBeInstanceOf(Function);
    });

    it('should set "onerror" handler', () => {
      expect(worker.onerror).toBeInstanceOf(Function);
    });
  });

  describe('#onmessage', () => {
    beforeEach(() => {
      event = { data: 'test data' };
      worker = new MockedWorker();

      spyOn( Subject.prototype, 'next' );
    });

    it('should call "next" on parent class with "event.data" by default or if isRawResponse is set to false', () => {
      new WorkerSubject(worker);
      worker.onmessage(event);

      expect(Subject.prototype.next).toBeCalledWith('test data');
    });

    it('should call "next" on the parent class with whole event object if isRawResponse is set to true', () => {
      new WorkerSubject(worker, true);
      worker.onmessage(event);

      expect(Subject.prototype.next).toBeCalledWith(event);
    });
  });

  describe('#onerror', () => {
    it('should call "error" method with the same parameter if worker is throwing error', () => {
      const error = new Error();

      spyOn( Subject.prototype, 'error' );
      worker = new MockedWorker();
      new WorkerSubject(worker);

      worker.onerror(error);

      expect(Subject.prototype.error).toBeCalledWith(error);
    });
  });

  describe('#next', () => {
    it('should post a message to the worker', () => {
      worker = new MockedWorker();
      const workerSubj = new WorkerSubject(worker);

      workerSubj.next('test data');

      expect(worker.postMessage).toBeCalledWith('test data');
    });
  });

  describe('#complete', () => {
    it('should call "complete" on the parent class', () => {
      const workerSubj = new WorkerSubject(new MockedWorker());

      spyOn( Subject.prototype, 'complete' );

      workerSubj.complete();

      expect(Subject.prototype.complete).toBeCalledWith();
    });

    it('should call "terminate" the worker if terminate parameter is set tu true', () => {
      worker = new MockedWorker();
      const workerSubj = new WorkerSubject(worker);

      workerSubj.complete(true);

      expect(worker.terminate).toBeCalledWith();
    });
  });
});
