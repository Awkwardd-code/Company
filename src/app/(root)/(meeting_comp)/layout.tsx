import StreamClientProvider from "@/components/providers/StreamClientProvider";

function Layout({ children }: { children: React.ReactNode }) {
  return <StreamClientProvider>{children}</StreamClientProvider>;
}
export default Layout;
// import React from 'react'

// function layout() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default layout
