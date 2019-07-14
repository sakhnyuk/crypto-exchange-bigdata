import exchanges from "./exchanges";

const socket = new exchanges.Binance();
const socket2 = new exchanges.Bitmex();

socket.onTrade("BTC/USDT", (data: any) => {
  console.log(data);
});

// socket2.onTrade("XBT/USD", (data: any) => {
//   // console.log(data.exchange, data.price)
//   count = count + 1;

//   console.log(count);
// });

for (const exch in socket) {
  if (socket.hasOwnProperty(exch)) {
    const session = socket[exch];
  }
}
