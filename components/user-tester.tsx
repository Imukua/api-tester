"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { exclude } from "@/lib/utils";
import { ResultDisplay } from "./result-display";

interface UserTesterProps {
  userId: string;
  accessToken: string;
}

export default function UserTester({ userId, accessToken }: UserTesterProps) {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    phone: "",
    role: "",
    createdAt: "",
    updatedAt: "",
    id: "",
  });
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);

  const handleGetUser = useCallback(async () => {
    try {
      console.log("Fetching user with ID:", userId);
      const response = await apiRequest(
        `/users/${userId}`,
        "GET",
        null,
        accessToken
      );
      console.log("Response from API: userid", response.data.id);
      setResult(response);
      if (response.success && response.data) {
        setUserData({
          username: response.data.username || "",
          password: "", // Don't set the password from the API response
          phone: response.data.phone || "",
          role: response.data.role || "",
          createdAt: response.data.createdAt || "",
          updatedAt: response.data.updatedAt || "",
          id: response.data.id || "",
        });
        toast({
          title: "User Retrieved",
          description: "User data has been successfully fetched.",
        });
      } else {
        throw new Error("Failed to retrieve user data.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to retrieve user data.",
        variant: "destructive",
      });
    }
  }, [userId, accessToken]);

  useEffect(() => {
    if (userId && accessToken) {
      handleGetUser();
    } else {
      setUserData({
        username: "",
        password: "",
        phone: "",
        role: "",
        createdAt: "",
        updatedAt: "",
        id: "",
      });
      setResult(null);
    }
  }, [userId, accessToken, handleGetUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value || "", // Ensure empty string if value is undefined
    }));
  };

  const handleRoleChange = (value: string) => {
    setUserData((prevData) => ({ ...prevData, role: value }));
  };

  const handleRegisterUser = async () => {
    if (
      !userData.username ||
      !userData.password ||
      !userData.phone ||
      !userData.role
    ) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const response = await apiRequest("/users/register", "POST", userData);
    setResult(response);
    if (response.success && response.data.id) {
      toast({
        title: "User Registered",
        description: "New user has been successfully registered.",
      });
    } else {
      toast({
        title: "Registration Failed",
        description: "Failed to register new user.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    const data = { ...userData };
    // Create a new variable and exclude empty fields
    const cleanedData = exclude(data, [
      "createdAt",
      "updatedAt",
      "id",
      "password",
    ]);
    console.log("Updating user with data:", cleanedData);
    const response = await apiRequest(
      `/users/${userId}`,
      "PATCH",
      cleanedData,
      accessToken
    );
    setResult(response);
    if (response.success && response.data) {
      toast({
        title: "User Updated",
        description: "User data has been successfully updated.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update user data.",
        variant: "destructive",
      });
    }
  };

  const handleGetAllUsers = async () => {
    const response = await apiRequest(
      "/users?page=1&limit=10",
      "GET",
      null,
      accessToken
    );
    setResult(response);
    if (response.success) {
      toast({
        title: "Users Retrieved",
        description: "List of users has been successfully fetched.",
      });
    } else {
      toast({
        title: "Fetch Failed",
        description: "Failed to retrieve users list.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-orange-100">
        <CardTitle className="text-orange-800">User Tester</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-orange-800">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-orange-800">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-orange-800">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              className="border-orange-300 focus:border-orange-500"
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-orange-800">
              Role
            </Label>
            <Select
              onValueChange={handleRoleChange}
              value={userData.role || ""}
            >
              <SelectTrigger className="border-orange-300 focus:border-orange-500">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleRegisterUser}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Register User
            </Button>
            <Button
              onClick={handleGetUser}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Get User
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Update User
            </Button>
            <Button
              onClick={handleGetAllUsers}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Get All Users
            </Button>
          </div>
          {result && <ResultDisplay result={result} />}
        </div>
      </CardContent>
    </Card>
  );
}
