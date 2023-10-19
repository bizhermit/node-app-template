type CommonStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type CFC<P extends { [key: string]: any } = { [key: string]: any }> = React.FC<P & { children?: React.ReactNode; }>;

type QueryString = undefined | string | string[];
type QueryParams = { [key: string]: QueryString };
type ReturnNode = React.ReactNode | React.ReactElement;

type LayoutWithSlotsFC<
  T extends string = string,
  P extends QueryParams | undefined = QueryParams | undefined,
  S extends QueryParams | undefined = QueryParams | undefined
> = (props: {
  params: P;
  searchParams: S;
  children: React.ReactNode
} & Record<T, React.ReactNode>) => (ReturnNode | Promise<ReturnNode>);

type LayoutFC<
  P extends QueryParams | undefined = QueryParams | undefined,
  S extends QueryParams | undefined = QueryParams | undefined
> = (props: {
  params: P;
  searchParams: S;
  children: React.ReactNode
}) => (ReturnNode | Promise<ReturnNode>);

type PageFC<
  P extends QueryParams | undefined = QueryParams | undefined,
  S extends QueryParams | undefined = QueryParams | undefined
> = (props: {
  params: P;
  searchParams: S;
}) => (ReturnNode | Promise<ReturnNode>);

type ErrorFC = (props: {
  error: Error;
  reset: () => void;
}) => (ReturnNode);