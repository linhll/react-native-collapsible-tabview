import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import { Route, TabViewProps, TabBarProps, NavigationState, SceneRendererProps } from 'react-native-tab-view';
declare type PTabBarProps<T extends Route> = Partial<TabBarProps<T>>;
export declare type RenderTabBarProps<T extends Route, P extends object = {}> = {
    navigationState: NavigationState<T>;
    isGliding: React.MutableRefObject<boolean>;
    preventTabPressOnGliding: boolean;
} & SceneRendererProps & P;
export declare type Props<T extends Route, P extends object = PTabBarProps<T>> = Partial<Omit<TabViewProps<T>, 'renderTabBar'>> & Pick<TabViewProps<T>, 'onIndexChange' | 'navigationState' | 'renderScene'> & {
    /**
     * Optionally controlled animated value.
     * Default is `new Animated.Value(0)`.
     */
    animatedValue?: Animated.Value;
    /**
     * Header height, default is 0.
     */
    headerHeight?: number;
    /**
     * Tab bar height, default is 48.
     */
    tabBarHeight?: number;
    /**
     * Props passed to the tab bar component.
     */
    tabBarProps?: P;
    appBar?: React.ReactNode | null;
    /**
     * Header rendered on top of the tab bar. Default is `() => null`
     */
    renderHeader?: () => React.ReactNode;
    /**
     * Styles applied to header and tabbar container.
     */
    headerContainerStyle?: Animated.WithAnimatedValue<ViewStyle>;
    /**
     * Prevent tab press if screen is gliding. Default is `true`
     */
    preventTabPressOnGliding?: boolean;
    /**
     * Disable the snap animation.
     */
    disableSnap?: boolean;
    /**
     * Same as `renderTab` of `TabViewProps`, but with the additional
     * `isGliding` and `preventTabPressOnGliding` properties.
     */
    renderTabBar?: (props: RenderTabBarProps<T, P>) => React.ReactNode;
    /**
     * Custom header background element.
     */
    headerBackground?: React.ReactNode | null;
    /**
     * Callback fired when the `headerHeight` state value inside
     * `CollapsibleTabView` will be updated in the `onLayout` event
     * from the tab/header container. Useful to call layout animations
     * Example:
     *
     * ```js
     * const onHeaderHeightChange = () => {
     *  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
     * }
     * ```
     */
    onHeaderHeightChange?: () => void;
    /**
     * Percentage of header height to make the snap effect. A number between
     * 0 and 1. Default is 0.5.
     */
    snapThreshold?: number;
    /**
     * How long to wait before initiating the snap effect, in milliseconds.
     * Default is 100
     */
    snapTimeout?: number;
    /**
     * The property from the `routes` map to use for the active route key
     * Default is 'key'
     */
    routeKeyProp?: keyof T;
};
/**
 * `CollapsibleTabView` wraps the `TabView` and take care of animations /
 * scroll value computations. It should be used with `useCollapsibleScene`.
 */
declare const CollapsibleTabView: <T extends Route, P extends object = Partial<TabBarProps<T>>>({ animatedValue, navigationState: { index, routes }, renderHeader, headerHeight: initialHeaderHeight, tabBarHeight, appBar, tabBarProps, headerContainerStyle, preventTabPressOnGliding, disableSnap, headerBackground, renderTabBar: customRenderTabBar, onHeaderHeightChange, snapThreshold, snapTimeout, routeKeyProp, ...tabViewProps }: Props<T, P>) => React.ReactElement;
export default CollapsibleTabView;
