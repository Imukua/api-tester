import { Home, User, ShoppingBag, Package, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "auth-user", label: "Auth & User", icon: Home },
    { id: "categories", label: "Categories", icon: List },
    { id: "shops", label: "Shops", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
  ];

  return (
    <div className="w-64 bg-orange-600 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">eshop API tester</h1>
      <nav>
        <ul className="space-y-4">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
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
  );
}
