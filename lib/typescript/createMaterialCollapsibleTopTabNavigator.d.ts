import * as React from 'react';
import { TabNavigationState } from '@react-navigation/native';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { Props as CollapsibleTabViewProps } from './CollapsibleTabView';
declare type MaterialTopTabNavigationEventMap = {
    /**
     * Event which fires on tapping on the tab in the tab bar.
     */
    tabPress: {
        data: undefined;
        canPreventDefault: true;
    };
    /**
     * Event which fires on long press on the tab in the tab bar.
     */
    tabLongPress: {
        data: undefined;
    };
    /**
     * Event which fires when a swipe gesture starts, i.e. finger touches the screen.
     */
    swipeStart: {
        data: undefined;
    };
    /**
     * Event which fires when a swipe gesture ends, i.e. finger leaves the screen.
     */
    swipeEnd: {
        data: undefined;
    };
};
declare type BaseNavigator = ReturnType<typeof createMaterialTopTabNavigator>['Navigator'];
declare type BaseProps = Parameters<Extract<BaseNavigator, React.FunctionComponent<any>>>[0];
declare type Props = BaseProps & {
    collapsibleOptions?: Partial<CollapsibleTabViewProps<any>>;
};
declare function MaterialTopTabNavigator({ initialRouteName, backBehavior, children, screenOptions, ...rest }: Props): JSX.Element;
declare const _default: <ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, TabNavigationState<Record<string, object | undefined>>, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap, typeof MaterialTopTabNavigator>;
export default _default;
