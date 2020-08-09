import { WorkerSubject } from '../index';

describe('WorkerSubject', () => {
  it('should create an instance', () => {
    expect(new WorkerSubject(new Worker(''))).toBeInstanceOf(WorkerSubject);
  });
});
