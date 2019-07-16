import exchanges from "./exchanges";
import db from "./db";

const session: any = {};

for (const exch in exchanges) {
  if (exchanges.hasOwnProperty(exch)) {
    console.log(exch);

    session[exch] = new exchanges[exch]();
  }
  session[exch].onTrade(
    "BTC/USDT",
    async ({ id, exchange, symbol, side, price, amount, timestamp }) => {
      // console.log({ id, exchange, symbol, side, price, amount, timestamp });

      const data = await db.Trade.create({
        tradeId: id,
        exchange,
        symbol,
        side,
        price,
        amount,
        timestamp
      });

      console.log(data);
    }
  );
}
