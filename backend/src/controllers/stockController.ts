import { Request, Response } from "express";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

// Initialize Alpha Vantage client
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Get company profile
export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ error: "Stock symbol is required" });
    }

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: "OVERVIEW",
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (response.data["Error Message"]) {
      return res.status(404).json({ error: "Company profile not found" });
    }
    console.log(Symbol, "⭐", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Exception in getCompanyProfile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get stock quote
export const getStockQuote = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({ error: "Stock symbol is required" });
    }

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (
      !response.data["Global Quote"] ||
      Object.keys(response.data["Global Quote"]).length === 0
    ) {
      return res.status(404).json({ error: "Stock quote not found" });
    }

    return res.status(200).json(response.data["Global Quote"]);
  } catch (error) {
    console.error("Exception in getStockQuote:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Search for stocks
export const searchStocks = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: "SYMBOL_SEARCH",
        keywords: query,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    if (!response.data.bestMatches) {
      return res.status(404).json({ error: "No matching stocks found" });
    }

    return res.status(200).json({
      count: response.data.bestMatches.length,
      result: response.data.bestMatches,
    });
  } catch (error) {
    console.error("Exception in searchStocks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get historical candle data
export const getCandles = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { resolution, from, to } = req.query;

    if (!symbol || !resolution) {
      return res.status(400).json({
        error: "Symbol and resolution parameters are required",
      });
    }

    // Map resolution to Alpha Vantage interval
    let interval;
    switch (resolution) {
      case "1":
        interval = "1min";
        break;
      case "5":
        interval = "5min";
        break;
      case "15":
        interval = "15min";
        break;
      case "30":
        interval = "30min";
        break;
      case "60":
        interval = "60min";
        break;
      case "D":
      case "1D":
        interval = "daily";
        break;
      case "W":
      case "1W":
        interval = "weekly";
        break;
      case "M":
      case "1M":
        interval = "monthly";
        break;
      default:
        interval = "daily";
    }

    // Determine which Alpha Vantage function to call based on interval
    let func;
    if (["1min", "5min", "15min", "30min", "60min"].includes(interval)) {
      func = "TIME_SERIES_INTRADAY";
    } else if (interval === "daily") {
      func = "TIME_SERIES_DAILY";
    } else if (interval === "weekly") {
      func = "TIME_SERIES_WEEKLY";
    } else {
      func = "TIME_SERIES_MONTHLY";
    }

    const params: any = {
      function: func,
      symbol,
      apikey: ALPHA_VANTAGE_API_KEY,
      outputsize: "full",
    };

    // Add interval param for intraday data
    if (func === "TIME_SERIES_INTRADAY") {
      params.interval = interval;
    }

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, { params });

    if (response.data["Error Message"]) {
      return res.status(404).json({ error: "Historical data not found" });
    }

    // Extract time series data and format it similar to finnhub response
    const timeSeriesKey = Object.keys(response.data).find((key) =>
      key.includes("Time Series")
    );

    if (!timeSeriesKey) {
      return res.status(404).json({ error: "Historical data not found" });
    }

    const timeSeries = response.data[timeSeriesKey];
    const timestamps = Object.keys(timeSeries).sort();

    // Format response to match previous structure
    const result = {
      c: [] as number[], // close
      h: [] as number[], // high
      l: [] as number[], // low
      o: [] as number[], // open
      t: [] as number[], // timestamps
      v: [] as number[], // volume
      s: "ok", // status
    };

    timestamps.forEach((timestamp) => {
      const bar = timeSeries[timestamp];
      const time = new Date(timestamp).getTime() / 1000; // Convert to UNIX timestamp

      // Only include data points within the from/to range if specified
      if ((!from || time >= Number(from)) && (!to || time <= Number(to))) {
        result.t.push(time);
        result.o.push(parseFloat(bar["1. open"]));
        result.h.push(parseFloat(bar["2. high"]));
        result.l.push(parseFloat(bar["3. low"]));
        result.c.push(parseFloat(bar["4. close"]));
        result.v.push(parseFloat(bar["5. volume"] || bar["6. volume"]));
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Exception in getCandles:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
