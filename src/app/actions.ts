"use server";

import { smartFilterSuggestionsFlow } from "@/ai/flows/smart-filter-suggestions";

export async function fetchSmartFilters(query: string): Promise<string[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }
  try {
    const result = await smartFilterSuggestionsFlow({ query });
    return result.suggestedFilters;
  } catch (error) {
    console.error("Error fetching smart filters:", error);
    // In case of an error, return an empty array to prevent UI crashes.
    return [];
  }
}
