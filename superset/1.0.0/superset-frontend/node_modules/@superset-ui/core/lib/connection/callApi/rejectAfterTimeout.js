"use strict";

exports.__esModule = true;
exports.default = rejectAfterTimeout;

// returns a Promise that rejects after the specified timeout
function rejectAfterTimeout(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => // eslint-disable-next-line prefer-promise-reject-errors
    reject({
      error: 'Request timed out',
      statusText: 'timeout',
      timeout
    }), timeout);
  });
}