type CommonStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type LayoutFC<
  P extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined,
  S extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined
> = (props: {
  params: P;
  searchParams: S;
  children: React.ReactNode
}) => (React.ReactElement | Promise<React.ReactElement>);

type PageFC<
  P extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined,
  S extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined
> = (props: {
  params: P;
  searchParams: S;
}) => (React.ReactElement | Promise<React.ReactElement>);

type CFC<P extends { [key: string]: any } = { [key: string]: any }> = React.FC<P & { children?: React.ReactNode; }>;

type ErrorFC = (props: {
  error: Error;
  reset: () => void;
}) => React.ReactElement;