

"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { Locale } from "@/i18n-config";
import { cn } from '@/lib/utils';
import { Dictionary } from '@/lib/definitions';
import { useDebounceValue } from 'usehooks-ts';


type ScryfallCard = {
    id: string;
    name: string;
    set: string;
    set_name: string;
    digital: boolean;
    lang: string;
    released_at: string;
    image_uris?: {
        large: string;
    };
    prices: {
        usd: string | null;
        usd_foil: string | null;
        usd_etched: string | null;
    };
    finishes: string[];
    border_color: string;
    frame_effects?: string[];
};

function getVariantInfo(card: ScryfallCard) {
    const parts = [];
    if (card.frame_effects?.includes('showcase')) parts.push('Showcase');
    if (card.border_color === 'borderless') parts.push('Borderless');
    if (card.frame_effects?.includes('extendedart')) parts.push('Extended Art');
    return parts.length > 0 ? `(${parts.join(', ')})` : '';
}


export function CreateListingForm({ t, lang }: { t: Dictionary['createListing'], lang: Locale }) {
    const listingLimitReached = false;

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebounceValue(searchQuery, 300);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
    const [cardEditions, setCardEditions] = useState<ScryfallCard[]>([]);
    const [isFetchingEditions, setIsFetchingEditions] = useState(false);
    const [selectedEditionId, setSelectedEditionId] = useState<string>('');
    const [selectedCardImage, setSelectedCardImage] = useState<string>('/card-back.png');
    const [marketPrice, setMarketPrice] = useState<string | null>(null);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [availableFinishes, setAvailableFinishes] = useState<string[]>([]);
    const [selectedFinish, setSelectedFinish] = useState('');

    const suggestionsRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearchQuery.length < 3 || debouncedSearchQuery === selectedCardName) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(debouncedSearchQuery)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch autocomplete suggestions');
                }
                const data = await response.json();
                setSuggestions(data.data || []);
            } catch (error) {
                console.error(error);
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [debouncedSearchQuery, selectedCardName]);

    useEffect(() => {
        if (selectedEditionId) {
            const edition = cardEditions.find(e => e.id === selectedEditionId);
            if (edition) {
                 if(edition.image_uris) {
                    setSelectedCardImage(edition.image_uris.large);
                 }
                 const price = edition.prices?.usd || edition.prices?.usd_foil || edition.prices?.usd_etched;
                 setMarketPrice(price || null);
            }
        } else {
            setSelectedCardImage('/card-back.png');
            setMarketPrice(null);
        }
    }, [selectedEditionId, cardEditions]);
    

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (selectedCardName && value !== selectedCardName) {
            setSelectedCardName(null);
            // Reset dependent fields when the user starts typing a new query
            setCardEditions([]);
            setSelectedEditionId('');
            setAvailableLanguages([]);
            setSelectedLanguage('');
            setAvailableFinishes([]);
            setSelectedFinish('');
            setMarketPrice(null);
            setSelectedCardImage('/card-back.png');
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

    const handleSuggestionClick = async (suggestion: string) => {
        setSearchQuery(suggestion);
        setSelectedCardName(suggestion);
        setSuggestions([]);
        setIsFetchingEditions(true);
        
        // Reset dependent fields
        setSelectedEditionId('');
        setMarketPrice(null);
        setAvailableLanguages([]);
        setSelectedLanguage('');
        setAvailableFinishes([]);
        setSelectedFinish('');
        setCardEditions([]);

        try {
            const response = await fetch(`https://api.scryfall.com/cards/search?unique=prints&q=%21"${encodeURIComponent(suggestion)}"`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch card editions');
            }
            
            const data = await response.json();
            
            const allPrints: ScryfallCard[] = data.data.filter((card: any) => !card.digital);
            
            const uniqueLanguages = [...new Set(allPrints.map(card => card.lang))];
            setAvailableLanguages(uniqueLanguages);
            if (uniqueLanguages.length > 0) {
                 // Check if the app's current language is available for the card
                const defaultLang = uniqueLanguages.includes(lang) ? lang : uniqueLanguages[0];
                setSelectedLanguage(defaultLang);
            }

            const allFinishes = [...new Set(allPrints.flatMap(p => p.finishes))];
            setAvailableFinishes(allFinishes);
            if (allFinishes.length > 0) {
                setSelectedFinish(allFinishes.includes('nonfoil') ? 'nonfoil' : allFinishes[0]);
            }
            
            allPrints.sort((a, b) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime());

            setCardEditions(allPrints);

        } catch (error) {
            console.error(error);
            setCardEditions([]);
            setAvailableLanguages([]);
        } finally {
            setIsFetchingEditions(false);
        }
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
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2 relative">
                                <Label htmlFor="card-search">{t.step1SearchLabel}</Label>
                                <Input
                                    id="card-search"
                                    placeholder={t.step1SearchPlaceholder}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="off"
                                    disabled={isFetchingEditions}
                                />
                                {suggestions.length > 0 && (
                                    <ul ref={suggestionsRef} className="absolute z-20 w-full bg-card border border-border rounded-md mt-1 shadow-lg">
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
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="edition">{t.editionLabel}</Label>
                                    <Select
                                        disabled={!selectedCardName || isFetchingEditions || cardEditions.length === 0}
                                        value={selectedEditionId}
                                        onValueChange={setSelectedEditionId}
                                    >
                                        <SelectTrigger id="edition" className='w-full'>
                                            <SelectValue placeholder={
                                                isFetchingEditions ? "Cargando..." : (cardEditions.length === 0 && selectedCardName ? "No se encontraron ediciones" : t.selectEdition)
                                            }>
                                                {isFetchingEditions && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                {selectedEditionId ? cardEditions.find(e => e.id === selectedEditionId)?.set_name : (isFetchingEditions ? "Cargando..." : t.selectEdition)}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cardEditions.map((edition) => {
                                                const variantInfo = getVariantInfo(edition);
                                                return (
                                                <SelectItem key={edition.id} value={edition.id}>
                                                    {edition.set_name} {variantInfo}
                                                </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-2">
                                <Label htmlFor="condition">{t.conditionLabel}</Label>
                                    <Select>
                                        <SelectTrigger id="condition">
                                            <SelectValue placeholder={t.selectCondition} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(Object.keys(t.conditions) as Array<keyof typeof t.conditions>).map((key) => (
                                                <SelectItem key={key} value={key}>
                                                <div className="flex items-center">
                                                    <span className="font-bold w-10 text-left">{key}</span>
                                                    <span className="mx-2">-</span>
                                                    <span>{t.conditions[key].split(' - ')[1]}</span>
                                                </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">{t.quantityLabel}</Label>
                                    <Input id="quantity" type="number" defaultValue="1" min="1" />
                                </div>
                            </div>
                        </div>
                         <div className="md:col-span-1 flex items-center justify-center">
                           <div className="aspect-[3/4] w-full max-w-[250px] relative">
                             <Image
                                src={selectedCardImage}
                                alt="Selected card"
                                layout="fill"
                                objectFit="contain"
                                className="rounded-xl shadow-lg"
                              />
                           </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t.step2Title}</CardTitle>
                        <CardDescription>
                            {selectedCardName ? 
                                t.step2DescriptionSelected.replace('{cardName}', selectedCardName) : 
                                t.step2Description
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">{t.priceLabel}</Label>
                            <Input id="price" type="number" placeholder={t.pricePlaceholder} />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <HelpCircle className="w-3 h-3"/>
                                {marketPrice 
                                    ? t.marketPrice.replace('{price}', marketPrice) 
                                    : (selectedCardName ? 'No market price available.' : 'Select a card to see market price.')
                                }
                            </p>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="language">{t.languageLabel}</Label>
                             <Select
                                disabled={availableLanguages.length === 0}
                                value={selectedLanguage}
                                onValueChange={setSelectedLanguage}
                            >
                                <SelectTrigger id="language">
                                    <SelectValue placeholder={t.selectLanguage} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableLanguages.map((langKey) => (
                                        <SelectItem key={langKey} value={langKey}>
                                            {t.languages[langKey as keyof typeof t.languages] || langKey}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="foil">{t.foilLabel}</Label>
                            <Select 
                                disabled={availableFinishes.length === 0}
                                value={selectedFinish}
                                onValueChange={setSelectedFinish}
                            >
                                <SelectTrigger id="foil">
                                    <SelectValue placeholder={t.selectFoil} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableFinishes.map((finish) => (
                                        <SelectItem key={finish} value={finish}>
                                            {t.foils[finish as keyof typeof t.foils] || finish}
                                        </SelectItem>
                                    ))}
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
    
    


    