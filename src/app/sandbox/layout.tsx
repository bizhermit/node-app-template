import SandBoxProvider from "@/sandbox/provider";

const SandBoxLayout: LayoutFC = ({ children }) => {
  return (
    <SandBoxProvider>
      {children}
    </SandBoxProvider>
  );
};

export default SandBoxLayout;