export function extract<TSource, TKey extends keyof TSource>(source: TSource, extractKeys: TKey[]) {
  return extractKeys.reduce((prev, key) => {
    prev[key] = source[key];
    return prev;
  }, {} as Pick<TSource, TKey>);
}
