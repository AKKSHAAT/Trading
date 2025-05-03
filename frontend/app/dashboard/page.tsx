"use client";
import { useState, useEffect } from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { fetchUserInfo, fetchPortfolio } from "../utils/user-utils";
import { UserInfoResponse, UserPortfolio } from "../shared/types/user-types";
import Loader from "../_component_library/Loader";
import useSocket from "@/app/_component_library/Socket";

import StockCard, {Stock} from "@/components/StockCard";

const WalletBalanceCard = ({ balance }: {balance: number}) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-8">
      <h2 className="text-xl text-gray-400 mb-2">CurrentValue</h2>
      <p className="text-4xl font-bold">
        ${balance ?? 0}
      </p>
    </div>
  );
};


const Page = () => {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    // listen for updates
    socket.on('message', (data) => {
      console.log('🔔 Message:', data);
    });


    socket.on('order_update', (data) => {
      console.log('🔔 Order Update:', data);
    });

    // example: emit order to backend
    socket.emit('place_order', {
      symbol: 'AAPL',
      quantity: 5,
      type: 'buy',
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserInfo();
        console.log("User Data:", userData);
        
        if (userData?.userId) {
          const portfolioData = await fetchPortfolio(userData.userId);
          setPortfolio(portfolioData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    return () => {
      socket.off('order_update');
    };
  }, [socket]);


  return (
    <SessionAuth>
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          {loading && <Loader />}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && portfolio && (
            <>
              <WalletBalanceCard 
                balance={ portfolio.balance || 0 }
              />
              <h2 className="text-2xl font-semibold mb-4 text-gray-400">
                Holdings
              </h2>
              <div className="space-y-4">
                {portfolio.holdings.length === 0 && (
                  <p>No stocks in your portfolio yet.</p>
                )}
                {portfolio.holdings.map((stock) => (
                  <StockCard 
                    key={stock.id} 
                    stock={{
                      ...stock,
                      change: 30,
                    }} 
                  />
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
