# Changelog

## [2.0.1] - 2026-04-27

### Changed
- Build now publishes with npm provenance attestation, linking the package back to the source commit and CI run.

## [2.0.0] - 2026-04-26

### Breaking Changes
- `WorkerSubject` no longer extends `Subject<T>`. It now extends `WorkerObservable<Output>` and implements `Observer<Input>`, preserving the full duplex API without fighting the RxJS type system.
- `WorkerSubject` constructor second parameter changed from `isRawResponse: boolean` to `options: WorkerObservableOptions`
  - Before: `new WorkerSubject(worker, true)`
  - After: `new WorkerSubject(worker, { rawResponse: true })`
- `WorkerSubjectOptions` renamed to `WorkerObservableOptions` (the interface applies to `WorkerObservable`, not only `WorkerSubject`)

### Added
- `WorkerObservable<T>` — read-only Observable wrapper around worker output, exported separately
- `WorkerObserver<T>` — write-only Observer wrapper around worker input, implements RxJS `Observer<T>`
- `WorkerObservableOptions` interface exported from the package
- Worker is automatically terminated when it emits an error; `onmessage`/`onerror` handlers are cleared on both error and `complete()`
- `WorkerObserver.error()` terminates the worker (consistent with RxJS terminal-error semantics)
- `WorkerObserver.complete(terminate?)` accepts optional terminate flag, consistent with `WorkerObservable`
- `next()` is a no-op after `complete()` or `error()` on all classes
- Dual ESM + CommonJS build (`dist/esm/` and `dist/cjs/`)
- `sideEffects: false` for bundler tree-shaking
- ESLint + typescript-eslint replacing deprecated tslint
- GitHub Actions CI workflow (test, lint, build on every push and PR)
- GitHub Actions publish workflow (publishes to npm on `v*` tag push, requires `NPM_TOKEN` secret)

### Changed
- Updated RxJS from `~6.5.4` to `~7.8.0`
- Updated TypeScript from `~3.8.3` to `~5.5.0`
- Updated Jest from `^26.2.2` to `^29.7.0`
- Switched tsconfig `lib` from `["es2015", "webworker"]` to `["es2020", "dom"]`
- tsconfig `target` updated from `es2015` to `es2020`
- tsconfig `moduleResolution` updated from `node` to `bundler`
- `rxjs` moved to `peerDependencies` (`>=7.0.0 <8.0.0`)

### Fixed
- `.npmignore` typo (`jestconfig.json` → `jest.config.json`)

## [1.0.0] - 2020-08-01

Initial release.
