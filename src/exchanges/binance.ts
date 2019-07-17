import NodeWebSocket from "ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import { pairs } from "../utils";

export default class Binance {
  name: string;
  _baseUrl: string;
  _sockets: {
    trade?: ReconnectingWebSocket;
  };
  streams: { trade: (symbol: string) => string };
  _proxy: string;

  constructor(proxy?: string) {
    this.name = "Binance";
    this._baseUrl = "wss://stream.binance.com:9443/ws/";
    this._sockets = {};
    this._proxy = proxy;

    this.streams = {
      trade: symbol => `${symbol.toLowerCase()}@aggTrade`
    };
  }

  _setupWebSocket(
    eventHandler: { (res: any): void; (arg0: any): void },
    path: string,
    type: string
  ) {
    if (this._sockets[type]) {
      this._sockets[type].close();
    }
    const fullPath: string = this._baseUrl + path;
    this._sockets[type] = new ReconnectingWebSocket(fullPath, [], {
      WebSocket: NodeWebSocket,
      connectionTimeout: 5000,
      debug: false
    });

    this._sockets[type].onmessage = (event: { data: string }) => {
      const res = JSON.parse(event.data);
      eventHandler(res);
    };
    return this._sockets[type];
  }

  closeTrade() {
    if (this._sockets.trade) this._sockets.trade.close();
  }

  onTrade(symbol: string = "BTC/USDT", callback: any) {
    const newSymbol = symbol.replace("/", "");

    const handler = res => {
      const side = res.m ? 0 : 1;
      const trade = {
        id: res.f.toString(),
        side,
        timestamp: res.T,
        price: +res.p,
        amount: +res.q,
        symbol: pairs.indexOf(symbol),
        exchange: 0
      };
      callback(trade);
    };

    return this._setupWebSocket(
      handler,
      this.streams.trade(newSymbol),
      "trade"
    );
  }
}
