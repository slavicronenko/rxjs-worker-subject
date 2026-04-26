# Changelog

## [2.0.0] - 2026-04-25

### Breaking Changes
- `WorkerSubject` no longer extends `Subject<T>`. It now extends `WorkerObservable<Output>` and implements `Observer<Input>`, preserving the full duplex API without fighting the RxJS type system.
- `WorkerSubject` constructor second parameter changed from `isRawResponse: boolean` to `options: WorkerSubjectOptions`
  - Before: `new WorkerSubject(worker, true)`
  - After: `new WorkerSubject(worker, { rawResponse: true })`

### Added
- `WorkerObservable<T>` — read-only Observable wrapper around worker output, exported separately
- `WorkerObserver<T>` — write-only Observer wrapper around worker input, implements RxJS `Observer<T>`
- `WorkerSubjectOptions` interface exported from the package
- Worker is automatically terminated when it emits an error
- `complete()` clears `onmessage` and `onerror` handlers to prevent post-completion messages
- ESLint + typescript-eslint replacing deprecated tslint
- GitHub Actions CI workflow (test, lint, build on every push and PR)
- GitHub Actions publish workflow (publishes to npm on `v*` tag push, requires `NPM_TOKEN` secret)

### Changed
- Updated RxJS from `~6.5.4` to `~7.8.0`
- Updated TypeScript from `~3.8.3` to `~5.5.0`
- Updated Jest from `^26.2.2` to `^29.7.0`
- Switched tsconfig `lib` from `webworker` to `dom` (correct lib for main-thread Worker usage)

### Fixed
- `.npmignore` typo (`jestconfig.json` → `jest.config.json`)

## [1.0.0] - 2020-08-01

Initial release.
