import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Image as ImageIcon } from "lucide-react";

export default function CreateListingPage() {
    const cardSelected = true; // This would be state in a real implementation
    const listingLimitReached = false; // This would be derived from user data

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-4xl font-bold font-headline mb-2">Create a New Listing</h1>
            <p className="text-muted-foreground mb-8">List your Magic: The Gathering singles for sale or trade.</p>

            {!cardSelected ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Find your card</CardTitle>
                        <CardDescription>Search the Scryfall database to find the exact card you want to list.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="Search by card name... e.g., Sol Ring" />
                    </CardContent>
                </Card>
            ) : (
                <form className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Specify Listing Details</CardTitle>
                            <CardDescription>You are listing: <span className="font-bold text-primary">Sol Ring (Commander 2021)</span></CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (Soles Peruanos)</Label>
                                <Input id="price" type="number" placeholder="e.g., 25.50" />
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <HelpCircle className="w-3 h-3"/> TCGplayer Market Price: <span className="font-bold text-foreground">$6.78</span>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity (Stock)</Label>
                                <Input id="quantity" type="number" defaultValue="1" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Select>
                                    <SelectTrigger id="condition">
                                        <SelectValue placeholder="Select card condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NM">Near Mint (NM)</SelectItem>
                                        <SelectItem value="LP">Lightly Played (LP)</SelectItem>
                                        <SelectItem value="MP">Moderately Played (MP)</SelectItem>
                                        <SelectItem value="HP">Heavily Played (HP)</SelectItem>
                                        <SelectItem value="DMG">Damaged (DMG)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select>
                                    <SelectTrigger id="language">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="jp">Japanese</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="foil">Foil Type</Label>
                                <Select>
                                    <SelectTrigger id="foil">
                                        <SelectValue placeholder="Select foil type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="foil">Foil</SelectItem>
                                        <SelectItem value="etched">Etched</SelectItem>
                                        <SelectItem value="galaxy">Galaxy Foil</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Images (Optional)</Label>
                                <div className="flex gap-4">
                                    <Button variant="outline" className="w-1/2 h-32 flex flex-col items-center justify-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        <span>Front Image</span>
                                    </Button>
                                    <Button variant="outline" className="w-1/2 h-32 flex flex-col items-center justify-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        <span>Back Image</span>
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="comments">Additional Comments</Label>
                                <Textarea id="comments" placeholder="Any details about the card, e.g., 'Slight corner wear on top left'." />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground" disabled={listingLimitReached}>
                            {listingLimitReached ? "Listing Limit Reached" : "Publish Listing"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
