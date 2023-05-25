type CommonStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

type CFC = (props: {
  children: React.ReactNode;
}) => React.ReactElement;