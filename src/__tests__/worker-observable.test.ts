import { Observable } from 'rxjs';
import { MockedWorker } from './mocks';
import { WorkerObservable } from '../index';

describe('WorkerObservable', () => {
  let worker: MockedWorker;

  describe('inheritance', () => {
    it('should be an instance of Observable', () => {
      expect(new WorkerObservable(new MockedWorker())).toBeInstanceOf(Observable);
    });
  });

  describe('#constructor', () => {
    beforeEach(() => {
      worker = new MockedWorker();
      new WorkerObservable(worker);
    });

    it('should set onmessage handler', () => {
      expect(worker.onmessage).toBeInstanceOf(Function);
    });

    it('should set onerror handler', () => {
      expect(worker.onerror).toBeInstanceOf(Function);
    });
  });

  describe('#onmessage', () => {
    it('should emit event.data by default', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable<string>(worker);
      const results: string[] = [];

      obs.subscribe((v) => results.push(v));
      worker.onmessage!({ data: 'hello' } as MessageEvent);

      expect(results).toEqual(['hello']);
    });

    it('should emit the raw event when rawResponse is true', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable<MessageEvent>(worker, { rawResponse: true });
      const results: MessageEvent[] = [];
      const event = { data: 'hello' } as MessageEvent;

      obs.subscribe((v) => results.push(v));
      worker.onmessage!(event);

      expect(results).toEqual([event]);
    });

    it('should deliver messages to all active subscribers', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable<string>(worker);
      const results1: string[] = [];
      const results2: string[] = [];

      obs.subscribe((v) => results1.push(v));
      obs.subscribe((v) => results2.push(v));
      worker.onmessage!({ data: 'hello' } as MessageEvent);

      expect(results1).toEqual(['hello']);
      expect(results2).toEqual(['hello']);
    });
  });

  describe('#onerror', () => {
    it('should propagate error to subscribers', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable(worker);
      let receivedError: unknown;

      obs.subscribe({ error: (err) => { receivedError = err; } });
      const error = new ErrorEvent('error');

      worker.onerror!(error);

      expect(receivedError).toBe(error);
    });

    it('should terminate the worker on error', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable(worker);

      obs.subscribe({ error: () => {} });
      worker.onerror!(new ErrorEvent('error'));

      expect(worker.terminate).toHaveBeenCalled();
    });
  });

  describe('#complete', () => {
    it('should clear onmessage and onerror handlers', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable(worker);

      obs.complete();

      expect(worker.onmessage).toBeNull();
      expect(worker.onerror).toBeNull();
    });

    it('should complete all subscriptions', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable<string>(worker);
      let completed = false;

      obs.subscribe({ complete: () => { completed = true; } });
      obs.complete();

      expect(completed).toBe(true);
    });

    it('should terminate the worker when terminate is true', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable(worker);

      obs.complete(true);

      expect(worker.terminate).toHaveBeenCalled();
    });
  });

  describe('subscription cleanup', () => {
    it('should stop delivering messages after unsubscribe', () => {
      worker = new MockedWorker();
      const obs = new WorkerObservable<string>(worker);
      const results: string[] = [];

      const sub = obs.subscribe((v) => results.push(v));

      worker.onmessage!({ data: 'before' } as MessageEvent);
      sub.unsubscribe();
      worker.onmessage!({ data: 'after' } as MessageEvent);

      expect(results).toEqual(['before']);
    });
  });
});
