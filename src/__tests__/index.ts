import { Observable, Observer } from 'rxjs';
import { MockedWorker } from './mocks';
import { WorkerSubject, WorkerObservable } from '../index';

describe('WorkerSubject', () => {
  let worker: MockedWorker;

  describe('inheritance', () => {
    it('should be an instance of WorkerObservable', () => {
      expect(new WorkerSubject(new MockedWorker())).toBeInstanceOf(WorkerObservable);
    });

    it('should be an instance of Observable', () => {
      expect(new WorkerSubject(new MockedWorker())).toBeInstanceOf(Observable);
    });
  });

  describe('interface', () => {
    it('should implement the Observer interface', () => {
      const typed: Observer<string> = new WorkerSubject<string, string>(new MockedWorker());

      expect(typed).toBeDefined();
    });
  });

  describe('#constructor', () => {
    beforeEach(() => {
      worker = new MockedWorker();
      new WorkerSubject(worker);
    });

    it('should set onmessage handler', () => {
      expect(worker.onmessage).toBeInstanceOf(Function);
    });

    it('should set onerror handler', () => {
      expect(worker.onerror).toBeInstanceOf(Function);
    });
  });

  describe('#error', () => {
    it('should not throw', () => {
      expect(() => new WorkerSubject(new MockedWorker()).error(new Error())).not.toThrow();
    });
  });

  describe('#next', () => {
    it('should post a message to the worker', () => {
      worker = new MockedWorker();
      const subj = new WorkerSubject<string, string>(worker);

      subj.next('hello');

      expect(worker.postMessage).toHaveBeenCalledWith('hello');
    });
  });

  describe('#complete', () => {
    it('should clear onmessage and onerror handlers', () => {
      worker = new MockedWorker();
      const subj = new WorkerSubject(worker);

      subj.complete();

      expect(worker.onmessage).toBeNull();
      expect(worker.onerror).toBeNull();
    });

    it('should terminate the worker when terminate is true', () => {
      worker = new MockedWorker();
      const subj = new WorkerSubject(worker);

      subj.complete(true);

      expect(worker.terminate).toHaveBeenCalled();
    });
  });

  describe('multiple subscribers', () => {
    it('should deliver messages to all active subscribers', () => {
      worker = new MockedWorker();
      const subj = new WorkerSubject<string, string>(worker);
      const results1: string[] = [];
      const results2: string[] = [];

      subj.subscribe((v) => results1.push(v));
      subj.subscribe((v) => results2.push(v));
      worker.onmessage!({ data: 'hello' } as MessageEvent);

      expect(results1).toEqual(['hello']);
      expect(results2).toEqual(['hello']);
    });
  });

  describe('subscription cleanup', () => {
    it('should stop delivering messages after unsubscribe', () => {
      worker = new MockedWorker();
      const subj = new WorkerSubject<string, string>(worker);
      const results: string[] = [];

      const sub = subj.subscribe((v) => results.push(v));

      worker.onmessage!({ data: 'before' } as MessageEvent);
      sub.unsubscribe();
      worker.onmessage!({ data: 'after' } as MessageEvent);

      expect(results).toEqual(['before']);
    });
  });
});
