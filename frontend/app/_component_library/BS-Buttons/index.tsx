import React from "react";

interface BSButtonsProps {
  onBuyClick: () => void;
  onSellClick: () => void;
}

const BSButtons: React.FC<BSButtonsProps> = ({ onBuyClick, onSellClick }) => {
  console.log("BSButtons props:", { onBuyClick, onSellClick });
  return (
    <div className="flex items-center gap-2 group-hover:inline-flex font-bold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
      <button
        onClick={onBuyClick}
        className="px-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
      >
        B
      </button>
      <button
        onClick={onSellClick}
        className="px-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
      >
        S
      </button>
    </div>
  );
};

export default BSButtons;
