import Binance from "binance-api-node";

export const getAccountInformation = async (
  APIKey: string,
  APISecret: string
) => {
  const binanceClient = Binance({
    apiKey: APIKey,
    apiSecret: APISecret,
  });

  const result = await binanceClient.accountInfo();

  return {
    result,
  };
};
