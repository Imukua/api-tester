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

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoryTester() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
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
      setIsDialogOpen(false);
    } else {
      const message = JSON.stringify(result, null, 2);
      setError(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-800">Categories</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setError(null);
              setNewCategory({ name: "", description: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-orange-50 border-orange-200">
            <DialogHeader>
              <DialogTitle className="text-orange-800">
                Add New Category
              </DialogTitle>
              <DialogDescription className="text-orange-700">
                Create a new category for your products.
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
              <div className="space-y-2">
                <Label htmlFor="name" className="text-orange-800">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className="border-orange-300 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-orange-800">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  className="border-orange-300 focus:border-orange-500"
                />
              </div>
            </div>
            <Button
              onClick={handleCreateCategory}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Create Category
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-800">Categories List</CardTitle>
        </CardHeader>
        <CardContent>
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
      {result && <ResultDisplay result={result} />}
    </div>
  );
}
