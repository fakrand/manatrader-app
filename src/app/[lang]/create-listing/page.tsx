import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getDictionary } from "@/lib/dictionaries";
import { HelpCircle, Image as ImageIcon } from "lucide-react";

export default async function CreateListingPage({ params: { lang } }: { params: { lang: 'es' | 'en' } }) {
    const dict = await getDictionary(lang);
    const t = dict.createListing;
    const cardSelected = true; // This would be state in a real implementation
    const listingLimitReached = false; // This would be derived from user data
    const cardName = "Sol Ring (Commander 2021)";

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-4xl font-bold font-headline mb-2">{t.title}</h1>
            <p className="text-muted-foreground mb-8">{t.description}</p>

            {!cardSelected ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{t.step1Title}</CardTitle>
                        <CardDescription>{t.step1Description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder={t.step1SearchPlaceholder} />
                    </CardContent>
                </Card>
            ) : (
                <form className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.step2Title}</CardTitle>
                            <CardDescription>{t.step2Description.replace('{cardName}', cardName)}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">{t.priceLabel}</Label>
                                <Input id="price" type="number" placeholder={t.pricePlaceholder} />
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <HelpCircle className="w-3 h-3"/> {t.marketPrice.replace('{price}', '6.78')}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">{t.quantityLabel}</Label>
                                <Input id="quantity" type="number" defaultValue="1" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="condition">{t.conditionLabel}</Label>
                                <Select>
                                    <SelectTrigger id="condition">
                                        <SelectValue placeholder={t.selectCondition} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NM">{t.conditions.NM}</SelectItem>
                                        <SelectItem value="LP">{t.conditions.LP}</SelectItem>
                                        <SelectItem value="MP">{t.conditions.MP}</SelectItem>
                                        <SelectItem value="HP">{t.conditions.HP}</SelectItem>
                                        <SelectItem value="DMG">{t.conditions.DMG}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="language">{t.languageLabel}</Label>
                                <Select>
                                    <SelectTrigger id="language">
                                        <SelectValue placeholder={t.selectLanguage} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">{t.languages.en}</SelectItem>
                                        <SelectItem value="es">{t.languages.es}</SelectItem>
                                        <SelectItem value="jp">{t.languages.jp}</SelectItem>
                                        <SelectItem value="de">{t.languages.de}</SelectItem>
                                        <SelectItem value="fr">{t.languages.fr}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="foil">{t.foilLabel}</Label>
                                <Select>
                                    <SelectTrigger id="foil">
                                        <SelectValue placeholder={t.selectFoil} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{t.foils.none}</SelectItem>
                                        <SelectItem value="foil">{t.foils.foil}</SelectItem>
                                        <SelectItem value="etched">{t.foils.etched}</SelectItem>
                                        <SelectItem value="galaxy">{t.foils.galaxy}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>{t.imagesLabel}</Label>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="w-1/2 h-32 flex flex-col items-center justify-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        <span>{t.frontImage}</span>
                                    </Button>
                                    <Button variant="outline" className="w-1/2 h-32 flex flex-col items-center justify-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        <span>{t.backImage}</span>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="comments">{t.commentsLabel}</Label>
                                <Textarea id="comments" placeholder={t.commentsPlaceholder} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground" disabled={listingLimitReached}>
                            {listingLimitReached ? t.listingLimitReached : t.publishListing}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
