export class MockedWorker implements Worker {
  public onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;
  public onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null = null;
  public onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null = null;
  public postMessage = jest.fn();
  public terminate = jest.fn();
  public addEventListener = jest.fn();
  public removeEventListener = jest.fn();
  public dispatchEvent = jest.fn<boolean, [Event]>(() => true);
}
