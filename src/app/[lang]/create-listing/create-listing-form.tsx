
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/lib/definitions";
import { CardSearch } from "./card-search";
import { CardDetailsForm } from "./card-details-form";

export interface ScryfallCard {
  id: string;
  name: string;
  set: string;
  set_name: string;
  lang: string;
  finishes: string[];
  image_uris?: {
    normal: string;
    large: string;
  };
  prices?: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
  };
  variation_of?: string;
  promo_types?: string[];
  full_art?: boolean;
  border_crop?: string;
  frame_effects?: string[];
}

export interface Suggestion {
  id: string;
  name: string;
}

interface CreateListingFormProps {
  t: Dictionary['createListing'];
  lang: Locale;
}

export function CreateListingForm({ t, lang }: CreateListingFormProps) {
  const [cardName, setCardName] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedCard, setSelectedCard] = useState<ScryfallCard | null>(null);
  const [allCardPrints, setAllCardPrints] = useState<ScryfallCard[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [selectedCardImage, setSelectedCardImage] = useState<string | null>(null);
  const [marketPrice, setMarketPrice] = useState<string | null>(null);
  const [condition, setCondition] = useState<string>("NM");
  const [quantity, setQuantity] = useState<number>(1);

  // 🔎 Autocompletar nombres
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (cardName.length < 2) {
        setSuggestions([]);
        return;
      }
      const res = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(cardName)}`);
      const data = await res.json();
      setSuggestions(data.data.map((name: string, idx: number) => ({ id: `${idx}`, name })));
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [cardName]);

  // 🔎 Cargar prints de la carta seleccionada
  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setCardName(suggestion.name);
    setSuggestions([]);

    const res = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(`!"${suggestion.name}"`)}&unique=prints`);
    const data = await res.json();
    const prints: ScryfallCard[] = data.data;

    setAllCardPrints(prints);

    if (prints.length > 0) {
      const firstPrint = prints[0];
      setSelectedCard(firstPrint);
      setSelectedVariant(`${firstPrint.id}-${firstPrint.finishes[0]}`);
    }
  };

  const printsForSelectedSet = useMemo(() => {
    if (!selectedVariant) return [];
    const [selectedId] = selectedVariant.split('-');
    const selectedPrint = allCardPrints.find(p => p.id === selectedId);
    if (!selectedPrint) return [];
    return allCardPrints.filter(p => p.set === selectedPrint.set);
  }, [selectedVariant, allCardPrints]);

  // 📌 Actualizar datos al cambiar de variante (edición/acabado)
  useEffect(() => {
    if (!selectedVariant || allCardPrints.length === 0) return;

    const [editionId, finish] = selectedVariant.split("-");
    const selectedEdition = allCardPrints.find(e => e.id === editionId);

    if (selectedEdition) {
      setSelectedCard(selectedEdition);
      setSelectedCardImage(selectedEdition.image_uris?.large || null);

      let price = null;
      if (finish === 'foil' && selectedEdition.prices?.usd_foil) {
        price = selectedEdition.prices.usd_foil;
      } else if (finish === 'etched' && selectedEdition.prices?.usd_etched) {
        price = selectedEdition.prices.usd_etched;
      } else {
        price = selectedEdition.prices?.usd || null;
      }
      setMarketPrice(price);

      const editionPrints = allCardPrints.filter(card => card.set === selectedEdition.set);
      const editionLanguages = Array.from(new Set(editionPrints.map(card => card.lang)));
      setAvailableLanguages(editionLanguages);

      if (!editionLanguages.includes(selectedLanguage)) {
        const defaultLang = editionLanguages.includes("en") ? "en" : editionLanguages[0];
        setSelectedLanguage(defaultLang);
      }
    }
  }, [selectedVariant, allCardPrints, selectedLanguage]);

  // 📌 Actualizar imagen según idioma
  useEffect(() => {
    if (!selectedLanguage || !selectedVariant || allCardPrints.length === 0) return;

    const [editionId] = selectedVariant.split("-");
    const selectedEdition = allCardPrints.find(e => e.id === editionId);
    if (!selectedEdition) return;

    const langCard = allCardPrints.find(
      c => c.set === selectedEdition.set && c.lang === selectedLanguage && c.collector_number === selectedEdition.collector_number
    );

    if (langCard?.image_uris) {
      setSelectedCardImage(langCard.image_uris.large);
    } else if(selectedEdition.image_uris) {
      setSelectedCardImage(selectedEdition.image_uris.large);
    }

  }, [selectedLanguage, selectedVariant, allCardPrints]);


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


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardSearch
            t={t}
            cardName={cardName}
            setCardName={setCardName}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
        />
        {selectedCard && (
           <CardDetailsForm
              t={t}
              allCardPrints={allCardPrints}
              uniqueEditions={uniqueEditions}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              availableLanguages={availableLanguages}
              condition={condition}
              setCondition={setCondition}
              quantity={quantity}
              setQuantity={setQuantity}
              printsForSelectedSet={printsForSelectedSet}
           />
        )}
      </Card>

      <Card>
        <div className="p-4 flex flex-col items-center justify-center">
          {selectedCardImage ? (
            <img src={selectedCardImage} alt={cardName} className="w-full max-w-xs rounded shadow" />
          ) : (
            <p>{t.noImageSelected || "No image selected"}</p>
          )}
          {marketPrice && <p className="mt-2 text-sm text-gray-600">{t.marketPrice.replace('{price}', marketPrice)}</p>}
        </div>
      </Card>
    </div>
  );
}
