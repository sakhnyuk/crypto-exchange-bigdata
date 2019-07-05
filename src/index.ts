import exchanges from "./exchanges";

const socket = new exchanges.binance();

socket.onTrade("BTC/USDT", (data: any) =>
  console.log(data.exchange, data.price)
);
