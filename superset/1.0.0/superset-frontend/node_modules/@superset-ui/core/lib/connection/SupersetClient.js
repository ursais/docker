"use strict";

exports.__esModule = true;
exports.default = void 0;

var _SupersetClientClass = _interopRequireDefault(require("./SupersetClientClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let singletonClient;

function getInstance() {
  if (!singletonClient) {
    throw new Error('You must call SupersetClient.configure(...) before calling other methods');
  }

  return singletonClient;
}

const SupersetClient = {
  configure: config => {
    singletonClient = new _SupersetClientClass.default(config);
    return singletonClient;
  },
  reset: () => {
    singletonClient = undefined;
  },
  getInstance,
  delete: request => getInstance().delete(request),
  get: request => getInstance().get(request),
  init: force => getInstance().init(force),
  isAuthenticated: () => getInstance().isAuthenticated(),
  post: request => getInstance().post(request),
  put: request => getInstance().put(request),
  reAuthenticate: () => getInstance().reAuthenticate(),
  request: request => getInstance().request(request)
};
var _default = SupersetClient;
exports.default = _default;