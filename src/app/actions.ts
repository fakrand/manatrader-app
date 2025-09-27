"use server";

export async function fetchSmartFilters(query: string): Promise<string[]> {
  // Temporarily disabled to prevent build errors.
  // This function was causing a "server-only" module to be included in the client bundle.
  return [];
}
