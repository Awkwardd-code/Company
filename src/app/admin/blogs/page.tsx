"use client";

import React, { useState } from "react";
import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import Sidebar from "../(dashboard)/_components/partials/Sidebar";
import Header from "../(dashboard)/_components/partials/Header";
import BlogsUI from "./BlogsUI";




const BlogsPage: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { isInterviewer, isLoading } = useUserRole();
    if (isLoading) return <LoaderUI />;
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/* Site header */}
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1">
                    <BlogsUI/>
                </main>
            </div>
        </div>
    );
};

export default BlogsPage;