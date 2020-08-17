export class MockedWorker implements Worker {
  public onmessage;
  public onerror;
  public postMessage = jest.fn();
  public terminate = jest.fn();
  public addEventListener = jest.fn();
  public removeEventListener = jest.fn();
  public dispatchEvent = jest.fn();
}
