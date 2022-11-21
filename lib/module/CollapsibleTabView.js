function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useDebouncedCallback } from 'use-debounce';
import { CollapsibleContextProvider } from './CollapsibleTabViewContext';
import scrollScene from './scrollScene';

/**
 * `CollapsibleTabView` wraps the `TabView` and take care of animations /
 * scroll value computations. It should be used with `useCollapsibleScene`.
 */
const CollapsibleTabView = ({
  animatedValue = new Animated.Value(0),
  navigationState: {
    index,
    routes
  },
  renderHeader = () => null,
  containerHeight = 48,
  collapsedHeight = 0,
  tabBarHeight = 48,
  appBarHeight = 0,
  appBar,
  tabBarProps,
  headerContainerStyle,
  preventTabPressOnGliding = true,
  disableSnap = false,
  headerBackground,
  renderTabBar: customRenderTabBar,
  snapThreshold = 0.5,
  snapTimeout = 250,
  routeKeyProp = 'key',
  ...tabViewProps
}) => {
  const scrollY = React.useRef(animatedValue);
  const listRefArr = React.useRef([]);
  const listOffset = React.useRef({});
  const isGliding = React.useRef(false);
  /** Used to keep track if the user is actively scrolling */

  const isUserInteracting = React.useRef(false);
  const lastInteractionTime = React.useRef(0);
  const [canSnap, setCanSnap] = React.useState(false);
  const activateSnapDebounced = useDebouncedCallback(() => {
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
  const translateY = useRef(scrollY.current.interpolate({
    inputRange: [0, Math.max(collapsedHeight, tabBarHeight)],
    // Always allow for a minimum of `tabBarHeight`
    outputRange: [0, -collapsedHeight],
    extrapolateRight: 'clamp'
  })).current;
  React.useLayoutEffect(() => {
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

  const syncScrollOffsets = React.useCallback(() => {
    const curRouteKey = routes[index][routeKeyProp];
    const offset = listOffset.current[curRouteKey];
    const newOffset = calculateNewOffset(offset, collapsedHeight, disableSnap, snapThreshold);
    listRefArr.current.forEach(item => {
      const isCurrentRoute = item.key === curRouteKey;
      if (isCurrentRoute) return;
      const itemOffset = listOffset.current[item.key];

      if (newOffset !== null) {
        scrollScene({
          ref: item.value,
          offset,
          animated: false
        });
        listOffset.current[item.key] = offset;
      } else if (itemOffset < collapsedHeight || !itemOffset) {
        scrollScene({
          ref: item.value,
          offset: Math.min(offset, collapsedHeight),
          animated: false
        });
      }
    });
  }, [disableSnap, collapsedHeight, index, routeKeyProp, routes, snapThreshold]);
  /**
   * Snapping
   */

  React.useLayoutEffect(() => {
    if (disableSnap || !canSnap) return;
    const curRouteKey = routes[index][routeKeyProp];
    const offset = listOffset.current[curRouteKey];
    setCanSnap(false);
    const newOffset = calculateNewOffset(offset, collapsedHeight, disableSnap, snapThreshold);

    if (newOffset !== null && newOffset !== offset) {
      listRefArr.current.forEach(item => {
        // scroll everything because we could be moving to a new tab
        scrollScene({
          ref: item.value,
          offset: newOffset,
          animated: true
        });
      });
    }
  }, [canSnap, disableSnap, collapsedHeight, index, routeKeyProp, routes, snapThreshold]);
  const maybeSnap = React.useCallback(() => {
    const curRouteKey = routes[index][routeKeyProp];
    const offset = listOffset.current[curRouteKey];
    const newOffset = calculateNewOffset(offset, collapsedHeight, disableSnap, snapThreshold); // only snap if the current offset is different

    if (newOffset !== null && offset !== newOffset) {
      lastInteractionTime.current = Date.now();
      activateSnapDebounced.callback();
    }
  }, [activateSnapDebounced, disableSnap, collapsedHeight, index, routeKeyProp, routes, snapThreshold]);

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


  const buildGetRef = React.useCallback(routeKey => ref => {
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
    return /*#__PURE__*/React.createElement(View, {
      style: {
        zIndex: 1000
      }
    }, !!headerBackground && /*#__PURE__*/React.createElement(Animated.View, {
      style: {
        position: 'absolute',
        width: '100%',
        height: appBarHeight + tabBarHeight + collapsedHeight,
        transform: [{
          translateY
        }]
      }
    }, headerBackground), !!appBar && /*#__PURE__*/React.createElement(View, {
      style: {
        zIndex: 1000,
        height: appBarHeight
      }
    }, appBar), /*#__PURE__*/React.createElement(Animated.View, {
      pointerEvents: "box-none",
      style: [styles.headerContainer, {
        top: appBarHeight,
        height: collapsedHeight + tabBarHeight,
        transform: [{
          translateY
        }]
      }, headerContainerStyle]
    }, renderHeader(), customRenderTabBar ? // @ts-ignore
    customRenderTabBar({ ...props,
      ...tabBarProps,
      isGliding,
      preventTabPressOnGliding
    }) : /*#__PURE__*/React.createElement(TabBar, _extends({}, props, tabBarProps, {
      onTabPress: event => {
        if (isGliding.current && preventTabPressOnGliding) {
          event.preventDefault();
        } // @ts-ignore


        (tabBarProps === null || tabBarProps === void 0 ? void 0 : tabBarProps.onTabPress) && tabBarProps.onTabPress(event);
      }
    }))));
  };

  const onTouchStart = React.useCallback(() => {
    lastInteractionTime.current = Date.now();
    isUserInteracting.current = true;
  }, []);
  const onTouchEnd = React.useCallback(() => {
    lastInteractionTime.current = Date.now();
    isUserInteracting.current = false;
  }, []);
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container,
    onTouchStart: onTouchStart,
    onTouchCancel: onTouchEnd,
    onTouchEnd: onTouchEnd
  }, /*#__PURE__*/React.createElement(CollapsibleContextProvider, {
    value: {
      activeRouteKey: routes[index][routeKeyProp],
      scrollY: scrollY.current,
      buildGetRef,
      collapsedHeight,
      tabBarHeight,
      appBarHeight,
      onMomentumScrollBegin,
      onScrollBeginDrag,
      onScrollEndDrag,
      onMomentumScrollEnd,
      containerHeight: containerHeight || 0
    }
  }, /*#__PURE__*/React.createElement(TabView, _extends({}, tabViewProps, {
    navigationState: {
      index,
      routes
    },
    renderTabBar: renderTabBar
  }))));
};

const styles = StyleSheet.create({
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
export default CollapsibleTabView;

function calculateNewOffset(offset, headerHeight, disableSnap, snapThreshold) {
  return offset >= 0 && offset <= headerHeight ? disableSnap ? offset : offset <= headerHeight * snapThreshold ? 0 : offset > headerHeight * snapThreshold ? headerHeight : null : null;
}
//# sourceMappingURL=CollapsibleTabView.js.map