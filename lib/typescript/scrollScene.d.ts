import type { ScrollRef } from './types';
/**
 * Utility function to perform scroll on:
 * - FlatList
 * - ScrollView
 */
declare const scrollScene: ({ ref, offset, animated, }: {
    ref?: import("./types").ScrollableView | {
        scrollTo?: undefined;
        scrollToOffset: (params: {
            offset: number;
            animated?: boolean | undefined;
        }) => void;
    } | undefined;
    offset: number;
    animated: boolean;
}) => void;
export default scrollScene;
