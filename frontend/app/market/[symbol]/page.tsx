import { getStock, getStockProfile } from "@/app/utils/stock-api";

import React from "react";

interface StockProfile {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  OfficialSite: string;
  FiscalYearEnd: string;
  LatestQuarter: string;
  MarketCapitalization: string;
  EBITDA: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  RevenuePerShareTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  DilutedEPSTTM: string;
  QuarterlyEarningsGrowthYOY: string;
  QuarterlyRevenueGrowthYOY: string;
  AnalystTargetPrice: string;
  TrailingPE: string;
  ForwardPE: string;
  PriceToSalesRatioTTM: string;
  PriceToBookRatio: string;
  EVToRevenue: string;
  EVToEBITDA: string;
  Beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
  "50DayMovingAverage": string;
  "200DayMovingAverage": string;
  SharesOutstanding: string;
  DividendDate: string;
  ExDividendDate: string;
  AnalystRatingStrongBuy: string;
  AnalystRatingBuy: string;
  AnalystRatingHold: string;
  AnalystRatingSell: string;
  AnalystRatingStrongSell: string;
}

// Format market cap for display
const formatLargeNumber = (numStr: string): string => {
  if (numStr === "None" || !numStr) return "N/A";

  const num = parseFloat(numStr);
  if (isNaN(num)) return "N/A";

  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

// Calculate color based on yearly performance
const calculatePerformance = (
  profileData: StockProfile
): { textColor: string; bgColor: string } => {
  const change = parseFloat(profileData.QuarterlyEarningsGrowthYOY);

  if (isNaN(change))
    return { textColor: "text-gray-400", bgColor: "bg-gray-800" };

  if (change > 0)
    return { textColor: "text-green-400", bgColor: "bg-green-900" };
  return { textColor: "text-red-400", bgColor: "bg-red-900" };
};

export default async function StockProfilePage({
  params,
}: {
  params: { symbol: string };
}) {
  const symbol = params?.symbol;
  const profileData: StockProfile = await getStockProfile(symbol);
  const stockData = await getStock(symbol);
  const performance = calculatePerformance(profileData);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: stockData?.color }}
          >
            <span className="text-xl font-bold text-white">
              {profileData.Symbol.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-bold">{profileData.Name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xl text-gray-400">{profileData.Symbol}</p>
              <p className="text-sm px-2 py-0.5 rounded bg-gray-800">
                {profileData.Exchange}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Price Overview Card */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl text-gray-400 mb-2">Price Overview</h2>
            <p className="text-4xl font-bold mb-2">
              $
              {profileData.AnalystTargetPrice !== "None"
                ? parseFloat(profileData.AnalystTargetPrice).toFixed(2)
                : "N/A"}
            </p>
            <div
              className={`inline-block px-2 py-1 rounded ${performance.bgColor} ${performance.textColor}`}
            >
              {profileData.QuarterlyEarningsGrowthYOY !== "None"
                ? `${(
                    parseFloat(profileData.QuarterlyEarningsGrowthYOY) * 100
                  ).toFixed(2)}%`
                : "N/A"}
            </div>
          </div>

          {/* Market Stats Card */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl text-gray-400 mb-2">Market Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Market Cap</p>
                <p className="font-medium">
                  {formatLargeNumber(profileData.MarketCapitalization)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">P/E Ratio</p>
                <p className="font-medium">
                  {profileData.PERatio !== "None" ? profileData.PERatio : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">52 Week High</p>
                <p className="font-medium">
                  $
                  {profileData["52WeekHigh"] !== "None"
                    ? profileData["52WeekHigh"]
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">52 Week Low</p>
                <p className="font-medium">
                  $
                  {profileData["52WeekLow"] !== "None"
                    ? profileData["52WeekLow"]
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Card */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
          <p className="text-gray-300 mb-6">{profileData.Description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Sector</p>
              <p className="font-medium">{profileData.Sector}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Industry</p>
              <p className="font-medium">{profileData.Industry}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Country</p>
              <p className="font-medium">{profileData.Country}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Website</p>
              <a
                href={profileData.OfficialSite}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                {profileData.OfficialSite}
              </a>
            </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Financial Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Profitability</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">EPS</p>
                  <p className="font-medium">
                    {profileData.EPS !== "None" ? `$${profileData.EPS}` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Profit Margin</p>
                  <p className="font-medium">
                    {profileData.ProfitMargin !== "None"
                      ? `${(parseFloat(profileData.ProfitMargin) * 100).toFixed(
                          2
                        )}%`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">ROE</p>
                  <p className="font-medium">
                    {profileData.ReturnOnEquityTTM !== "None"
                      ? `${(
                          parseFloat(profileData.ReturnOnEquityTTM) * 100
                        ).toFixed(2)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Growth</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">Revenue Growth (YoY)</p>
                  <p className="font-medium">
                    {profileData.QuarterlyRevenueGrowthYOY !== "None"
                      ? `${(
                          parseFloat(profileData.QuarterlyRevenueGrowthYOY) *
                          100
                        ).toFixed(2)}%`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Earnings Growth (YoY)</p>
                  <p className="font-medium">
                    {profileData.QuarterlyEarningsGrowthYOY !== "None"
                      ? `${(
                          parseFloat(profileData.QuarterlyEarningsGrowthYOY) *
                          100
                        ).toFixed(2)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Valuation</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">Trailing P/E</p>
                  <p className="font-medium">
                    {profileData.TrailingPE !== "None"
                      ? profileData.TrailingPE
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Forward P/E</p>
                  <p className="font-medium">
                    {profileData.ForwardPE !== "None"
                      ? profileData.ForwardPE
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">PEG Ratio</p>
                  <p className="font-medium">
                    {profileData.PEGRatio !== "None"
                      ? profileData.PEGRatio
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyst Ratings */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Analyst Ratings</h2>
          <div className="flex items-center mb-6">
            <div
              className="h-8 bg-green-600 rounded-l-full"
              style={{
                width: `${
                  (parseInt(profileData.AnalystRatingStrongBuy || "0") +
                    parseInt(profileData.AnalystRatingBuy || "0")) *
                  10
                }px`,
              }}
            ></div>
            <div
              className="h-8 bg-gray-500"
              style={{
                width: `${
                  parseInt(profileData.AnalystRatingHold || "0") * 10
                }px`,
              }}
            ></div>
            <div
              className="h-8 bg-red-600 rounded-r-full"
              style={{
                width: `${
                  (parseInt(profileData.AnalystRatingSell || "0") +
                    parseInt(profileData.AnalystRatingStrongSell || "0")) *
                  10
                }px`,
              }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-medium text-green-400">Buy</p>
              <p className="text-2xl font-bold">
                {parseInt(profileData.AnalystRatingStrongBuy || "0") +
                  parseInt(profileData.AnalystRatingBuy || "0")}
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-400">Hold</p>
              <p className="text-2xl font-bold">
                {profileData.AnalystRatingHold || "0"}
              </p>
            </div>
            <div>
              <p className="font-medium text-red-400">Sell</p>
              <p className="text-2xl font-bold">
                {parseInt(profileData.AnalystRatingSell || "0") +
                  parseInt(profileData.AnalystRatingStrongSell || "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <form action="/api/add-to-portfolio" method="post">
            <input type="hidden" name="symbol" value={profileData.Symbol} />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
            >
              Add to Portfolio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
