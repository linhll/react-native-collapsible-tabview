"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Utility function to perform scroll on:
 * - FlatList
 * - ScrollView
 */
const scrollScene = ({
  ref,
  offset,
  animated
}) => {
  if (ref !== null && ref !== void 0 && ref.scrollToOffset) {
    ref.scrollToOffset({
      offset,
      animated
    });
  } else if (ref !== null && ref !== void 0 && ref.scrollTo) {
    ref.scrollTo({
      y: offset,
      animated
    });
  }
};

var _default = scrollScene;
exports.default = _default;
//# sourceMappingURL=scrollScene.js.map