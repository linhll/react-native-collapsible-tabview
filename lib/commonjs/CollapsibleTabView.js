"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeTabView = require("react-native-tab-view");

var _useDebounce = require("use-debounce");

var _CollapsibleTabViewContext = require("./CollapsibleTabViewContext");

var _scrollScene = _interopRequireDefault(require("./scrollScene"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * `CollapsibleTabView` wraps the `TabView` and take care of animations /
 * scroll value computations. It should be used with `useCollapsibleScene`.
 */
const CollapsibleTabView = ({
  animatedValue = new _reactNative.Animated.Value(0),
  navigationState: {
    index,
    routes
  },
  renderHeader = () => null,
  headerHeight: initialHeaderHeight = 0,
  tabBarHeight = 48,
  appBar,
  tabBarProps,
  headerContainerStyle,
  preventTabPressOnGliding = true,
  disableSnap = false,
  headerBackground,
  renderTabBar: customRenderTabBar,
  onHeaderHeightChange,
  snapThreshold = 0.5,
  snapTimeout = 250,
  routeKeyProp = 'key',
  ...tabViewProps
}) => {
  const [headerHeight, setHeaderHeight] = _react.default.useState(Math.max(initialHeaderHeight, 0));

  const [appBarHeight, setAppBarHeight] = _react.default.useState(0);

  const scrollY = _react.default.useRef(animatedValue);

  const listRefArr = _react.default.useRef([]);

  const listOffset = _react.default.useRef({});

  const isGliding = _react.default.useRef(false);
  /** Used to keep track if the user is actively scrolling */


  const isUserInteracting = _react.default.useRef(false);

  const lastInteractionTime = _react.default.useRef(0);

  const [canSnap, setCanSnap] = _react.default.useState(false);

  const activateSnapDebounced = (0, _useDebounce.useDebouncedCallback)(() => {
    const lastInteractedAgo = Date.now() - lastInteractionTime.current; // make sure the user is not currently still scrolling

    if (!isUserInteracting.current && lastInteractedAgo > snapTimeout) {
      setCanSnap(true);
    } else {
      // re-enter until we have no interactions in the past `snapTimeout`
      activateSnapDebounced.callback();
    }
  }, 16, // check about once per frame
  {
    trailing: true,
    leading: false
  });

  const [translateY, setTranslateY] = _react.default.useState(scrollY.current.interpolate({
    inputRange: [0, Math.max(headerHeight, 0)],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp'
  }));

  _react.default.useLayoutEffect(() => {
    const currY = scrollY.current;
    currY.addListener(({
      value
    }) => {
      const curRoute = routes[index][routeKeyProp];
      listOffset.current[curRoute] = value;
      lastInteractionTime.current = Date.now();
    });
    return () => {
      currY.removeAllListeners();
    };
  }, [routes, index, routeKeyProp, activateSnapDebounced]);
  /**
   * Sync the scroll of unfocused routes to the current focused route.
   */


  const syncScrollOffsets = _react.default.useCallback(() => {
    const curRouteKey = routes[index][routeKeyProp];
    const offset = listOffset.current[curRouteKey];
    const newOffset = calculateNewOffset(offset, headerHeight, disableSnap, snapThreshold);
    listRefArr.current.forEach(item => {
      const isCurrentRoute = item.key === curRouteKey;
      if (isCurrentRoute) return;
      const itemOffset = listOffset.current[item.key];

      if (newOffset !== null) {
        (0, _scrollScene.default)({
          ref: item.value,
          offset,
          animated: false
        });
        listOffset.current[item.key] = offset;
      } else if (itemOffset < headerHeight || !itemOffset) {
        (0, _scrollScene.default)({
          ref: item.value,
          offset: Math.min(offset, headerHeight),
          animated: false
        });
      }
    });
  }, [disableSnap, headerHeight, index, routeKeyProp, routes, snapThreshold]);
  /**
   * Snapping
   */


  _react.default.useLayoutEffect(() => {
    if (disableSnap || !canSnap) return;
    const curRouteKey = routes[index][routeKeyProp];
    const offset = listOffset.current[curRouteKey];
    setCanSnap(false);
    const newOffset = calculateNewOffset(offset, headerHeight, disableSnap, snapThreshold);

    if (newOffset !== null && newOffset !== offset) {
      listRefArr.current.forEach(item => {
        // scroll everything because we could be moving to a new tab
        (0, _scrollScene.default)({
          ref: item.value,
          offset: newOffset,
          animated: true
        });
      });
    }
  }, [canSnap, disableSnap, headerHeight, index, routeKeyProp, routes, snapThreshold]);

  const maybeSnap = _react.default.useCallback(() => {
    const curRouteKey = routes[index][routeKeyProp];
    const offset = listOffset.current[curRouteKey];
    const newOffset = calculateNewOffset(offset, headerHeight, disableSnap, snapThreshold); // only snap if the current offset is different

    if (newOffset !== null && offset !== newOffset) {
      lastInteractionTime.current = Date.now();
      activateSnapDebounced.callback();
    }
  }, [activateSnapDebounced, disableSnap, headerHeight, index, routeKeyProp, routes, snapThreshold]);

  const onMomentumScrollBegin = () => {
    isGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isGliding.current = false;
    maybeSnap();
    syncScrollOffsets();
  };

  const onScrollBeginDrag = () => {
    isUserInteracting.current = true;
    lastInteractionTime.current = Date.now();
  };

  const onScrollEndDrag = () => {
    isUserInteracting.current = false;
    lastInteractionTime.current = Date.now(); // make sure we snap if the user keeps his finger in the same position for a while then lifts it

    maybeSnap();
    syncScrollOffsets();
  };
  /**
   * Function to be passed as ref for the scrollable animated
   * component inside the tab scene.
   *
   * One of: Animated.[SrcollView | FlatList]
   *
   * It is exposed in the context.
   */


  const buildGetRef = _react.default.useCallback(routeKey => ref => {
    if (ref) {
      const found = listRefArr.current.find(e => e.key === routeKey);

      if (!found) {
        listRefArr.current.push({
          key: routeKey,
          value: ref
        });
      }
    }
  }, []);
  /**
   * Get header height on layout mount/change,
   * if different from the current `headerHeight`,
   * update both the `headerHeight` and the
   * `translateY`.
   */


  const getHeaderHeight = _react.default.useCallback(event => {
    const value = event.nativeEvent.layout.height - tabBarHeight;
    onHeaderHeightChange === null || onHeaderHeightChange === void 0 ? void 0 : onHeaderHeightChange();
    setHeaderHeight(Math.max(value, 0));
    setTranslateY(scrollY.current.interpolate({
      inputRange: [0, Math.max(value, tabBarHeight)],
      // Always allow for a minimum of `tabBarHeight`
      outputRange: [0, -value],
      extrapolateRight: 'clamp'
    }));
  }, [onHeaderHeightChange, scrollY, tabBarHeight]);
  /**
   *
   * Wraps the tab bar with `Animated.View` to
   * control the translateY property.
   *
   * Render the header with `renderHeader` prop.
   *
   * Render the default `<TabBar />` with additional
   * `tabBarProps`, or a custom tab bar from the
   * `renderTabBar` prop, inside the Animated wrapper.
   */


  const renderTabBar = props => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        zIndex: 1000
      }
    }, !!headerBackground && /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
      style: {
        position: 'absolute',
        width: '100%',
        height: appBarHeight + tabBarHeight + headerHeight,
        transform: [{
          translateY
        }]
      }
    }, headerBackground), !!appBar && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      onLayout: e => setAppBarHeight(e.nativeEvent.layout.height),
      style: {
        zIndex: 1000
      }
    }, appBar), /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
      pointerEvents: "box-none",
      style: [styles.headerContainer, {
        top: appBarHeight,
        transform: [{
          translateY
        }]
      }, headerContainerStyle],
      onLayout: getHeaderHeight
    }, renderHeader(), customRenderTabBar ? // @ts-ignore
    customRenderTabBar({ ...props,
      ...tabBarProps,
      isGliding,
      preventTabPressOnGliding
    }) : /*#__PURE__*/_react.default.createElement(_reactNativeTabView.TabBar, _extends({}, props, tabBarProps, {
      onTabPress: event => {
        if (isGliding.current && preventTabPressOnGliding) {
          event.preventDefault();
        } // @ts-ignore


        (tabBarProps === null || tabBarProps === void 0 ? void 0 : tabBarProps.onTabPress) && tabBarProps.onTabPress(event);
      }
    }))));
  };

  const [containerHeight, setContainerHeight] = _react.default.useState(undefined);

  const onLayout = _react.default.useCallback(e => {
    setContainerHeight(e.nativeEvent.layout.height);
  }, []);

  const onTouchStart = _react.default.useCallback(() => {
    lastInteractionTime.current = Date.now();
    isUserInteracting.current = true;
  }, []);

  const onTouchEnd = _react.default.useCallback(() => {
    lastInteractionTime.current = Date.now();
    isUserInteracting.current = false;
  }, []);

  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container,
    onLayout: onLayout,
    onTouchStart: onTouchStart,
    onTouchCancel: onTouchEnd,
    onTouchEnd: onTouchEnd
  }, /*#__PURE__*/_react.default.createElement(_CollapsibleTabViewContext.CollapsibleContextProvider, {
    value: {
      activeRouteKey: routes[index][routeKeyProp],
      scrollY: scrollY.current,
      buildGetRef,
      headerHeight,
      tabBarHeight,
      appBarHeight,
      onMomentumScrollBegin,
      onScrollBeginDrag,
      onScrollEndDrag,
      onMomentumScrollEnd,
      containerHeight: containerHeight || 0
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNativeTabView.TabView, _extends({}, tabViewProps, {
    navigationState: {
      index,
      routes
    },
    renderTabBar: renderTabBar
  }))));
};

const styles = _reactNative.StyleSheet.create({
  headerContainer: {
    top: 0,
    zIndex: 1,
    position: 'absolute',
    width: '100%'
  },
  container: {
    flex: 1,
    overflow: 'hidden'
  }
});

var _default = CollapsibleTabView;
exports.default = _default;

function calculateNewOffset(offset, headerHeight, disableSnap, snapThreshold) {
  return offset >= 0 && offset <= headerHeight ? disableSnap ? offset : offset <= headerHeight * snapThreshold ? 0 : offset > headerHeight * snapThreshold ? headerHeight : null : null;
}
//# sourceMappingURL=CollapsibleTabView.js.map