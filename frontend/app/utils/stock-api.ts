import { StockProfile } from "@/types/stocks";
import api from "./axios";

export interface Stock {
  id: number;
  symbol: string;
  name: string;
  color: string;
}

export interface GetAllStocksResponse {
  message: string;
  stocks: Stock[];
}

export const getAllStocks = async (): Promise<GetAllStocksResponse> =>
  api.get("/stocks/all");

export const getStock = async (symbol: string): Promise<Stock> =>
  api.get(`/stocks/${symbol}`);

export const getStockProfile = async (symbol: string): Promise<StockProfile> =>
  api.get(`/stocks/profile/${symbol}`);
