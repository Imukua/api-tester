"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { ResultDisplay } from "./result-display";

interface Shop {
  id: string;
  desc: string;
  street: string;
  businessType: string;
  buildingName: string;
  shopNumber: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
}

interface NewShop {
  desc: string;
  street: string;
  businessType: string;
  buildingName: string;
  shopNumber: string;
  userId: string;
  name?: string;
}

interface ShopTesterProps {
  userId: string;
  accessToken: string;
}

export default function ShopTester({ userId, accessToken }: ShopTesterProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [newShop, setNewShop] = useState<NewShop>({
    desc: "",
    street: "",
    businessType: "",
    buildingName: "",
    shopNumber: "",
    userId: userId,
  });
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);

  const fetchShops = useCallback(async () => {
    const response = await apiRequest("/shops", "GET", null, accessToken);
    if (response.success) {
      setShops(response.data.shops);
    } else {
      toast({
        title: "Failed to fetch shops",
        description: "An error occurred while fetching shops.",
        variant: "destructive",
      });
    }
  }, [accessToken]);

  useEffect(() => {
    if (userId) {
      fetchShops();
    }
  }, [userId, fetchShops]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShop((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateShop = async () => {
    const response = await apiRequest("/shops", "POST", newShop, accessToken);
    setResult(response);
    if (response.success) {
      toast({
        title: "Shop Created",
        description: "The new shop has been successfully created.",
      });
      setNewShop({
        desc: "",
        street: "",
        businessType: "",
        buildingName: "",
        shopNumber: "",
        userId: userId,
        name: "",
      });
      fetchShops();
    } else {
      toast({
        title: "Failed to create shop",
        description: "An error occurred while creating the shop.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-8">
      <Card className="bg-white shadow-lg flex-grow">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Create Shop</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId" className="text-orange-800">
                User ID
              </Label>
              <div
                id="userId"
                className="mt-1 p-2 w-full bg-gray-100 border border-orange-300 rounded-md text-gray-700"
                aria-readonly="true"
              >
                {userId}
              </div>
            </div>
            <div>
              <Label htmlFor="name" className="text-orange-800">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newShop.name}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="desc" className="text-orange-800">
                Description
              </Label>
              <Input
                id="desc"
                name="desc"
                value={newShop.desc}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="street" className="text-orange-800">
                Street
              </Label>
              <Input
                id="street"
                name="street"
                value={newShop.street}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="businessType" className="text-orange-800">
                Business Type
              </Label>
              <Input
                id="businessType"
                name="businessType"
                value={newShop.businessType}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="buildingName" className="text-orange-800">
                Building Name
              </Label>
              <Input
                id="buildingName"
                name="buildingName"
                value={newShop.buildingName}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="shopNumber" className="text-orange-800">
                Shop Number
              </Label>
              <Input
                id="shopNumber"
                name="shopNumber"
                value={newShop.shopNumber}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <Button
              onClick={handleCreateShop}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Create Shop
            </Button>
            {result && <ResultDisplay result={result} />}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg w-1/3 flex-grow">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Shops List</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            {shops.length > 0 ? (
              <div className="space-y-4">
                {shops.map((shop) => (
                  <Card
                    key={shop.id}
                    className="p-4 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-orange-800">
                          {shop.name}
                        </h3>
                        <p className="text-sm text-gray-600">{shop.desc}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800"
                      >
                        ID: {shop.id}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        {shop.street}, {shop.buildingName}
                      </p>
                      <p>Shop Number: {shop.shopNumber}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No shops available.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
