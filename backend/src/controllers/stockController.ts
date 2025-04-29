import { Request, Response } from 'express';
import finnhub from 'finnhub';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Finnhub client
const finnhubClient = new finnhub.DefaultApi();
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';

// Set up API key for authentication
const apiKey = finnhub.ApiClient.instance.authentications['api_key'];
apiKey.apiKey = FINNHUB_API_KEY;

// Get company profile
export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    
    finnhubClient.companyProfile2({ symbol }, (error: any, data: any) => {
      if (error) {
        console.error('Error fetching company profile:', error);
        return res.status(500).json({ error: 'Failed to fetch company profile' });
      }
      
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error('Exception in getCompanyProfile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get stock quote
export const getStockQuote = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    
    finnhubClient.quote(symbol, (error: any, data: any) => {
      if (error) {
        console.error('Error fetching stock quote:', error);
        return res.status(500).json({ error: 'Failed to fetch stock quote' });
      }
      
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error('Exception in getStockQuote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Search for stocks
export const searchStocks = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    finnhubClient.symbolSearch(query as string, (error: any, data: any) => {
      if (error) {
        console.error('Error searching stocks:', error);
        return res.status(500).json({ error: 'Failed to search stocks' });
      }
      
      return res.status(200).json(data);
    });
  } catch (error) {
    console.error('Exception in searchStocks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get historical candle data
export const getCandles = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { resolution, from, to } = req.query;
    
    if (!symbol || !resolution || !from || !to) {
      return res.status(400).json({ 
        error: 'Symbol, resolution, from, and to parameters are required' 
      });
    }
    
    finnhubClient.stockCandles(
      symbol, 
      resolution as string, 
      parseInt(from as string), 
      parseInt(to as string), 
      (error: any, data: any) => {
        if (error) {
          console.error('Error fetching candle data:', error);
          return res.status(500).json({ error: 'Failed to fetch candle data' });
        }
        
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    console.error('Exception in getCandles:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};