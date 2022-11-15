import React from 'react';
import type { CollapsibleContext } from './types';
declare type CreateCtx<A> = readonly [() => A, React.ProviderExoticComponent<React.ProviderProps<A | undefined>>];
declare function createContext<A>(): CreateCtx<A>;
declare const useCollapsibleContext: () => CollapsibleContext, CollapsibleContextProvider: React.ProviderExoticComponent<React.ProviderProps<CollapsibleContext | undefined>>;
export { useCollapsibleContext, CollapsibleContextProvider, createContext };
