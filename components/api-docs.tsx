import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ApiDocs() {
  const [activeTab, setActiveTab] = useState("auth");

  const routes = {
    auth: [
      {
        method: "POST",
        path: "/auth/login",
        description: "User login",
        request: {
          phone: "string",
          password: "string",
        },
        response: {
          success: "boolean",
          data: {
            user: {
              id: "string",
              username: "string",
              phone: "string",
              role: "string",
            },
            tokens: {
              accessToken: "string",
              refreshToken: "string",
            },
          },
        },
        example: {
          request: `
{
  "phone": "+1234567890",
  "password": "securepassword123"
}`,
          response: `
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "username": "johndoe",
      "phone": "+1234567890",
      "role": "buyer"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}`,
        },
      },
      {
        method: "POST",
        path: "/auth/logout",
        description: "User logout",
        request: {
          refreshToken: "string",
        },
        response: {
          success: "boolean",
          message: "string",
        },
        example: {
          request: `
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
          response: `
{
  "success": true,
  "message": "Logged out successfully"
}`,
        },
      },
      {
        method: "POST",
        path: "/auth/refresh-token",
        description: "Refresh access token",
        request: {
          userId: "string",
          refreshToken: "string",
        },
        response: {
          success: "boolean",
          data: {
            accessToken: "string",
            refreshToken: "string",
          },
        },
        example: {
          request: `
{
  "userId": "user123",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
          response: `
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`,
        },
      },
    ],
    users: [
      {
        method: "GET",
        path: "/users",
        description: "Get all users",
        response: {
          success: "boolean",
          data: "User[]",
        },
        example: {
          response: `
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "username": "johndoe",
      "phone": "+1234567890",
      "role": "buyer"
    },
    {
      "id": "user456",
      "username": "janedoe",
      "phone": "+0987654321",
      "role": "seller"
    }
  ]
}`,
        },
      },
      {
        method: "GET",
        path: "/users/:id",
        description: "Get user by ID",
        response: {
          success: "boolean",
          data: "User",
        },
        example: {
          response: `
{
  "success": true,
  "data": {
    "id": "user123",
    "username": "johndoe",
    "phone": "+1234567890",
    "role": "buyer"
  }
}`,
        },
      },
      {
        method: "POST",
        path: "/users/register",
        description: "Register new user",
        request: {
          username: "string",
          phone: "string",
          password: "string",
          role: "string",
        },
        response: {
          success: "boolean",
          data: "User",
        },
        example: {
          request: `
{
  "username": "newuser",
  "phone": "+1122334455",
  "password": "securepassword123",
  "role": "buyer"
}`,
          response: `
{
  "success": true,
  "data": {
    "id": "user789",
    "username": "newuser",
    "phone": "+1122334455",
    "role": "buyer"
  }
}`,
        },
      },
      {
        method: "PATCH",
        path: "/users/:id",
        description: "Update user",
        request: {
          username: "string?",
          phone: "string?",
          role: "string?",
        },
        response: {
          success: "boolean",
          data: "User",
        },
        example: {
          request: `
{
  "username": "updateduser",
  "role": "seller"
}`,
          response: `
{
  "success": true,
  "data": {
    "id": "user123",
    "username": "updateduser",
    "phone": "+1234567890",
    "role": "seller"
  }
}`,
        },
      },
    ],
    categories: [
      {
        method: "GET",
        path: "/categories",
        description: "Get all categories",
        response: {
          success: "boolean",
          data: "Category[]",
        },
        example: {
          response: `
{
  "success": true,
  "data": [
    {
      "id": "cat1",
      "name": "Electronics",
      "description": "Electronic devices and accessories"
    },
    {
      "id": "cat2",
      "name": "Clothing",
      "description": "Apparel and fashion items"
    }
  ]
}`,
        },
      },
      {
        method: "POST",
        path: "/categories",
        description: "Create new category",
        request: {
          name: "string",
          description: "string",
        },
        response: {
          success: "boolean",
          data: "Category",
        },
        example: {
          request: `
{
  "name": "Home & Garden",
  "description": "Items for home improvement and gardening"
}`,
          response: `
{
  "success": true,
  "data": {
    "id": "cat3",
    "name": "Home & Garden",
    "description": "Items for home improvement and gardening"
  }
}`,
        },
      },
    ],
    shops: [
      {
        method: "GET",
        path: "/shops",
        description: "Get all shops",
        response: {
          success: "boolean",
          data: {
            shops: "Shop[]",
          },
        },
        example: {
          response: `
{
  "success": true,
  "data": {
    "shops": [
      {
        "id": "shop1",
        "name": "Tech Haven",
        "description": "Your one-stop shop for all things tech",
        "userId": "user456"
      },
      {
        "id": "shop2",
        "name": "Fashion Forward",
        "description": "Trendy clothes for all seasons",
        "userId": "user789"
      }
    ]
  }
}`,
        },
      },
      {
        method: "POST",
        path: "/shops",
        description: "Create new shop",
        request: {
          name: "string",
          description: "string",
          userId: "string",
        },
        response: {
          success: "boolean",
          data: "Shop",
        },
        example: {
          request: `
{
  "name": "Green Thumb Gardening",
  "description": "Everything you need for a beautiful garden",
  "userId": "user101"
}`,
          response: `
{
  "success": true,
  "data": {
    "id": "shop3",
    "name": "Green Thumb Gardening",
    "description": "Everything you need for a beautiful garden",
    "userId": "user101"
  }
}`,
        },
      },
    ],
    products: [
      {
        method: "GET",
        path: "/products",
        description: "Get all products",
        response: {
          success: "boolean",
          data: {
            products: "Product[]",
          },
        },
        example: {
          response: `
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod1",
        "name": "Smartphone X",
        "description": "Latest model with advanced features",
        "price": 999.99,
        "shopId": "shop1",
        "categoryId": "cat1"
      },
      {
        "id": "prod2",
        "name": "Designer Jeans",
        "description": "Comfortable and stylish jeans",
        "price": 79.99,
        "shopId": "shop2",
        "categoryId": "cat2"
      }
    ]
  }
}`,
        },
      },
      {
        method: "POST",
        path: "/products",
        description: "Create new product",
        request: {
          name: "string",
          description: "string",
          price: "number",
          shopId: "string",
          categoryId: "string",
        },
        response: {
          success: "boolean",
          data: "Product",
        },
        example: {
          request: `
{
  "name": "Garden Tool Set",
  "description": "Complete set of essential garden tools",
  "price": 49.99,
  "shopId": "shop3",
  "categoryId": "cat3"
}`,
          response: `
{
  "success": true,
  "data": {
    "id": "prod3",
    "name": "Garden Tool Set",
    "description": "Complete set of essential garden tools",
    "price": 49.99,
    "shopId": "shop3",
    "categoryId": "cat3"
  }
}`,
        },
      },
    ],
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-orange-100">
        <CardTitle className="text-orange-800">API Documentation</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold text-orange-800 mb-2">
                Connecting to the API
              </h2>
              <p className="text-gray-700">
                To connect to the API, use the base URL:{" "}
                <code className="bg-gray-100 p-1 rounded">
                  https://api.example.com/v1
                </code>
              </p>
              <p className="text-gray-700 mt-2">
                Include the following headers with your requests:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                <li>
                  <code className="bg-gray-100 p-1 rounded">
                    Content-Type: application/json
                  </code>
                </li>
                <li>
                  <code className="bg-gray-100 p-1 rounded">
                    Authorization: Bearer YOUR_ACCESS_TOKEN
                  </code>{" "}
                  (for protected routes)
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-orange-800 mb-2">
                API Routes
              </h2>
              <div className="md:hidden mb-4">
                <Select
                  onValueChange={(value) => setActiveTab(value)}
                  defaultValue={activeTab}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auth">Auth</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="categories">Categories</SelectItem>
                    <SelectItem value="shops">Shops</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="hidden md:grid w-full grid-cols-5">
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="shops">Shops</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                {Object.entries(routes).map(([key, routeGroup]) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    {routeGroup.map((route, index) => (
                      <div
                        key={index}
                        className="mb-6 bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center mb-2">
                          <span
                            className={`font-mono ${
                              route.method === "GET"
                                ? "text-green-600"
                                : "text-blue-600"
                            } font-bold`}
                          >
                            {route.method}
                          </span>
                          <span className="font-mono ml-2 text-gray-800">
                            {route.path}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {route.description}
                        </p>
                        {route.request && (
                          <div className="mb-2">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Request:
                            </h4>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(route.request, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div className="mb-2">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Response:
                          </h4>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(route.response, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700">
                            Example:
                          </h4>
                          {route.example.request && (
                            <div className="mb-2">
                              <h5 className="text-xs font-semibold text-gray-600">
                                Request:
                              </h5>
                              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                {route.example.request}
                              </pre>
                            </div>
                          )}
                          <div>
                            <h5 className="text-xs font-semibold text-gray-600">
                              Response:
                            </h5>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {route.example.response}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
