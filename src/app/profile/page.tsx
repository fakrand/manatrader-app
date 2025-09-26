import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star } from "lucide-react";

export default function ProfilePage() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user_avatar_1');
    const listingsUsed = 8;
    const listingLimit = 20;

    const tierColors = {
        'Common': 'bg-rarity-common text-black',
        'Uncommon': 'bg-rarity-uncommon text-black',
        'Rare': 'bg-rarity-rare text-black',
        'Mythic': 'bg-rarity-mythic text-white',
    };
    const tier = 'Common';
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <Card className="w-full md:w-1/3 sticky top-20">
                    <CardHeader className="text-center">
                        <Avatar className="w-24 h-24 mx-auto border-4 border-primary">
                            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                            <AvatarFallback className="text-4xl">P1</AvatarFallback>
                        </Avatar>
                        <CardTitle className="pt-4 font-headline text-3xl">PlayerOne</CardTitle>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-center cursor-pointer">
                                        <Badge className={`font-pixel text-sm px-4 py-1 mt-2 ${tierColors[tier]}`}>{tier}</Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Plan {tier}: {listingLimit} active listings max.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Listings Used</span>
                                <span>{listingsUsed} / {listingLimit}</span>
                            </div>
                            <Progress value={(listingsUsed / listingLimit) * 100} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center gap-2">
                             <div className="flex items-center text-yellow-400">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5" />
                            </div>
                            <span className="text-muted-foreground">(4.1 Average Rating)</span>
                        </div>
                        <Button className="w-full bg-primary/80 hover:bg-primary">Edit Profile</Button>
                    </CardContent>
                </Card>

                <div className="w-full md:w-2/3 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Listings</CardTitle>
                            <CardDescription>Manage your active buy and sell listings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-center py-8">No active listings yet.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reputation & Reviews</CardTitle>
                            <CardDescription>Reviews from your completed transactions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
