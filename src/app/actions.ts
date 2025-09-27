"use server";

export async function fetchSmartFilters(query: string): Promise<string[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }
  try {
    // const result = await smartFilterSuggestionsFlow({ query });
    // return result.suggestedFilters;
    return []; // Temporarily disabled to fix build error
  } catch (error) {
    console.error("Error fetching smart filters:", error);
    // In case of an error, return an empty array to prevent UI crashes.
    return [];
  }
}
