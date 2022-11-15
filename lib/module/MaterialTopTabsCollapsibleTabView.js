function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { NavigationHelpersContext, TabActions, useTheme } from '@react-navigation/native';
import CollapsibleTabView from './CollapsibleTabView';
import { MaterialTopTabBar } from '@react-navigation/material-top-tabs';
export default function MaterialTopTabsCollapsibleTabView({
  pager,
  lazyPlaceholder,
  tabBar = props => /*#__PURE__*/React.createElement(MaterialTopTabBar, props),
  tabBarOptions,
  state,
  navigation,
  descriptors,
  sceneContainerStyle,
  collapsibleOptions,
  ...rest
}) {
  const {
    colors
  } = useTheme();

  const renderTabBar = props => {
    return tabBar({ ...tabBarOptions,
      ...props,
      state: state,
      navigation: navigation,
      descriptors: descriptors
    });
  };

  return /*#__PURE__*/React.createElement(NavigationHelpersContext.Provider, {
    value: navigation
  }, /*#__PURE__*/React.createElement(CollapsibleTabView, _extends({}, collapsibleOptions, rest, {
    routeKeyProp: "name",
    onIndexChange: index => navigation.dispatch({ ...TabActions.jumpTo(state.routes[index].name),
      target: state.key
    }),
    renderScene: ({
      route
    }) => descriptors[route.key].render(),
    navigationState: state,
    renderTabBar: renderTabBar,
    renderPager: pager,
    renderLazyPlaceholder: lazyPlaceholder,
    onSwipeStart: () => navigation.emit({
      type: 'swipeStart'
    }),
    onSwipeEnd: () => navigation.emit({
      type: 'swipeEnd'
    }),
    sceneContainerStyle: [{
      backgroundColor: colors.background
    }, sceneContainerStyle]
  })));
}
//# sourceMappingURL=MaterialTopTabsCollapsibleTabView.js.map