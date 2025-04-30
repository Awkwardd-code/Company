/* import StreamClientProvider from "@/components/providers/StreamClientProvider";

function Layout({ children }: { children: React.ReactNode }) {
  return <StreamClientProvider>{children}</StreamClientProvider>;
}

export default Layout; */

import React from "react";
import StreamClientProvider from "@/components/providers/StreamClientProvider";
import { AdminProvider } from "@/components/providers/AdminProvider"; // adjust path as needed

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <StreamClientProvider>{children}</StreamClientProvider>
    </AdminProvider>
  );
}

export default Layout;
