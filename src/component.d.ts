type CommonStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type CFC<P extends { [key: string]: any } = { [key: string]: any }> = React.FC<P & { children?: React.ReactNode; }>;

type LayoutFC<
  P extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined,
  S extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined
> = (props: {
  params: P;
  searchParams: S;
  children: React.ReactNode
}) => (React.ReactNode | React.ReactElement | Promise<React.ReactNode | React.ReactElement>);

type PageFC<
  P extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined,
  S extends { [key: string]: undefined | string | string[] } | undefined = { [key: string]: undefined | string | string[] } | undefined
> = (props: {
  params: P;
  searchParams: S;
}) => (React.ReactNode | React.ReactElement | Promise<React.ReactNode | React.ReactElement>);

type ErrorFC = (props: {
  error: Error;
  reset: () => void;
}) => (React.ReactNode | React.ReactElement);