"use client";

import { useState } from "react";
import { Sidebar } from "@/components/side-bar";
import AuthTester from "@/components/auth-tester";
import UserTester from "@/components/user-tester";
import { Toaster } from "@/components/ui/toaster";
import CategoryTester from "@/components/category-tester";
import ProductTester from "@/components/product-tester";
import ShopTester from "@/components/shop-tester";

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
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "auth-user" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        {activeTab === "products" && <ProductTester />}{" "}
      </main>
      <Toaster />
    </div>
  );
}
