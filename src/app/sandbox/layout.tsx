import SandBoxProvider from "~/sandbox/provider";

const SandBoxLayout: RouteFC = ({ children }) => {
  return (
    <SandBoxProvider>
      {children}
    </SandBoxProvider>
  );
};

export default SandBoxLayout;