import NextLink from "#/components/elements/link";
import Row from "#/components/elements/row";

const DynamicRootLayout: RouteFC = (props) => {
  return (
    <div className="flex-stretch p-2">
      <Row className="gap-2">
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
      </Row>
      <div className="flex-stretch">
        {props.children}
      </div>
    </div>
  );
};

export default DynamicRootLayout;