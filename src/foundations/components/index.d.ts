type MRef<T> = React.MutableRefObject<T | null | undefined>;
type ComponentAttrsWithRef<T, P = {}> = P & { ref?: MRef<T> };