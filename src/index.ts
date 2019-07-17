import exchanges from "./exchanges";
import db from "./db";

const session: any = {};

for (const exch in exchanges) {
  if (exchanges.hasOwnProperty(exch)) {
    session[exch] = new exchanges[exch]();

    session[exch].onTrade(
      "BTC/USDT",
      ({ id, exchange, symbol, side, price, amount, timestamp }) => {
        db.Trade.create({
          tradeId: id,
          exchange,
          symbol,
          side,
          price,
          amount,
          timestamp
        }).then(() => {});
      }
    );
  }
}
