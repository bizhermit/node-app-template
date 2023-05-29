type CommonStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type RouteFC = (props: {
  children: React.ReactNode;
}) => React.ReactElement;

type PageFC<P extends Struct | undefined = undefined, S extends Struct | undefined = undefined> = (props: P & {
  searchParams?: S
}) => React.ReactElement;

type DynamicRouteFC<P extends Struct = Struct> = (props: {
  params: P;
  children: React.ReactNode;
}) => React.ReactElement;

type DynamicPageFC<P extends Struct = Struct, S extends Struct = Struct> = (props: {
  params: P;
  searchParams?: S;
}) => React.ReactElement;

type ErrorFC = (props: {
  error: Error;
  reset: () => void;
}) => React.ReactElement;