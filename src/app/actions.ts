"use server";

import { smartFilterSuggestionsFlow } from "@/ai/flows/smart-filter-suggestions";

export async function fetchSmartFilters(query: string): Promise<string[]> {
  // This function is temporarily disabled to prevent build errors.
  // The AI-powered suggestions can be re-enabled after ensuring
  // the server-side code is correctly isolated.
  if (!query) {
    return [];
  }
  try {
    // const suggestions = await smartFilterSuggestionsFlow({ query });
    // return suggestions.suggestedFilters || [];
    return [];
  } catch (error) {
    console.error("Error fetching smart filters:", error);
    return [];
  }
}
