import log from './log';
export function stubRemovedMethods(instance, className, version, methodNames) {
  var upgradeMessage = "See luma.gl ".concat(version, " Upgrade Guide at http://uber.github.io/luma.gl/#/documentation/overview/upgrade-guide");
  var prototype = Object.getPrototypeOf(instance);
  methodNames.forEach(function (methodName) {
    if (prototype.methodName) {
      return;
    }

    prototype[methodName] = function () {
      log.removed("Calling removed method ".concat(className, ".").concat(methodName, ": "), upgradeMessage)();
      throw new Error(methodName);
    };
  });
}
//# sourceMappingURL=stub-methods.js.map