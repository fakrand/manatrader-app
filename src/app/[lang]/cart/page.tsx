import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDictionary } from "@/lib/dictionaries";
import { ShoppingCart } from "lucide-react";
import { Locale } from "@/i18n-config";

export default async function CartPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const t = dict.cart;
  const isEmpty = true;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold font-headline tracking-tight">{t.emptyTitle}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t.emptyDescription}</p>
        <Button className="mt-6">{t.browseCards}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">{t.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.orderFrom.replace('{vendor}', 'CardKing')}</CardTitle>
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
              <CardTitle className="text-lg">{t.orderFrom.replace('{vendor}', 'ManaManiac')}</CardTitle>
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
              <CardTitle>{t.checkoutSummary}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>S/ 150.00</span>
              </div>
               <div className="flex justify-between">
                <span>{t.shipping}</span>
                <span className="text-muted-foreground">{t.shippingCalculated}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t.total}</span>
                <span>S/ 150.00</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/80 text-accent-foreground">{t.proceedToCheckout}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
