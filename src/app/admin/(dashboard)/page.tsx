"use client";

import React, { useState } from "react";
import Sidebar from "./_components/partials/Sidebar";
import Header from "./_components/partials/Header";
import Dashboard from "./_components/Dashboard";

// import './_components/css/style.css';

const AdminPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1">
        <Dashboard/>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;