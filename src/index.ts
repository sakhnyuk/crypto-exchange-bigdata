import exchanges from "./exchanges";

const socket = new exchanges.Binance();
const socket2 = new exchanges.Bitmex();

socket.onTrade("BTC/USDT", (data: any) =>
  console.log(data.exchange, data.price)
);

socket2.onTrade("XBT/USD", (data: any) =>
  console.log(data.exchange, data.price)
);
