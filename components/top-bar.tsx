import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">eshop API Tester</h1>
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
      </Button>
    </div>
  );
}
