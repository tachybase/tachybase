export function isValidMove(fromIndex, toIndex) {
  return (
    Number.isInteger(fromIndex) && Number.isInteger(toIndex) && fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0
  );
}
