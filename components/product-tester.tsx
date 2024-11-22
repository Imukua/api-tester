"use client";

import { useState, useEffect } from "react";
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

interface Product {
  id: string;
  name: string;
  quantity: number;
  minPurchase: number;
  description: string;
  brand: string;
  mktPrice: number;
  sellingPrice: number;
  size: string;
  colors: string[];
  img: string;
  shopId: string;
  categoryId: number;
}

export default function ProductTester() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    quantity: 0,
    minPurchase: 0,
    description: "",
    brand: "",
    mktPrice: 0,
    sellingPrice: 0,
    size: "",
    colors: [],
    img: "",
    shopId: "",
    categoryId: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await apiRequest("/products", "GET");
    if (response.success) {
      setProducts(response.data.products);
    } else {
      toast({
        title: "Failed to fetch products",
        description: "An error occurred while fetching products.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setNewProduct((prev) => ({
      ...prev,
      [name]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  const handleFloatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    setNewProduct((prev) => ({
      ...prev,
      [name]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  const handleColorsChange = (value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: value.split(",").map((color) => color.trim()),
    }));
  };

  const handleCreateProduct = async () => {
    setError(null);
    const token = localStorage.getItem("accessToken");
    const response = await apiRequest(
      "/products",
      "POST",
      newProduct,
      token || undefined
    );
    setResult(response);
    if (response.success) {
      toast({
        title: "Product Created",
        description: "The new product has been successfully created.",
      });
      setNewProduct({
        name: "",
        quantity: 0,
        minPurchase: 0,
        description: "",
        brand: "",
        mktPrice: 0,
        sellingPrice: 0,
        size: "",
        colors: [],
        img: "",
        shopId: "",
        categoryId: 0,
      });
      fetchProducts();
      setIsDialogOpen(false);
    } else {
      setError("An error occurred while creating the product.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-800">Products</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setError(null);
              setNewProduct({
                name: "",
                quantity: 0,
                minPurchase: 0,
                description: "",
                brand: "",
                mktPrice: 0,
                sellingPrice: 0,
                size: "",
                colors: [],
                img: "",
                shopId: "",
                categoryId: 0,
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-orange-50 border-orange-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-800">
                Add New Product
              </DialogTitle>
              <DialogDescription className="text-orange-700">
                Create a new product for your shop.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-orange-800">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-orange-800">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-orange-800">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleNumberInputChange}
                    placeholder="Enter quantity"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPurchase" className="text-orange-800">
                    Minimum Purchase
                  </Label>
                  <Input
                    id="minPurchase"
                    name="minPurchase"
                    type="number"
                    value={newProduct.minPurchase}
                    onChange={handleNumberInputChange}
                    placeholder="Enter minimum purchase"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mktPrice" className="text-orange-800">
                    Market Price
                  </Label>
                  <Input
                    id="mktPrice"
                    name="mktPrice"
                    type="number"
                    step="0.01"
                    value={newProduct.mktPrice}
                    onChange={handleFloatInputChange}
                    placeholder="Enter market price"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice" className="text-orange-800">
                    Selling Price
                  </Label>
                  <Input
                    id="sellingPrice"
                    name="sellingPrice"
                    type="number"
                    step="0.01"
                    value={newProduct.sellingPrice}
                    onChange={handleFloatInputChange}
                    placeholder="Enter selling price"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-orange-800">
                    Size
                  </Label>
                  <Input
                    id="size"
                    name="size"
                    value={newProduct.size}
                    onChange={handleInputChange}
                    placeholder="Enter size"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors" className="text-orange-800">
                    Colors (comma-separated)
                  </Label>
                  <Input
                    id="colors"
                    name="colors"
                    value={newProduct.colors.join(", ")}
                    onChange={(e) => handleColorsChange(e.target.value)}
                    placeholder="Enter colors (e.g., Red, Blue, Green)"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopId" className="text-orange-800">
                    Shop ID
                  </Label>
                  <Input
                    id="shopId"
                    name="shopId"
                    value={newProduct.shopId}
                    onChange={handleInputChange}
                    placeholder="Enter shop ID"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="text-orange-800">
                    Category ID
                  </Label>
                  <Input
                    id="categoryId"
                    name="categoryId"
                    type="number"
                    value={newProduct.categoryId}
                    onChange={handleNumberInputChange}
                    placeholder="Enter category ID"
                    className="border-orange-300 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-orange-800">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="border-orange-300 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="img" className="text-orange-800">
                  Image URL
                </Label>
                <Input
                  id="img"
                  name="img"
                  value={newProduct.img}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="border-orange-300 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-orange-50 pt-4 pb-4">
              <Button
                onClick={handleCreateProduct}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] md:h-[400px] pr-4">
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="font-semibold text-lg text-orange-800">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          Brand: {product.brand}
                        </p>
                        <p className="text-sm text-gray-600">
                          Size: {product.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          Colors: {product.colors.join(", ")}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800 mb-2"
                        >
                          ID: {product.id}
                        </Badge>
                        <p className="text-sm font-semibold text-orange-800">
                          Price: ${product.sellingPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No products available.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      {result && <ResultDisplay result={result} />}
    </div>
  );
}
