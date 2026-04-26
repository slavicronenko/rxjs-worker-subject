# rxjs-worker-subject

[![npm](https://img.shields.io/npm/v/rxjs-worker-subject)](https://www.npmjs.com/package/rxjs-worker-subject)
[![CI](https://github.com/slavicronenko/rxjs-worker-subject/actions/workflows/ci.yml/badge.svg)](https://github.com/slavicronenko/rxjs-worker-subject/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/rxjs-worker-subject)](./LICENSE)

Reactive [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) communication using RxJS. Subscribe to worker output as an `Observable`, send input as an `Observer` — or do both at once with `WorkerSubject`.

Three classes cover the full range of use cases — from read-only observation to full-duplex messaging.

## Installation

```
npm install rxjs-worker-subject
```

## Example

**`worker.ts`**
```typescript
self.onmessage = (event: MessageEvent<number>) => {
  self.postMessage(event.data * 2);
};
```

**`main.ts`**
```typescript
import { filter, map } from 'rxjs';
import { WorkerSubject } from 'rxjs-worker-subject';

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
const subject = new WorkerSubject<number, number>(worker);

subject
  .pipe(
    filter((n) => n > 10),
    map((n) => `Result: ${n}`)
  )
  .subscribe((result) => console.log(result)); // "Result: 84"

subject.next(42);
subject.complete(true); // clears handlers and terminates the worker
```

---

## Classes

### `WorkerSubject<Input, Output>` — full duplex

Send messages to the worker and subscribe to its responses through a single handle.

```typescript
import { WorkerSubject } from 'rxjs-worker-subject';

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
const subject = new WorkerSubject<Command, Result>(worker);

subject.subscribe((result) => console.log(result));
subject.next({ type: 'ping' });

subject.complete(true); // true = terminate the worker
```

---

### `WorkerObservable<T>` — read only

Subscribe to worker output without caring about the input side.

```typescript
import { WorkerObservable } from 'rxjs-worker-subject';

const obs = new WorkerObservable<Result>(worker);
obs.pipe(filter((r) => r.type === 'pong')).subscribe(console.log);
```

---

### `WorkerObserver<T>` — write only

Send messages to a worker. Implements the RxJS `Observer` interface, so it can be passed directly to `observable.subscribe()`.

```typescript
import { WorkerObserver } from 'rxjs-worker-subject';

const observer = new WorkerObserver<Command>(worker);
observer.next({ type: 'ping' });

// pipe an observable into a worker
commands$.subscribe(observer);
```

---

## API

### `WorkerSubject<Input, Output>`

Extends `WorkerObservable<Output>` and implements `Observer<Input>`.

| Member | Description |
|--------|-------------|
| `constructor(worker, options?)` | Wraps the given `Worker`. |
| `next(input: Input)` | Sends a message to the worker via `postMessage`. |
| `complete(terminate?: boolean)` | Completes the observable and clears event handlers. Terminates the worker if `terminate` is `true`. |
| `subscribe(...)` | Standard RxJS `Observable` subscription. |

### `WorkerObservable<T>`

Extends `Observable<T>`.

| Member | Description |
|--------|-------------|
| `constructor(worker, options?)` | Wraps worker output as a multicasted observable. |
| `complete(terminate?: boolean)` | Completes all subscriptions and clears event handlers. |
| `options.rawResponse` | When `true`, emits the raw `MessageEvent` instead of `event.data`. Defaults to `false`. |

On worker error, the observable propagates the error to subscribers and terminates the worker automatically.

### `WorkerObserver<T>`

Implements `Observer<T>`.

| Member | Description |
|--------|-------------|
| `constructor(worker)` | Wraps worker input. |
| `next(input: T)` | Sends a message to the worker via `postMessage`. |

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)
