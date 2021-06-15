"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollToElement = scrollToElement;
exports.getComponentName = exports.getDocsStories = void 0;

/* eslint-disable no-underscore-dangle */
var getDocsStories = function getDocsStories(context) {
  var storyStore = context.storyStore,
      kind = context.kind;

  if (!storyStore) {
    return [];
  }

  return storyStore.getStoriesForKind(kind).filter(function (s) {
    return !(s.parameters && s.parameters.docs && s.parameters.docs.disable);
  });
};

exports.getDocsStories = getDocsStories;

var titleCase = function titleCase(str) {
  return str.split('-').map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
};

var getComponentName = function getComponentName(component) {
  if (!component) {
    return undefined;
  }

  if (typeof component === 'string') {
    if (component.includes('-')) {
      return titleCase(component);
    }

    return component;
  }

  if (component.__docgenInfo && component.__docgenInfo.displayName) {
    return component.__docgenInfo.displayName;
  }

  return component.name;
};

exports.getComponentName = getComponentName;

function scrollToElement(element) {
  var block = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'start';
  element.scrollIntoView({
    behavior: 'smooth',
    block: block,
    inline: 'nearest'
  });
}