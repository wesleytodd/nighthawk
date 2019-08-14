export { default } from './lib/router';

// Expose request and response
export { default as Request }  from './lib/request';
export { default as Response } from './lib/response';

// Is the History API supported?
export { default as pushStateSupported } from './lib/supports-push-state';
