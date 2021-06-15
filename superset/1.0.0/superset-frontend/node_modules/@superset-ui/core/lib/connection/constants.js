"use strict";

exports.__esModule = true;
exports.DEFAULT_FETCH_RETRY_OPTIONS = exports.CACHE_KEY = exports.CACHE_AVAILABLE = exports.HTTP_STATUS_NOT_MODIFIED = exports.HTTP_STATUS_OK = exports.DEFAULT_BASE_URL = void 0;
const DEFAULT_BASE_URL = 'http://localhost'; // HTTP status codes

exports.DEFAULT_BASE_URL = DEFAULT_BASE_URL;
const HTTP_STATUS_OK = 200;
exports.HTTP_STATUS_OK = HTTP_STATUS_OK;
const HTTP_STATUS_NOT_MODIFIED = 304; // Namespace for Cache API

exports.HTTP_STATUS_NOT_MODIFIED = HTTP_STATUS_NOT_MODIFIED;
const CACHE_AVAILABLE = ('caches' in window);
exports.CACHE_AVAILABLE = CACHE_AVAILABLE;
const CACHE_KEY = '@SUPERSET-UI/CONNECTION';
exports.CACHE_KEY = CACHE_KEY;
const DEFAULT_FETCH_RETRY_OPTIONS = {
  retries: 3,
  retryDelay: 1000,
  retryOn: [503]
};
exports.DEFAULT_FETCH_RETRY_OPTIONS = DEFAULT_FETCH_RETRY_OPTIONS;