import exchanges from "./exchanges";

const session: any = {};

for (const exch in exchanges) {
  if (exchanges.hasOwnProperty(exch)) {
    console.log(exch);

    session[exch] = new exchanges[exch]();
  }
  session[exch].onTrade("BTC/USDT", (data: any) => {
    console.log(data.exchange, data.price);
  });
}
