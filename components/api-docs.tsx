import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ApiDocs() {
  const routes = [
    { method: "POST", path: "/auth/login", description: "User login" },
    { method: "POST", path: "/auth/logout", description: "User logout" },
    {
      method: "POST",
      path: "/auth/refresh-token",
      description: "Refresh access token",
    },
    { method: "GET", path: "/users", description: "Get all users" },
    { method: "GET", path: "/users/:id", description: "Get user by ID" },
    {
      method: "POST",
      path: "/users/register",
      description: "Register new user",
    },
    { method: "PATCH", path: "/users/:id", description: "Update user" },
    { method: "GET", path: "/categories", description: "Get all categories" },
    { method: "POST", path: "/categories", description: "Create new category" },
    { method: "GET", path: "/shops", description: "Get all shops" },
    { method: "POST", path: "/shops", description: "Create new shop" },
    { method: "GET", path: "/products", description: "Get all products" },
    { method: "POST", path: "/products", description: "Create new product" },
  ];

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
                Available Routes
              </h2>
              <div className="space-y-2">
                {routes.map((route, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded">
                    <span
                      className={`font-mono ${
                        route.method === "GET"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {route.method}
                    </span>
                    <span className="font-mono ml-2">{route.path}</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {route.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            {/* Add more sections for schemas, authentication, etc. */}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
