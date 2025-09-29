
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Suggestion } from "./create-listing-form";
import type { Dictionary } from '@/lib/definitions';

interface CardSearchProps {
  t: Dictionary['createListing'];
  cardName: string;
  setCardName: (name: string) => void;
  suggestions: Suggestion[];
  handleSuggestionClick: (suggestion: Suggestion) => void;
}

export function CardSearch({ t, cardName, setCardName, suggestions, handleSuggestionClick }: CardSearchProps) {
  return (
    <CardContent className="space-y-4 p-4">
      <div>
        <Label>{t.step1SearchLabel}</Label>
        <Input
          value={cardName}
          onChange={e => setCardName(e.target.value)}
          placeholder={t.step1SearchPlaceholder}
        />
        {suggestions.length > 0 && (
          <div className="border rounded p-2 mt-2 max-h-60 overflow-y-auto">
            {suggestions.map(s => (
              <div
                key={s.id}
                className="cursor-pointer hover:bg-muted p-2 rounded"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  );
}
