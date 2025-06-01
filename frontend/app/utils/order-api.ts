import api from "./axios";

export interface MarketOrder {
  symbol : string;
  quantity : number;
  userId : string
  price? : number;
}


export const marketBuyOrder = async (order: MarketOrder): Promise<any> => api.post(`trade/buy`, order);
export const marketSellOrder = async (order: MarketOrder): Promise<any> => api.post(`trade/sell`, order);

export const limitBuyOrder = async (order: MarketOrder): Promise<any> => api.post(`trade/buy-lmt`, order);
export const limitSellOrder = async (order: MarketOrder): Promise<any> => api.post(`trade/sell-lmt`, order);