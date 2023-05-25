type CommonStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type CFC = (props: {
  children: React.ReactNode;
}) => React.ReactElement;

type ErrorFC = (props: {
  error: Error;
  reset: () => void;
}) => React.ReactElement;