"use client";
import React from "react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";




const WalletBalanceCard = ({portfolio} : {portfolio: any}) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-8">
      <h2 className="text-xl text-gray-400 mb-2">CurrentValue</h2>
      <p className="text-4xl font-bold">{portfolio.currentValue || 0}</p>
    </div>
  )
}
const StockCard = ({stock} : {stock: any}) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-4">
          <span className="text-xl font-bold">{"₿"} {stock?.displaySymbol}</span>
        </div>
        <div>
          <p className="font-medium">{"Bitcoin"}  {stock?.name}</p>
          <p className="text-sm text-gray-400">{"BTC"}  {stock?.symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">${"12,000.00"}   {stock?.currentValue}</p>
        <p className="text-sm text-gray-400">0.50 BTC {stock?.qty}</p>
      </div>
    </div>
  )
}


const Page = () => {
  const [portfolio, setPortfolio] = React.useState({ currentValue: 0, holdings: []});
  return (
    <SessionAuth>
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

            <WalletBalanceCard portfolio={""}/>
            <h2 className="text-2xl font-semibold mb-4 text-gray-400">
              Holdings
            </h2>
            <div className="space-y-4">
              <StockCard stock={""} />
            </div>
          </div>
        </div>
    </SessionAuth>
  );
};

export default Page;
