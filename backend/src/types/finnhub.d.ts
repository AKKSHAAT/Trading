declare module 'finnhub' {
  export interface StockSymbol {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }

  export interface Quote {
    c: number; // Current price
    d: number; // Change
    dp: number; // Percent change
    h: number; // High price of the day
    l: number; // Low price of the day
    o: number; // Open price of the day
    pc: number; // Previous close price
    t: number; // Timestamp
  }

  export interface CompanyProfile {
    country: string;
    currency: string;
    exchange: string;
    ipo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
    logo: string;
    finnhubIndustry: string;
  }

  export interface CandleData {
    c: number[]; // Close prices
    h: number[]; // High prices
    l: number[]; // Low prices
    o: number[]; // Open prices
    s: string; // Status
    t: number[]; // Timestamps
    v: number[]; // Volumes
  }

  export class DefaultApi {
    constructor();
    
    companyProfile2(params: { symbol: string }, callback: (error: any, data: CompanyProfile, response: any) => void): void;
    
    quote(symbol: string, callback: (error: any, data: Quote, response: any) => void): void;
    
    symbolSearch(query: string, callback: (error: any, data: { count: number, result: StockSymbol[] }, response: any) => void): void;
    
    stockCandles(
      symbol: string, 
      resolution: string, 
      from: number, 
      to: number, 
      callback: (error: any, data: CandleData, response: any) => void
    ): void;
  }

  export const ApiClient: {
    instance: {
      authentications: {
        'api_key': {
          apiKey: string;
          apiKeyPrefix?: string;
        };
      };
    };
  };
}