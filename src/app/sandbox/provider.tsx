"use client";

import SandboxPageProvider from "$/components/provider/sandbox";

const SandBoxProvider: RouteFC = ({ children }) => {
  return (
    <SandboxPageProvider>
      {children}
    </SandboxPageProvider>
  );
};

export default SandBoxProvider;