import Divider from "#/client/elements/divider";
import Row from "#/client/elements/row";

const Layout: LayoutFC = (props) => {
  return (
    <div className="flex column">
      <div className="flex column">
        {props.children}
      </div>
      <Divider />
      <Row>dynamic layout</Row>
      <pre>{JSON.stringify((() => {
        const { children, ...p } = props;
        return p;
      })(), null, 2)}</pre>
    </div>
  );
};

export default Layout;