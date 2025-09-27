"use server";

import { smartFilterSuggestionsFlow } from "@/ai/flows/smart-filter-suggestions";

export async function fetchSmartFilters(query: string): Promise<string[]> {
  if (!query) {
    return [];
  }
  try {
    const suggestions = await smartFilterSuggestionsFlow({ query });
    return suggestions.suggestedFilters || [];
  } catch (error) {
    console.error("Error fetching smart filters:", error);
    return [];
  }
}
