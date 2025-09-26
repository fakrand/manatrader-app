
"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Image as ImageIcon } from "lucide-react";
import { Locale } from "@/i18n-config";
import { cn } from '@/lib/utils';
import type { getDictionary } from '@/lib/dictionaries';

// This would ideally come from a comprehensive database fetched from an API
const MOCK_CARD_NAMES = [
    "Sol Ring",
    "Swords to Plowshares",
    "Black Lotus",
    "Brainstorm",
    "Lightning Bolt",
    "Counterspell",
    "Dark Ritual",
    "Demonic Tutor",
    "Birds of Paradise",
    "Wrath of God"
];


type CreateListingPageProps = {
    t: Awaited<ReturnType<typeof getDictionary>>['createListing'];
    lang: Locale;
};

function CreateListingClientPage({ t, lang }: CreateListingPageProps) {
    const listingLimitReached = false;

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    const filteredSuggestions = useMemo(() => {
        if (!searchQuery) return [];
        return MOCK_CARD_NAMES.filter(name =>
            name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedCard(null);
        if (value) {
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
        setActiveSuggestion(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === 'Enter' && activeSuggestion > -1) {
                e.preventDefault();
                handleSuggestionClick(suggestions[activeSuggestion]);
            } else if (e.key === 'Escape') {
                setSuggestions([]);
            }
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setSelectedCard(suggestion);
        setSuggestions([]);
    };
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
            setSuggestions([]);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [suggestionsRef]);


    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-4xl font-bold font-headline mb-2">{t.title}</h1>
            <p className="text-muted-foreground mb-8">{t.description}</p>

            <form className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.step1Title}</CardTitle>
                        <CardDescription>{t.step1Description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 relative">
                            <Label htmlFor="card-search">{t.step1SearchLabel}</Label>
                            <Input
                                id="card-search"
                                placeholder={t.step1SearchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                            />
                            {suggestions.length > 0 && (
                                <ul ref={suggestionsRef} className="absolute z-10 w-full bg-card border border-border rounded-md mt-1 shadow-lg">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={suggestion}
                                            className={cn(
                                                "px-3 py-2 cursor-pointer hover:bg-muted",
                                                index === activeSuggestion && "bg-muted"
                                            )}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="edition">{t.editionLabel}</Label>
                            <Select disabled={!selectedCard}>
                                <SelectTrigger id="edition">
                                    <SelectValue placeholder={t.selectEdition} />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* In a real scenario, this would be populated based on the selected card */}
                                    <SelectItem value="LEA">Limited Edition Alpha</SelectItem>
                                    <SelectItem value="LEB">Limited Edition Beta</SelectItem>
                                    <SelectItem value="2ED">Unlimited Edition</SelectItem>
                                    <SelectItem value="CMR">Commander Legends</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t.step2Title}</CardTitle>
                        <CardDescription>
                            {selectedCard ? 
                                t.step2DescriptionSelected.replace('{cardName}', selectedCard) : 
                                t.step2Description
                            }
                        </CardDescription>
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
                            <Select disabled={!selectedCard}>
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
                            <Select disabled={!selectedCard}>
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
        </div>
    );
}


// This is the new async Server Component to fetch the dictionary
export default async function CreateListingPage({ params: { lang } }: { params: { lang: Locale } }) {
    const { getDictionary } = await import('@/lib/dictionaries');
    const dict = await getDictionary(lang);
    const t = dict.createListing;
    
    // We wrap the client component in Suspense for better loading experience
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateListingClientPage t={t} lang={lang} />
        </Suspense>
    );
}

    

    