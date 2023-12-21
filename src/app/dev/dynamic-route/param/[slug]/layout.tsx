import { BaseSection } from "@/dev/_components/base-layout";

const Layout: LayoutFC = ({ children, params }) => {
  return (
    <BaseSection title="param/[slug]/layout.tsx">
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
      {children}
    </BaseSection>
  );
};

export default Layout;