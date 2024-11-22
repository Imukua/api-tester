"use client";

import { useState } from "react";
import { Sidebar } from "@/components/side-bar";
import { TopBar } from "@/components/top-bar";
import AuthTester from "@/components/auth-tester";
import UserTester from "@/components/user-tester";
import { Toaster } from "@/components/ui/toaster";
import CategoryTester from "@/components/category-tester";
import ProductTester from "@/components/product-tester";
import ShopTester from "@/components/shop-tester";
import { ApiDocs } from "@/components/api-docs";

export default function ApiTester() {
  const [activeTab, setActiveTab] = useState("auth-user");
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const handleAuthSuccess = (newUserId: string, newAccessToken: string) => {
    setUserId(newUserId);
    setAccessToken(newAccessToken);
  };

  const handleLogout = () => {
    setUserId("");
    setAccessToken("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 lg:p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            {activeTab === "auth-user" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AuthTester
                  onAuthSuccess={handleAuthSuccess}
                  onLogout={handleLogout}
                />
                <UserTester userId={userId} accessToken={accessToken} />
              </div>
            )}
            {activeTab === "categories" && <CategoryTester />}
            {activeTab === "shops" && (
              <ShopTester userId={userId} accessToken={accessToken} />
            )}
            {activeTab === "products" && <ProductTester />}
            {activeTab === "docs" && <ApiDocs />}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
