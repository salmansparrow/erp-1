const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://erp-1-tau.vercel.app";

export async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch data.");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}
