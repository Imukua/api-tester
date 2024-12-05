"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { ResultDisplay } from "./result-display";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export function CartTester() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  //eslint-disable-next-line
  const [result, setResult] = useState<any>(null);

  const fetchCart = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    const cartId = "randmstring"
    if (!token || !cartId) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your cart.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const response = await apiRequest(
      `/cart/${cartId}`,
      "GET",
      undefined,
      token
    );
    setResult(response);
    if (response.success) {
      setCart(response.data);
    } else {
      toast({
        title: "Failed to fetch cart",
        description: "An error occurred while fetching the cart.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const clearCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !cart) return;

    const response = await apiRequest(
      `/cart/clear/${cart.id}`,
      "PUT",
      undefined,
      token
    );
    setResult(response);
    if (response.success) {
      setCart(null);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } else {
      toast({
        title: "Failed to clear cart",
        description: "An error occurred while clearing the cart.",
        variant: "destructive",
      });
    }
  };

  const removeCartItem = async (cartItemId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !cart) return;

    setLoadingItems((prev) => new Set(prev).add(cartItemId));

    const response = await apiRequest(
      `/cart/items/${cartItemId}`,
      "DELETE",
      { cartItemId },
      token
    );
    setResult(response);
    if (response.success) {
      setCart((prevCart) => ({
        ...prevCart!,
        items: prevCart!.items.filter((item) => item.id !== cartItemId),
      }));
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } else {
      toast({
        title: "Failed to remove item",
        description: "An error occurred while removing the item from the cart.",
        variant: "destructive",
      });
    }

    setLoadingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  const updateCartItemQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !cart) return;

    const response = await apiRequest(
      `/cart/items/${cartItemId}`,
      "PATCH",
      { cartItemId, quantity: newQuantity },
      token
    );
    setResult(response);
    if (response.success) {
      setCart((prevCart) => ({
        ...prevCart!,
        items: prevCart!.items.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        ),
      }));
      toast({
        title: "Quantity updated",
        description: "The item quantity has been updated in your cart.",
      });
    } else {
      toast({
        title: "Failed to update quantity",
        description: "An error occurred while updating the item quantity.",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = async (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0 && newQuantity <= item.product.quantity) {
      setLoadingItems((prev) => new Set(prev).add(item.id));
      await updateCartItemQuantity(item.id, newQuantity);
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const calculateTotalAmount = (items: CartItem[]) => {
    return items.reduce(
      (total, item) => total + item.amount * item.quantity,
      0
    );
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <ShoppingCart className="mr-2" /> Cart (
                {cart?.items.length || 0})
              </h2>
              <div className="space-x-2">
                <Button onClick={fetchCart} variant="outline" size="sm">
                  Refresh Cart
                </Button>
                <Button
                  onClick={clearCart}
                  variant="destructive"
                  size="sm"
                  disabled={!cart?.items.length}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-300px)]">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex gap-4 pb-6 border-b">
                      <Skeleton className="w-[100px] h-[100px] rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cart?.items.length ? (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b">
                      <Image
                        src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <Button
                            onClick={() => removeCartItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            disabled={loadingItems.has(item.id)}
                          >
                            {loadingItems.has(item.id) ? (
                              <div className="w-4 h-4 border-t-2 border-red-500 rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Seller: {item.product.brand}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleQuantityChange(item, -1)}
                              variant="outline"
                              size="sm"
                              disabled={
                                item.quantity <= 1 || loadingItems.has(item.id)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {loadingItems.has(item.id) ? (
                                <div className="w-4 h-4 border-t-2 border-orange-500 rounded-full animate-spin mx-auto"></div>
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <Button
                              onClick={() => handleQuantityChange(item, 1)}
                              variant="outline"
                              size="sm"
                              disabled={
                                item.quantity >= item.product.quantity ||
                                loadingItems.has(item.id)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              KSh {(item.amount * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              KSh {item.product.mktPrice}
                            </div>
                            <div className="text-sm text-orange-500">
                              -
                              {Math.round(
                                (1 - item.amount / item.product.mktPrice) * 100
                              )}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <Card className="bg-white sticky top-4">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">CART SUMMARY</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    KSh{" "}
                    {cart
                      ? calculateTotalAmount(cart.items).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Delivery fees not included yet.
                </p>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  CHECKOUT (KSh{" "}
                  {cart ? calculateTotalAmount(cart.items).toFixed(2) : "0.00"})
                </Button>
              </>
            )}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Returns are easy</h4>
              <p className="text-sm text-gray-500">
                Free return within 7 days{" "}
                <span className="text-blue-500 cursor-pointer">Details</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {result && <ResultDisplay result={result} />}
    </div>
  );
}
