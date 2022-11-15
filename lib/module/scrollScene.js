/**
 * Utility function to perform scroll on:
 * - FlatList
 * - ScrollView
 */
const scrollScene = ({
  ref,
  offset,
  animated
}) => {
  if (ref !== null && ref !== void 0 && ref.scrollToOffset) {
    ref.scrollToOffset({
      offset,
      animated
    });
  } else if (ref !== null && ref !== void 0 && ref.scrollTo) {
    ref.scrollTo({
      y: offset,
      animated
    });
  }
};

export default scrollScene;
//# sourceMappingURL=scrollScene.js.map