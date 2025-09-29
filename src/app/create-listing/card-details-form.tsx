
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { ScryfallCard } from "./create-listing-form";
import type { Dictionary } from '@/lib/definitions';

interface CardDetailsFormProps {
  t: Dictionary['createListing'];
  allCardPrints: ScryfallCard[];
  uniqueEditions: ScryfallCard[];
  selectedSet: string;
  setSelectedSet: (value: string) => void;
  selectedVariant: string;
  setSelectedVariant: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  availableLanguages: string[];
  condition: string;
  setCondition: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  printsForSelectedSet: ScryfallCard[];
}

function getVariantName(print: ScryfallCard, finish: string) {
    let name = `${print.finishes.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}`;
    if (print.frame_effects?.includes('showcase')) name = `${name} [Showcase]`;
    if (print.full_art) name = `${name} [Full Art]`;
    if (print.border_crop && !print.full_art) name = `${name} [Borderless]`;
    return name;
}

export function CardDetailsForm({
  t,
  allCardPrints,
  uniqueEditions,
  selectedSet,
  setSelectedSet,
  selectedVariant,
  setSelectedVariant,
  selectedLanguage,
  setSelectedLanguage,
  availableLanguages,
  condition,
  setCondition,
  quantity,
  setQuantity,
  printsForSelectedSet
}: CardDetailsFormProps) {

  useEffect(() => {
    if (uniqueEditions.length > 0 && !selectedSet) {
      setSelectedSet(uniqueEditions[0].set);
    }
    // Set a default variant when the set changes or on initial load
    if (printsForSelectedSet.length > 0) {
        const firstPrintInSet = printsForSelectedSet[0];
        if (firstPrintInSet && !selectedVariant.startsWith(firstPrintInSet.id)) {
             setSelectedVariant(`${firstPrintInSet.id}-${firstPrintInSet.finishes[0]}`);
        }
    }
  }, [selectedSet, uniqueEditions, printsForSelectedSet, setSelectedSet, setSelectedVariant, selectedVariant]);

  const handleEditionChange = (setAbbr: string) => {
    setSelectedSet(setAbbr);
    const firstPrintInNewSet = allCardPrints.find(p => p.set === setAbbr);
    if(firstPrintInNewSet) {
        // Automatically select the first variant of the new set
        setSelectedVariant(`${firstPrintInNewSet.id}-${firstPrintInNewSet.finishes[0]}`);
    }
  };


  return (
    <CardContent className="space-y-4 p-4 pt-0">
        <div>
            <Label>{t.editionLabel}</Label>
            <Select value={selectedSet} onValueChange={handleEditionChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t.selectEdition} />
                </SelectTrigger>
                <SelectContent>
                    {uniqueEditions.map(edition => (
                        <SelectItem key={edition.id} value={edition.set}>
                            {edition.set_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label>{t.foilLabel}</Label> 
            <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger>
                    <SelectValue placeholder="Select print variant" />
                </SelectTrigger>
                <SelectContent>
                {printsForSelectedSet.flatMap(print => 
                    print.finishes.map(finish => (
                        <SelectItem key={`${print.id}-${finish}`} value={`${print.id}-${finish}`}>
                            {getVariantName(print, finish)}
                        </SelectItem>
                    ))
                )}
                </SelectContent>
            </Select>
        </div>


      <div>
        <Label>{t.languageLabel}</Label>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger>
            <SelectValue placeholder={t.selectLanguage} />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map(lang => (
              <SelectItem key={lang} value={lang}>
                {t.languages[lang] || lang.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t.conditionLabel}</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger>
              <SelectValue />
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

        <div>
          <Label>{t.quantityLabel}</Label>
          <Input
            type="number"
            value={quantity}
            min={1}
            onChange={e => setQuantity(Number(e.target.value))}
          />
        </div>
      </div>
    </CardContent>
  );
}
