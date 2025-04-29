import * as finnhub from 'finnhub';
import dotenv from 'dotenv';

dotenv.config();

// Test Finnhub Integration
export const testFinnhubConnection = async () => {
  try {
    const apiKey = process.env.FINNHUB_API_KEY || '';
    
    if (!apiKey) {
      console.error('FINNHUB_API_KEY is not defined in the environment variables');
      return false;
    }
    
    const finnhubClient = new finnhub.DefaultApi();
    finnhub.ApiClient.instance.authentications['api_key'].apiKey = apiKey;
    
    // Test the connection with a simple request
    console.log('Testing Finnhub connection...');
    
    return new Promise((resolve) => {
      finnhubClient.symbolSearch('AAPL', (error: any, data: any) => {
        if (error) {
          console.error('Finnhub connection test failed:', error);
          resolve(false);
        } else {
          console.log('Finnhub connection successful!');
          console.log('Sample data:', JSON.stringify(data, null, 2).substring(0, 200) + '...');
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('Error in testFinnhubConnection:', error);
    return false;
  }
};

// Helper function to format stock data
export const formatStockData = (data: any) => {
  if (!data) return null;
  
  return {
    symbol: data.symbol || '',
    price: data.c || 0, // Current price
    change: data.d || 0, // Price change
    percentChange: data.dp || 0, // Percent change
    highPrice: data.h || 0, // High price of the day
    lowPrice: data.l || 0, // Low price of the day
    openPrice: data.o || 0, // Open price of the day
    previousClose: data.pc || 0, // Previous close price
  };
};

// Get stock history with date formatting
export const getFormattedStockHistory = (symbol: string, resolution: string, fromDate: Date, toDate: Date) => {
  return new Promise((resolve, reject) => {
    try {
      const apiKey = process.env.FINNHUB_API_KEY || '';
      const finnhubClient = new finnhub.DefaultApi();
      finnhub.ApiClient.instance.authentications['api_key'].apiKey = apiKey;
      
      // Convert dates to UNIX timestamps (seconds)
      const from = Math.floor(fromDate.getTime() / 1000);
      const to = Math.floor(toDate.getTime() / 1000);
      
      finnhubClient.stockCandles(symbol, resolution, from, to, (error: any, data: any) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (data.s === 'no_data') {
          resolve({ status: 'no_data', data: [] });
          return;
        }
        
        // Format the data for easier consumption
        const formattedData = data.t.map((timestamp: number, index: number) => {
          return {
            date: new Date(timestamp * 1000).toISOString().split('T')[0],
            timestamp: timestamp,
            open: data.o[index],
            high: data.h[index],
            low: data.l[index],
            close: data.c[index],
            volume: data.v[index]
          };
        });
        
        resolve({
          status: 'ok',
          data: formattedData
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};