import React from 'react';

// utility function from
// https://github.com/dooboolab/expo-relay-boilerplate/blob/master/src/utils/createCtx.ts
// create context with no upfront defaultValue
// without having to do undefined check all the time
function createContext() {
  const ctx = /*#__PURE__*/React.createContext(undefined);

  function useCtx() {
    const c = React.useContext(ctx);
    if (!c) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  } // make TypeScript infer a tuple, not an array of union types


  return [useCtx, ctx.Provider];
}

const [useCollapsibleContext, CollapsibleContextProvider] = createContext();
export { useCollapsibleContext, CollapsibleContextProvider, createContext };
//# sourceMappingURL=CollapsibleTabViewContext.js.map