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

export const getAllStocks = async (): Promise<GetAllStocksResponse> => api.get("/stocks/all");