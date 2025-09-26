import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const isEmpty = true;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold font-headline tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-lg text-muted-foreground">Looks like you haven't added any cards yet.</p>
        <Button className="mt-6">Browse Cards</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order from CardKing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item 1 */}
              <p>Item will go here</p>
              <Separator />
              {/* Item 2 */}
              <p>Item will go here</p>
            </CardContent>
          </Card>
           {/* Vendor 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order from ManaManiac</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Item 1 */}
              <p>Item will go here</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>Checkout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>S/ 150.00</span>
              </div>
               <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-muted-foreground">Calculated at next step</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>S/ 150.00</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
