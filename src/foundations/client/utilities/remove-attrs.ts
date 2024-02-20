const rmAttrs = (props: { [v: string]: any } | null | undefined) => {
  const p: { [v: string]: any } = {};
  if (props) {
    Object.keys(props).forEach(k => {
      if (k[0] !== "$") p[k] = props[k];
    });
  }
  return p;
};

export default rmAttrs;
