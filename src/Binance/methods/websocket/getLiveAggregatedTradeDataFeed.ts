import Binance from "binance-api-node";

export const getLiveAggregatedTradeDataFeed = async () => {
    const binanceClient = Binance({
        apiKey: "JoQkY9IKmVlYGK72sFwX6SbtYcUj4P0wHK875AGqK5FphHrZrrNuM6VeogrjNUEa",
        apiSecret: "gMM1ZGermnSuZTMWE6Ze09ZXfSuFqZ87sAwsZSyTkUTHtWbpfIwlJGXwnWMzuukD"
    });

    const result = binanceClient.ws.aggTrades(["ETHBTC"], trade => {
        console.log(trade)
    })

    return {
        result,
    };
};