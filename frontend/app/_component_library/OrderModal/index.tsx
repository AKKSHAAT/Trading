import { marketBuyOrder, marketSellOrder } from "@/app/utils/order-api";
import { fetchUserInfo } from "@/app/utils/user-utils";
import React, { useState } from "react";

interface OrderModalProps {
  stockName: string;
  stockSymbol: string;
  closeModal: () => void;
  action: "buy" | "sell";
}

const OrderModal: React.FC<OrderModalProps> = ({
  stockName,
  stockSymbol,
  closeModal,
  action
}) => {
  const [activeTab, setActiveTab] = useState<"market" | "limit">("market");
  const [activeAction, setActiveAction] = useState(action);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [loading , setLoading] = useState(false);

  const handleLimitOrder = async (quantity: string, price: string) => {
    setLoading(true);
    const userData = await fetchUserInfo();
    if (!userData) return;
    const order = {
      symbol: stockSymbol,
      quantity: Number(quantity),
      price: Number(price),
      userId: userData.userId,
    }
    if (activeAction === "sell") {
    const sold = await marketSellOrder(order)
    } else {
      const bought = await marketBuyOrder(order);
    }
    setLoading(false);
    closeModal();
  };

  const handleMarketOrder = async (quantity: string) => {
    // Implement market order logic here
    setLoading(true);
    const userData = await fetchUserInfo();
    if (!userData) return;
    const order = {
        symbol: stockSymbol,
        quantity: Number(quantity),
        userId: userData.userId,
    };

    if (activeAction === "sell") {
      const sold = await marketSellOrder(order)
    } else {
      const bought = await marketBuyOrder(order);
    }
    setLoading(false);
    closeModal();
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-950 border border-gray-700 p-5 w-96 rounded-lg shadow-lg">
      <button
        className="absolute top-2 right-4 text-gray-400 hover:text-gray-200 text-2xl focus:outline-none"
        onClick={closeModal}
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-lg font-semibold mb-4">
        {stockName} ({stockSymbol})
      </h2>
      <div className="flex mb-4">
        <button
          className={`flex-1 p-2 cursor-pointer ${
            activeAction === "buy" ? "bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => setActiveAction("buy")}
        >
          Buy
        </button>
        <button
          className={`flex-1 p-2 cursor-pointer ${
            activeAction === "sell" ? "bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => setActiveAction("sell")}
        >
          Sell
        </button>
      </div>

      <div className="flex mb-4">
        <button
          className={`flex-1 p-2 cursor-pointer ${
            activeTab === "market" ? "bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => setActiveTab("market")}
        >
          Market
        </button>
        <button
          className={`flex-1 p-2 cursor-pointer ${
            activeTab === "limit" ? "bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => setActiveTab("limit")}
        >
          Limit
        </button>
      </div>

      {activeTab === "market" && (
        <div>
          <label className="block mb-2">
            Quantity:
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
        </div>
      )}

      {activeTab === "limit" && (
        <div>
          <label className="block mb-2">
            Quantity:
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Price:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
        </div>
      )}

      <button
        className="mt-4 p-2 w-full bg-blue-900 text-white rounded hover:bg-blue-800"
        onClick={() => {
          if (activeTab === "market") {
            handleMarketOrder(qty);
          } else {
            handleLimitOrder(qty, price);
          }
        }}
      >
        Submit {activeAction === "buy" ? "Buy" : "Sell"} Order
      </button>
    </div>
  );
};

export default OrderModal;
