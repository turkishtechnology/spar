// Public API barrel file
// Re-export types and components from this package.
export * from './types';
export * from './components';

// The masks Spar ships, as `MaskResolver` factories. `mask={{ date: true }}` is
// sugar for `createDateMask({ date: true })`; these are exported so a built-in
// mask can be composed, wrapped or extended with the same tools userland has.
export { createDateMask, createNumberMask, createTimeMask } from './utils';
