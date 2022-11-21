"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

var _CollapsibleTabViewContext = require("./CollapsibleTabViewContext");

/**
 *
 * @param routeKey key of the current scene
 *
 * Get all props for the animated component
 * in order to make the collapsible tabs work.
 *
 * Works with:
 *
 * - Animated.ScrollView
 * - Animated.FlatList
 *
 * ```js
 * const sceneProps = useCollapsibleScene('routeKey')
 * <Animated.FlatList
 *    {...sceneProps}
 *    data={data}
 *    renderItem={renderItem}
 * />
 * ```
 */
const useCollapsibleScene = routeKey => {
  const context = (0, _CollapsibleTabViewContext.useCollapsibleContext)();
  const {
    activeRouteKey,
    scrollY,
    buildGetRef,
    collapsedHeight,
    tabBarHeight,
    containerHeight,
    appBarHeight,
    ...rest
  } = context;
  const scrollEnabled = routeKey === activeRouteKey;
  const onScroll = scrollEnabled ? _reactNative.Animated.event([{
    nativeEvent: {
      contentOffset: {
        y: scrollY
      }
    }
  }], {
    useNativeDriver: true
  }) : undefined;
  return {
    scrollEnabled,
    onScroll,
    ref: buildGetRef(routeKey),
    contentContainerStyle: {
      paddingTop: collapsedHeight + tabBarHeight,
      minHeight: containerHeight + collapsedHeight - appBarHeight
    },
    progressViewOffset: collapsedHeight + tabBarHeight,
    tabBarHeight,
    ...rest
  };
};

var _default = useCollapsibleScene;
exports.default = _default;
//# sourceMappingURL=useCollapsibleScene.js.map