"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;
exports.CollapsibleContextProvider = exports.useCollapsibleContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// utility function from
// https://github.com/dooboolab/expo-relay-boilerplate/blob/master/src/utils/createCtx.ts
// create context with no upfront defaultValue
// without having to do undefined check all the time
function createContext() {
  const ctx = /*#__PURE__*/_react.default.createContext(undefined);

  function useCtx() {
    const c = _react.default.useContext(ctx);

    if (!c) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  } // make TypeScript infer a tuple, not an array of union types


  return [useCtx, ctx.Provider];
}

const [useCollapsibleContext, CollapsibleContextProvider] = createContext();
exports.CollapsibleContextProvider = CollapsibleContextProvider;
exports.useCollapsibleContext = useCollapsibleContext;
//# sourceMappingURL=CollapsibleTabViewContext.js.map