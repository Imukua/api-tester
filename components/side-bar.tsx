"use client";

import { useState } from "react";
import {
  Home,
  ShoppingBag,
  Package,
  List,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: "auth-user", label: "Auth & User", icon: Home },
    { id: "categories", label: "Categories", icon: List },
    { id: "shops", label: "Shops", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "docs", label: "API Docs", icon: FileText },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
      >
        {isSidebarOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-orange-600 text-white p-6 transition-transform duration-300 ease-in-out transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <h1 className="text-2xl font-bold mb-8">eshop API tester</h1>
        <nav>
          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-2 w-full p-2 rounded transition-colors",
                    activeTab === tab.id
                      ? "bg-orange-700 text-white"
                      : "text-orange-100 hover:bg-orange-500"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
