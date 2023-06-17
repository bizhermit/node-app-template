"use client";

import SandboxPageProvider from "$/components/provider/sandbox";

const SandBoxProvider: CFC = ({ children }) => {
  return (
    <SandboxPageProvider>
      {children}
    </SandboxPageProvider>
  );
};

export default SandBoxProvider;