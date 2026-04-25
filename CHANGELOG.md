# Changelog

## [2.0.0] - 2026-04-25

### Breaking Changes
- `WorkerSubject` constructor second parameter changed from `isRawResponse: boolean` to `options: WorkerSubjectOptions`
  - Before: `new WorkerSubject(worker, true)`
  - After: `new WorkerSubject(worker, { rawResponse: true })`

### Added
- `WorkerSubjectOptions` interface exported from the package
- Worker is now automatically terminated when it emits an error
- `complete()` now clears `onmessage` and `onerror` handlers to prevent post-completion messages
- ESLint + typescript-eslint replacing deprecated tslint
- GitHub Actions CI workflow (runs test, lint, build on every push and PR)

### Changed
- `worker` property visibility changed from `public` to `protected`
- Updated RxJS from `~6.5.4` to `~7.8.0`
- Updated TypeScript from `~3.8.3` to `~5.5.0`
- Updated Jest from `^26.2.2` to `^29.7.0`
- Switched tsconfig `lib` from `webworker` to `dom` (correct lib for main-thread Worker usage)

### Fixed
- Generic shadowing in `next()` method — method-level `<Input>` no longer shadows class-level generic
- `.npmignore` typo (`jestconfig.json` → `jest.config.json`)

## [1.0.0] - 2020-08-01

Initial release.
