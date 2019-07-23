import NodeWebSocket from "ws";
import ReWS from "reconnecting-websocket";
import { pairs } from "../utils";

export default class Bitmex {
  name: string;
  _baseUrl: string;
  _socket: any;
  _proxy: string;
  _proxy_enable: boolean;
  streams: { trade: (symbol: string) => string };
  _socketPromise: Promise<unknown>;
  _handlers: {};
  _subscriptions: { trade: string };
  websocket: any;
  tradeLog: any;

  constructor(proxy?: string) {
    this.name = "Bitmex";
    this._baseUrl = "wss://www.bitmex.com/realtime";
    this._socket = undefined;

    this._proxy = proxy;
    this._proxy_enable = !!proxy;

    this.streams = {
      trade: (symbol: string) => `trade:${symbol}`
    };
    this._socketPromise = new Promise(() => {});

    this._handlers = {};
    this._subscriptions = {
      trade: ""
    };
  }

  _setupWebSocket(eventHandler, path, type) {
    if (!this._socket) {
      let Resolver;
      this._socketPromise = new Promise(resolve => {
        Resolver = resolve;
      });
      const ws = (this._socket = new ReWS(this._baseUrl, [], {
        WebSocket: NodeWebSocket,
        connectionTimeout: 5000,
        debug: false
      }));
      ws.onopen = () => {
        console.log("BitMEX");
        Resolver();
      };

      ws.onclose = event => {
        if (event.wasClean) {
          console.log("Close BitMEX socket");
        } else {
          console.log("Socket failed"); // например, "убит" процесс сервера
        }
        console.log(
          "Close with code: " + event.code + " reason: " + event.reason
        );
      };

      ws.onerror = (err: Event) => {
        console.error("Ошибка " + err);
      };

      ws.onmessage = event => {
        const res = JSON.parse(event.data);
        if (this._handlers[res.table]) this._handlers[res.table](res);
      };
      this._socket = ws;
    }

    this._socketPromise.then(() => {
      this._subscriptions[type] = path;
      this._handlers[path.split(":")[0]] = eventHandler;
      this._socket.send(`{ "op": "subscribe", "args": ["${path}"] }`);
    });
  }

  closeTrade() {
    if (this._socket)
      this._socket.send(
        `{ "op": "unsubscribe", "args": ["${this._subscriptions.trade}"] }`
      );
    this._subscriptions.trade = "";
  }

  onTrade(symbol: string, eventHandler: any) {
    const newSymbol =
      symbol === "BTC/USDT" ? "XBTUSD" : symbol.replace("/", "");

    const handler = res => {
      if (!res.success) {
        if (res.action === "insert" && res.data) {
          res.data.forEach(el => {
            if (newSymbol === el.symbol) {
              const d = new Date(el.timestamp);
              const trade = {
                id: el.trdMatchID,
                side: el.side === "Sell" ? 0 : 1,
                timestamp: d.getTime(),
                price: el.price,
                amount: el.homeNotional,
                symbol: pairs.indexOf(symbol),
                exchange: 1
              };
              eventHandler(trade);
            }
          });
        }
      }
    };

    return this._setupWebSocket(
      handler,
      this.streams.trade(newSymbol),
      "trade"
    );
  }
}
