import { Props as CollapsibleTabViewProps } from './CollapsibleTabView';
import { MaterialTopTabView } from '@react-navigation/material-top-tabs';
export declare type MaterialTopTabsCollapsibleTabViewProps = Parameters<typeof MaterialTopTabView>[0] & {
    collapsibleOptions?: Partial<CollapsibleTabViewProps<any>>;
};
export default function MaterialTopTabsCollapsibleTabView({ pager, lazyPlaceholder, tabBar, tabBarOptions, state, navigation, descriptors, sceneContainerStyle, collapsibleOptions, ...rest }: MaterialTopTabsCollapsibleTabViewProps): JSX.Element;
