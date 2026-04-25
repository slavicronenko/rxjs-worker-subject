# rxjs-worker-subject

`rxjs-worker-subject` is an extension of the [RxJS Subject](https://rxjs.dev/guide/subject),
a wrapper, which allows to work with [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
using RxJS syntax.

## Installation

```
npm install rxjs-worker-subject
```

## Usage

worker.ts
```typescript
addEventListener('message', ({ data }) => postMessage(data));
```

index.ts
```typescript
import { WorkerSubject } from 'rxjs-worker-subject';

const workerSubj = new WorkerSubject<string, string>(new Worker('./worker', { type: 'module' }));

workerSubj.subscribe(response => {
  console.log(response);
});

workerSubj.next('ping');

// Unsubscribe and clean up when done
workerSubj.complete(true);
```

## API

### `new WorkerSubject<Input, Output>(worker, options?)`

Creates a new `WorkerSubject` that wraps the given `Worker`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `worker` | `Worker` | The Web Worker instance to wrap. |
| `options.rawResponse` | `boolean` | When `true`, subscribers receive the raw `MessageEvent` instead of `event.data`. Defaults to `false`. |

### `.next(value: Input): void`

Posts a message to the worker via `postMessage`.

### `.complete(terminate?: boolean): void`

Completes the subject and clears worker event handlers. When `terminate` is `true`, also calls `worker.terminate()`. Defaults to `false`.

### Error handling

If the worker emits an error, the subject propagates it to all subscribers and terminates the worker automatically.

```typescript
workerSubj.subscribe({
  next: response => console.log(response),
  error: err => console.error('Worker error:', err),
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
