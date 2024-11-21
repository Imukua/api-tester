"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
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
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);

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
    } else {
      toast({
        title: "Failed to create product",
        description: "An error occurred while creating the product.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-8">
      <Card className="bg-white shadow-lg flex-grow">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Create Product</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-orange-800">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Product name"
              />
            </div>
            <div>
              <Label htmlFor="brand" className="text-orange-800">
                Brand
              </Label>
              <Input
                id="brand"
                name="brand"
                value={newProduct.brand}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Brand name"
              />
            </div>
            <div>
              <Label htmlFor="quantity" className="text-orange-800">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={handleNumberInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Available quantity"
              />
            </div>
            <div>
              <Label htmlFor="minPurchase" className="text-orange-800">
                Minimum Purchase
              </Label>
              <Input
                id="minPurchase"
                name="minPurchase"
                type="number"
                value={newProduct.minPurchase}
                onChange={handleNumberInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Minimum purchase amount"
              />
            </div>
            <div>
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
                className="border-orange-300 focus:border-orange-500"
                placeholder="Market price"
              />
            </div>
            <div>
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
                className="border-orange-300 focus:border-orange-500"
                placeholder="Selling price"
              />
            </div>
            <div>
              <Label htmlFor="size" className="text-orange-800">
                Size
              </Label>
              <Input
                id="size"
                name="size"
                value={newProduct.size}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Product size"
              />
            </div>
            <div>
              <Label htmlFor="colors" className="text-orange-800">
                Colors (comma-separated)
              </Label>
              <Input
                id="colors"
                name="colors"
                value={newProduct.colors.join(", ")}
                onChange={(e) => handleColorsChange(e.target.value)}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Red, Blue, Green"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description" className="text-orange-800">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="img" className="text-orange-800">
                Image URL
              </Label>
              <Input
                id="img"
                name="img"
                value={newProduct.img}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="shopId" className="text-orange-800">
                Shop ID
              </Label>
              <Input
                id="shopId"
                name="shopId"
                value={newProduct.shopId}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Shop ID"
              />
            </div>
            <div>
              <Label htmlFor="categoryId" className="text-orange-800">
                Category ID
              </Label>
              <Input
                id="categoryId"
                name="categoryId"
                type="number"
                value={newProduct.categoryId}
                onChange={handleNumberInputChange}
                className="border-orange-300 focus:border-orange-500"
                placeholder="Category ID"
              />
            </div>
          </div>
          <Button
            onClick={handleCreateProduct}
            className="bg-orange-500 hover:bg-orange-600 mt-4"
          >
            Create Product
          </Button>
          {result && <ResultDisplay result={result} />}
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg w-1/3 flex-grow">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Products List</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-orange-800">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800"
                      >
                        Ksh. {product.sellingPrice.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Quantity: {product.quantity}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Min Purchase: {product.minPurchase}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Category ID: {product.categoryId}
                      </Badge>
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
    </div>
  );
}
