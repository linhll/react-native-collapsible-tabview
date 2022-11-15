import { Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
export declare type ScrollableView = {
    scrollTo: (params: {
        x?: number;
        y?: number;
        animated?: boolean;
    }) => void;
    scrollToOffset?: never;
};
declare type ScrollableList = {
    scrollTo?: never;
    scrollToOffset: (params: {
        offset: number;
        animated?: boolean;
    }) => void;
};
export declare type ScrollRef = ScrollableView | ScrollableList;
export declare type GetRef = (instance: any | null) => void;
export declare type CollapsibleContext = {
    /**
     * Current focused route.
     */
    activeRouteKey: string;
    /**
     * Animated value to track scroll position.
     */
    scrollY: Animated.Value;
    /**
     * Function to build the function a function to get
     * ref of the scrollable component for a specific route.
     */
    buildGetRef: (routeKey: string) => GetRef;
    headerHeight: number;
    tabBarHeight: number;
    appBarHeight: number;
    containerHeight: number;
    onMomentumScrollBegin: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};
export declare type CollapsibleScenePropsAndRef = {
    /**
     * Disable scroll for unfocused routes is optional,
     * but prevents weird/delayed animations if the user changes tabs
     * and quickly start scrolling the new tab, before
     * the scrollY starting to track the new focused route.
     */
    scrollEnabled: boolean;
    /**
     * Scroll event, enabled only for the focused route.
     */
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Function to get ref from scrollable components
     * inside the scene, and track in the Tab View.
     */
    ref: GetRef;
    /**
     * Content container style with `paddingTop` and `minHeight`.
     */
    contentContainerStyle: {
        paddingTop: number;
        minHeight: number;
    };
    /**
     * Needed for the loading indicator to show correctly on android.
     */
    progressViewOffset: number;
    /**
     * For use in the Animated ListEmptyComponent.
     */
    tabBarHeight: number;
} & Pick<CollapsibleContext, 'onMomentumScrollBegin' | 'onScrollEndDrag' | 'onMomentumScrollEnd'>;
export {};
