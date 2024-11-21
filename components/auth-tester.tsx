"use client";

import { useState } from "react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ResultDisplay } from "./result-display";

interface AuthTesterProps {
  onAuthSuccess: (userId: string, accessToken: string) => void;
  onLogout: () => void;
}

export default function AuthTester({
  onAuthSuccess,
  onLogout,
}: AuthTesterProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [userId, setUserId] = useState("");
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);

  const handleLogin = async () => {
    const response = await apiRequest("/auth/login", "POST", {
      phone,
      password,
    });
    setResult(response);
    if (response.success && response.data.tokens) {
      setRefreshToken(response.data.tokens.refreshToken);
      setUserId(response.data.user.id);
      localStorage.setItem("accessToken", response.data.tokens.accessToken);
      onAuthSuccess(response.data.user.id, response.data.tokens.accessToken);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const response = await apiRequest("/auth/logout", "POST", { refreshToken });
    if (response.success) {
      setResult("logged out successfully");
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
    } else {
      setResult("something went wrong");
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    }
    localStorage.removeItem("accessToken");
    setRefreshToken("");
    setPhone("");
    setPassword("");
    onLogout();
  };

  const handleRefreshToken = async () => {
    const response = await apiRequest("/auth/refresh-token", "POST", {
      userId,
      refreshToken,
    });
    setResult(response);
    if (response.success && response.data) {
      localStorage.setItem("accessToken", response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      toast({
        title: "Token Refreshed",
        description: "Your access token has been refreshed.",
      });
    } else {
      toast({
        title: "Token Refresh Failed",
        description: "Failed to refresh the access token.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-orange-100">
        <CardTitle className="text-orange-800">Auth Tester</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone" className="text-orange-800">
              Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-orange-300 focus:border-orange-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-orange-800">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-orange-300 focus:border-orange-500"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleLogin}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Login
            </Button>
            <Button
              onClick={handleLogout}
              disabled={!refreshToken}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Logout
            </Button>
            <Button
              onClick={handleRefreshToken}
              disabled={!refreshToken}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Refresh Token
            </Button>
          </div>
          {result && <ResultDisplay result={result} />}
        </div>
      </CardContent>
    </Card>
  );
}
