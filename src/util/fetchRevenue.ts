export const fetchRevenue = async (monthsAgo: number) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_POCKETBASE_URL}/revenue-data`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ monthsAgo }),
      }
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching revenue (client): ", error);
    throw error;
  }
};
