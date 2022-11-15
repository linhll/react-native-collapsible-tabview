import { Route } from 'react-native-tab-view';
import type { CollapsibleScenePropsAndRef } from './types';
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
declare const useCollapsibleScene: <T extends Route>(routeKey: T["key"]) => CollapsibleScenePropsAndRef;
export default useCollapsibleScene;
