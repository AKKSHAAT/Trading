'use client';

import { useEffect, useState } from 'react';
import api from '../utils/axios';

interface OrderData {
    userId: string;
    symbol: string;
    quantity: number;
    price: number;
}

interface DepthChartData {
    buyDepth: OrderData[];
    sellDepth: OrderData[];
}

export default function DepthChart() {
    const [depthData, setDepthData] = useState<DepthChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepthData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/trade/depth-chart');
                // console.log("Response",response);
                setDepthData(response);
                setError(null);
            } catch (err) {
                setError('Failed to fetch depth chart data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDepthData();
        // Refresh every 5 seconds
        const interval = setInterval(fetchDepthData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    const maxQuantity = Math.max(
        ...depthData?.buyDepth.map(d => d.quantity) || [0],
        ...depthData?.sellDepth.map(d => d.quantity) || [0]
    );

    return (
        <div className="p-6 bg-black min-h-screen">
            <div className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-200">Order Book</h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Buy Orders */}
                    <div className="border border-gray-700 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-green-500 mb-3">Buy Orders</h2>
                        <div className="space-y-2">
                            {depthData?.buyDepth.map((order, index) => (
                                <div key={index} className="flex items-center text-gray-200 bg-gray-800/50 p-3 rounded">
                                    <div className="w-24">
                                        <span className="text-green-400">${order.price}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-green-900/30 h-6 rounded">
                                            <div
                                                className="bg-green-500/30 h-full rounded"
                                                style={{ width: `${(order.quantity / maxQuantity) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-center text-gray-400">
                                        {order.symbol}
                                    </div>
                                    <div className="w-24 text-right">
                                        {order.quantity} shares
                                    </div>
                                    <div className="w-32 text-right text-gray-400 text-sm">
                                        ID: {order.userId.slice(0, 6)}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sell Orders */}
                    <div className="border border-gray-700 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-red-500 mb-3">Sell Orders</h2>
                        <div className="space-y-2">
                            {depthData?.sellDepth.map((order, index) => (
                                <div key={index} className="flex items-center text-gray-200 bg-gray-800/50 p-3 rounded">
                                    <div className="w-24">
                                        <span className="text-red-400">${order.price}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-red-900/30 h-6 rounded">
                                            <div
                                                className="bg-red-500/30 h-full rounded"
                                                style={{ width: `${(order.quantity / maxQuantity) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-center text-gray-400">
                                        {order.symbol}
                                    </div>
                                    <div className="w-24 text-right">
                                        {order.quantity} shares
                                    </div>
                                    <div className="w-32 text-right text-gray-400 text-sm">
                                        ID: {order.userId.slice(0, 6)}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}