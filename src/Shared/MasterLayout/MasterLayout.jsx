import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MasterLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SideBar />
        <div className="flex-1 w-full overflow-hidden flex flex-col bg-gray-50/30 dark:bg-[#0D1321]">
          <NavBar />
          <main className=" w-11/12 mx-auto text-base overflow-auto bg-gray-50/30 dark:bg-[#0D1321]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
