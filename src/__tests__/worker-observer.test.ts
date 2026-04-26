import { Observer } from 'rxjs';
import { MockedWorker } from './mocks';
import { WorkerObserver } from '../index';

describe('WorkerObserver', () => {
  let worker: MockedWorker;
  let observer: WorkerObserver<string>;

  beforeEach(() => {
    worker = new MockedWorker();
    observer = new WorkerObserver<string>(worker);
  });

  describe('interface', () => {
    it('should implement the Observer interface', () => {
      const typed: Observer<string> = observer;
      expect(typed).toBeDefined();
    });
  });

  describe('#next', () => {
    it('should post a message to the worker', () => {
      observer.next('hello');
      expect(worker.postMessage).toHaveBeenCalledWith('hello');
    });
  });

  describe('#error', () => {
    it('should not throw', () => {
      expect(() => observer.error(new Error())).not.toThrow();
    });
  });

  describe('#complete', () => {
    it('should not throw', () => {
      expect(() => observer.complete()).not.toThrow();
    });
  });
});
