import NextLink from "#/client/elements/link";
import Row from "#/client/elements/row";

const DynamicRootLayout: LayoutFC = (props) => {
  return (
    <div className="flex column p-s">
      <Row className="g-m">
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 1 } }}>1</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 2 } }}>2</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 3 } }}>3</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 4 } }}>4</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 5 } }}>5</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 10 } }}>10</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: 100 } }}>100</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: "x", hoge: 1 } }}>x</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic/[id]", params: { id: "xxx", hoge: 2 } }}>xxx</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic" }}>index</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic", params: { hoge: 1 } }}>index?1</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic", params: { hoge: 2 } }}>index?2</NextLink>
        <NextLink href={{ pathname: "/sandbox/dynamic", params: { hoge: 3 } }}>index?3</NextLink>
      </Row>
      <div className="flex column">
        {props.children}
      </div>
    </div>
  );
};

export default DynamicRootLayout;