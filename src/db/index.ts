import { Sequelize, Model, DataTypes } from "sequelize";
import { config } from "dotenv";
import { resolve } from "path";

config();
config({ path: resolve(__dirname, "../../.env") });

const env = process.env;

const sequelize = new Sequelize(
  env.POSTGRES_DB,
  env.POSTGRES_USER,
  env.POSTGRES_PASSWORD,
  {
    host: "localhost",
    port: 9843,
    dialect: "postgres",
    logging: false
  }
);

class Trade extends Model {
  public id!: number;
  public tradeId!: string;
  public exchange!: number;
  public symbol!: number;
  public side!: number;
  public price!: number;
  public amount!: number;

  // timestamps!
  public timestamp!: number;
  public readonly createdAt!: Date;
}

Trade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tradeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    exchange: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    symbol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    side: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: "trades",
    sequelize,
    timestamps: false
  }
);

sequelize
  .authenticate()
  .then(() => {
    global.console.log("Connection to db has been established successfully.");
  })
  .catch(err => {
    global.console.error("Unable to connect to the database:", err);
  });

sequelize.sync().then(() => {});

export default { Trade, Sequelize, sequelize };
