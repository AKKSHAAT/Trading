import React from "react";
import BSButtons from "../BS-Buttons";
import OrderModal from "../OrderModal";

export interface Stock {
  id: number;
  symbol: string;
  name: string;
  price?: number;
  change: number;
  changePercent?: number;
  color: string; // Assuming color is a string representing the color
  avgBuyPrice?: number; // Optional property for average price
  quantity?: number; // Optional property for quantity
}

const StockCard = ({ stock }: { stock: Stock }) => {
  const isPositive = stock.change >= 0;
  const [showModal, setShowModal] = React.useState(false);
  console.log("StockCard props:", stock);

  const redirect = () => {
    window.location.href = `/market/${stock.symbol}`;
  }; 

  return (
    <>
      <div className="group bg-gray-900 p-4 rounded-lg flex items-center justify-between hover:bg-gray-800 cursor-pointer transition-colors relative">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: stock.color }}
          >
            <span className="text-xl font-bold">{stock.symbol.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <p className="font-medium">{stock.name}</p>
              {stock.quantity && <p>💼x{stock?.quantity}</p>}
              <div >
                <BSButtons onBuyClick={()=> setShowModal(true)} onSellClick={()=> setShowModal(true)}/>
              </div>
            </div>
            <p className="text-sm text-gray-400">{stock.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">

            {stock.avgBuyPrice ? (
              <p className="font-medium">
                ${(stock.avgBuyPrice || 0.0).toFixed(2)}
              </p>
            ) : (
              <p className="font-medium">${(stock?.price || 0.0).toFixed(2)}</p>
            )}
          </div>
          <p
            className={`text-sm ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {stock.change ? (
              <>
                {(stock?.change || 0.0).toFixed(2)}&nbsp;
                {(stock?.changePercent || 0.0).toFixed(2)}%
              </>
            ) : (
              <></>
            )}
          </p>
        </div>
      </div>
      {showModal && <OrderModal stockName={stock.name} stockSymbol={stock.symbol} closeModal={()=>setShowModal(false)} />}
    </>
  );
};

export default StockCard;
