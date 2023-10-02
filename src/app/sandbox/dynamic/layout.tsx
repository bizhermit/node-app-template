import NextLink from "#/client/elements/link";
import Row from "#/client/elements/row";

const DynamicRootLayout: LayoutFC = (props) => {
  return (
    <div className="flex column p-s">
      <Row className="g-m">
        <NextLink href="/sandbox/dynamic/1">1</NextLink>
        <NextLink href="/sandbox/dynamic/2">2</NextLink>
        <NextLink href="/sandbox/dynamic/3">3</NextLink>
        <NextLink href="/sandbox/dynamic/4">4</NextLink>
        <NextLink href="/sandbox/dynamic/5">5</NextLink>
        <NextLink href="/sandbox/dynamic/10">10</NextLink>
        <NextLink href="/sandbox/dynamic/100">100</NextLink>
        <NextLink href="/sandbox/dynamic/x?hoge=1">x</NextLink>
        <NextLink href="/sandbox/dynamic/xxx?hoge=2">xxx</NextLink>
        <NextLink href="/sandbox/dynamic">index</NextLink>
        <NextLink href="/sandbox/dynamic?hoge=1">index?1</NextLink>
        <NextLink href="/sandbox/dynamic?hoge=2">index?2</NextLink>
        <NextLink href="/sandbox/dynamic?hoge=3">index?3</NextLink>
      </Row>
      <div className="flex column">
        {props.children}
      </div>
    </div>
  );
};

export default DynamicRootLayout;