import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { ScryfallCard } from "./create-listing-form";
import type { Dictionary } from '@/lib/definitions';
import { useMemo } from "react";

interface CardDetailsFormProps {
  t: Dictionary['createListing'];
  allCardPrints: ScryfallCard[];
  selectedVariant: string;
  setSelectedVariant: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  availableLanguages: string[];
  condition: string;
  setCondition: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
}

function getVariantName(print: ScryfallCard, finish: string) {
    let name = `${finish.charAt(0).toUpperCase() + finish.slice(1)}`;
    if (print.frame_effects?.includes('showcase')) name = `${name} [Showcase]`;
    if (print.full_art) name = `${name} [Full Art]`;
    if (print.border_crop && !print.full_art) name = `${name} [Borderless]`;
    return name;
}


export function CardDetailsForm({
  t,
  allCardPrints,
  selectedVariant,
  setSelectedVariant,
  selectedLanguage,
  setSelectedLanguage,
  availableLanguages,
  condition,
  setCondition,
  quantity,
  setQuantity,
}: CardDetailsFormProps) {

  const uniqueEditions = useMemo(() => {
    const seen = new Set<string>();
    return allCardPrints.filter(print => {
      if (seen.has(print.set)) {
        return false;
      } else {
        seen.add(print.set);
        return true;
      }
    });
  }, [allCardPrints]);
  
  const selectedPrintData = useMemo(() => {
    if (!selectedVariant) return null;
    const [selectedId] = selectedVariant.split('-');
    return allCardPrints.find(p => p.id === selectedId) || null;
  }, [selectedVariant, allCardPrints]);

  const printsForSelectedSet = useMemo(() => {
    if (!selectedPrintData) return [];
    return allCardPrints.filter(p => p.set === selectedPrintData.set);
  }, [selectedPrintData, allCardPrints]);

  const handleEditionChange = (setAbbr: string) => {
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
            <Select value={selectedPrintData?.set || ''} onValueChange={handleEditionChange}>
                <SelectTrigger>
                    <SelectValue placeholder={t.selectEdition} />
                </SelectTrigger>
                <SelectContent>
                    {uniqueEditions.map(edition => (
                        <SelectItem key={edition.set} value={edition.set}>
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
