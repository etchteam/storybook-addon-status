// eslint-disable-next-line import/prefer-default-export
export function managerEntries(entry: any[] = []) {
  return [...entry, require.resolve('../register')];
}

module.exports = { managerEntries };
