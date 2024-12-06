"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, AlertCircle } from "lucide-react";
import { ResultDisplay } from "./result-display";

interface Shop {
  id: string;
  name: string;
  desc: string;
  street: string;
  businessType: string;
  buildingName: string;
  shopNumber: string;
  userId: string;
}

interface ShopTesterProps {
  userId: string;
  accessToken: string;
}

export default function ShopTester({ userId, accessToken }: ShopTesterProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [newShop, setNewShop] = useState<Omit<Shop, "id">>({
    name: "",
    desc: "",
    street: "",
    businessType: "",
    buildingName: "",
    shopNumber: "",
    userId: userId,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (accessToken) {
      fetchShops();
    }
  }, [userId, accessToken, fetchShops]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShop((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateShop = async () => {
    setError(null);
    const response = await apiRequest("/shops", "POST", newShop, accessToken);
    setResult(response);
    if (response.success) {
      toast({
        title: "Shop Created",
        description: "The new shop has been successfully created.",
      });
      setNewShop({
        name: "",
        desc: "",
        street: "",
        businessType: "",
        buildingName: "",
        shopNumber: "",
        userId: userId,
      });
      fetchShops();
      setIsDialogOpen(false);
    } else {
      setError("An error occurred while creating the shop.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-800">Shops</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setError(null);
              setNewShop({
                name: "",
                desc: "",
                street: "",
                businessType: "",
                buildingName: "",
                shopNumber: "",
                userId: userId,
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" /> Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-orange-50 border-orange-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-800">
                Add New Shop
              </DialogTitle>
              <DialogDescription className="text-orange-700">
                Create a new shop for your business.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="pr-4">
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-orange-800">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newShop.name}
                    onChange={handleInputChange}
                    placeholder="Enter shop name"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc" className="text-orange-800">
                    Description
                  </Label>
                  <Input
                    id="desc"
                    name="desc"
                    value={newShop.desc}
                    onChange={handleInputChange}
                    placeholder="Enter shop description"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-orange-800">
                    Street
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={newShop.street}
                    onChange={handleInputChange}
                    placeholder="Enter street name"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-orange-800">
                    Business Type
                  </Label>
                  <Input
                    id="businessType"
                    name="businessType"
                    value={newShop.businessType}
                    onChange={handleInputChange}
                    placeholder="Enter business type"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingName" className="text-orange-800">
                    Building Name
                  </Label>
                  <Input
                    id="buildingName"
                    name="buildingName"
                    value={newShop.buildingName}
                    onChange={handleInputChange}
                    placeholder="Enter building name"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopNumber" className="text-orange-800">
                    Shop Number
                  </Label>
                  <Input
                    id="shopNumber"
                    name="shopNumber"
                    value={newShop.shopNumber}
                    onChange={handleInputChange}
                    placeholder="Enter shop number"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
            </ScrollArea>
            <div className="sticky bottom-0 bg-orange-50 pt-4 pb-4">
              <Button
                onClick={handleCreateShop}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Create Shop
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Shops List</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] md:h-[400px] pr-4">
            {shops.length > 0 ? (
              <div className="space-y-4">
                {shops.map((shop) => (
                  <Card
                    key={shop.id}
                    className="p-4 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="font-semibold text-lg text-orange-800">
                          {shop.name}
                        </h3>
                        <p className="text-sm text-gray-600">{shop.desc}</p>
                        <p className="text-sm text-gray-600">
                          {shop.street}, {shop.buildingName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Shop Number: {shop.shopNumber}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800 mt-2 sm:mt-0"
                      >
                        ID: {shop.id}
                      </Badge>
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
      {result && <ResultDisplay result={result} />}
    </div>
  );
}
