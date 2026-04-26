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

    it('should not post a message after complete', () => {
      observer.complete();
      observer.next('hello');

      expect(worker.postMessage).not.toHaveBeenCalled();
    });

    it('should not post a message after error', () => {
      observer.error(new Error());
      observer.next('hello');

      expect(worker.postMessage).not.toHaveBeenCalled();
    });
  });

  describe('#error', () => {
    it('should terminate the worker', () => {
      observer.error(new Error());

      expect(worker.terminate).toHaveBeenCalled();
    });

    it('should not throw', () => {
      expect(() => observer.error(new Error())).not.toThrow();
    });
  });

  describe('#complete', () => {
    it('should not terminate the worker by default', () => {
      observer.complete();

      expect(worker.terminate).not.toHaveBeenCalled();
    });

    it('should terminate the worker when terminate is true', () => {
      observer.complete(true);

      expect(worker.terminate).toHaveBeenCalled();
    });
  });
});
