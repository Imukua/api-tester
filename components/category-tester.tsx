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
import { ResultDisplay } from "./result-display";
interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoryTester() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await apiRequest("/categories", "GET");
    if (response.success) {
      setCategories(response.data);
    } else {
      toast({
        title: "Failed to fetch categories",
        description: "An error occurred while fetching categories.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await apiRequest(
      "/categories",
      "POST",
      newCategory,
      token || undefined
    );
    setResult(response);
    if (response.success) {
      toast({
        title: "Category Created",
        description: "The new category has been successfully created.",
      });
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } else {
      toast({
        title: "Failed to create category",
        description: "An error occurred while creating the category.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-8">
      <Card className="bg-white shadow-lg flex-grow">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Create Category</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-orange-800">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-orange-800">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="border-orange-300 focus:border-orange-500"
              />
            </div>
            <Button
              onClick={handleCreateCategory}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Create Category
            </Button>
            {result && <ResultDisplay result={result} />}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white shadow-lg w-1/3 flex-grow">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Categories List</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="p-4 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-orange-800">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800"
                      >
                        ID: {category.id}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No categories available.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
