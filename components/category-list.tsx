"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between bg-orange-100">
        <CardTitle className="text-orange-800">Categories</CardTitle>
        <Button
          onClick={() => router.push("/categories/add")}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          {categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-semibold text-lg text-orange-800 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="self-start bg-orange-100 text-orange-800"
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
  );
}
