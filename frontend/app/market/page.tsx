"use client";
import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { getAllStocks } from "../utils/stock-api";
import Loader from "../_component_library/Loader";
import useSocket from "@/app/_component_library/Socket";
import StockCard, {Stock} from "@/components/StockCard";


const Page = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("market_update", (data) => {
      console.log("🔔 Market Update:", data);
    });

    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await getAllStocks();

          const formattedStocks = response.stocks.map((stock: any) => ({
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            color: stock.color || "blue-200",
            price: stock.price || Math.random() * 1000 + 50, // Mock price if not available
            change: stock.change || Math.random() * 20 - 10, // Mock change if not available
            changePercent: stock.changePercent || Math.random() * 5 - 2.5, // Mock percent if not available
          }));
          setStocks(formattedStocks);
      } catch (err) {
        console.error("Error fetching stocks:", err);
        setError("Failed to load market data");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();

    return () => {
      socket.off("market_update");
    };
  }, [socket]);

  // Filter stocks based on search term
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SessionAuth>
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8">Market</h1>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search stocks..."
              className="w-full p-3 bg-gray-800 rounded-lg text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <Loader />}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-400">
                Available Stocks
              </h2>

              <div className="space-y-4">
                {filteredStocks.length === 0 && (
                  <p className="text-gray-400">
                    No stocks found matching your search.
                  </p>
                )}

                {filteredStocks.map((stock) => (
                  <StockCard key={stock.id} stock={stock} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </SessionAuth>
  );
};

export default Page;
