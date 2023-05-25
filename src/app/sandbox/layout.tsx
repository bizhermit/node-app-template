import SandBoxProvider from "~/sandbox/provider";

const SandBoxLayout: CFC = ({ children }) => {
  return (
    <SandBoxProvider>
      {children}
    </SandBoxProvider>
  );
};

export default SandBoxLayout;