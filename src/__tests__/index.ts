import { MockedWorker } from './mocks';
import { WorkerSubject } from '../index';
import { Subject } from 'rxjs';

describe('WorkerSubject', () => {
  let worker: MockedWorker;

  describe('inheritance hierarchy', () => {
    it('should be an instance of WorkerSubject', () => {
      expect(new WorkerSubject(new MockedWorker())).toBeInstanceOf(WorkerSubject);
    });

    it('should be an extension of Subject', () => {
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
    let nextSpy: jest.SpyInstance;

    beforeEach(() => {
      worker = new MockedWorker();
      nextSpy = jest.spyOn(Subject.prototype, 'next');
    });

    afterEach(() => {
      nextSpy.mockRestore();
    });

    it('should emit event.data by default', () => {
      new WorkerSubject(worker);
      worker.onmessage!({ data: 'test data' } as MessageEvent);
      expect(nextSpy).toBeCalledWith('test data');
    });

    it('should emit the raw event when rawResponse is true', () => {
      new WorkerSubject(worker, { rawResponse: true });
      const event = { data: 'test data' } as MessageEvent;
      worker.onmessage!(event);
      expect(nextSpy).toBeCalledWith(event);
    });
  });

  describe('#onerror', () => {
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
      worker = new MockedWorker();
      errorSpy = jest.spyOn(Subject.prototype, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      errorSpy.mockRestore();
    });

    it('should call "error" with the error event', () => {
      new WorkerSubject(worker);
      const error = new ErrorEvent('error');
      worker.onerror!(error);
      expect(errorSpy).toBeCalledWith(error);
    });

    it('should terminate the worker on error', () => {
      new WorkerSubject(worker);
      worker.onerror!(new ErrorEvent('error'));
      expect(worker.terminate).toHaveBeenCalled();
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
      const completeSpy = jest.spyOn(Subject.prototype, 'complete');
      const workerSubj = new WorkerSubject(new MockedWorker());
      workerSubj.complete();
      expect(completeSpy).toHaveBeenCalled();
      completeSpy.mockRestore();
    });

    it('should terminate the worker when terminate is true', () => {
      worker = new MockedWorker();
      const workerSubj = new WorkerSubject(worker);
      workerSubj.complete(true);
      expect(worker.terminate).toHaveBeenCalled();
    });

    it('should clear onmessage and onerror handlers', () => {
      worker = new MockedWorker();
      const workerSubj = new WorkerSubject(worker);
      workerSubj.complete();
      expect(worker.onmessage).toBeNull();
      expect(worker.onerror).toBeNull();
    });
  });

  describe('multiple subscribers', () => {
    it('should deliver messages to all active subscribers', () => {
      worker = new MockedWorker();
      const workerSubj = new WorkerSubject<string, string>(worker);
      const results1: string[] = [];
      const results2: string[] = [];

      workerSubj.subscribe(v => results1.push(v));
      workerSubj.subscribe(v => results2.push(v));

      worker.onmessage!({ data: 'hello' } as MessageEvent);

      expect(results1).toEqual(['hello']);
      expect(results2).toEqual(['hello']);
    });
  });

  describe('subscription cleanup', () => {
    it('should stop delivering messages after unsubscribe', () => {
      worker = new MockedWorker();
      const workerSubj = new WorkerSubject<string, string>(worker);
      const results: string[] = [];

      const sub = workerSubj.subscribe(v => results.push(v));
      worker.onmessage!({ data: 'before' } as MessageEvent);
      sub.unsubscribe();
      worker.onmessage!({ data: 'after' } as MessageEvent);

      expect(results).toEqual(['before']);
    });
  });
});
