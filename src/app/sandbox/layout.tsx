import SandboxLayoutProvider from "./_components/sandbox-layout";

const SandBoxLayout: LayoutFC = ({ children }) => {
  return (
    <SandboxLayoutProvider>
      {children}
    </SandboxLayoutProvider>
  );
};

export default SandBoxLayout;