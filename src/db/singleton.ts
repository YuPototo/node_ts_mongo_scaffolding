import mongoose from "mongoose";

import config from "@jp/config";
import logger from "@jp/utils/logger";
import { dbOption } from "./dbOption";

mongoose.set("debug", process.env.DEBUG !== undefined);

class MongoConnection {
    private static _instance: MongoConnection;

    static getInstance(): MongoConnection {
        if (!MongoConnection._instance) {
            MongoConnection._instance = new MongoConnection();
        }
        return MongoConnection._instance;
    }

    public async open(): Promise<void> {
        try {
            logger.debug("connecting to mongo db: " + config.mongo.url);
            mongoose.connect(config.mongo.url, dbOption);

            mongoose.connection.on("connected", () => {
                logger.info("Mongo: connected");
            });

            mongoose.connection.on("disconnected", () => {
                logger.error("Mongo: disconnected");
            });

            mongoose.connection.on("error", (err) => {
                logger.error(`Mongo:  ${String(err)}`);
                if (err.name === "MongoNetworkError") {
                    setTimeout(function () {
                        mongoose
                            .connect(config.mongo.url, dbOption)
                            .catch(() => {});
                    }, 5000);
                }
            });
        } catch (err) {
            logger.error(`db.open: ${err}`);
            throw err;
        }
    }

    public async close(): Promise<void> {
        try {
            await mongoose.disconnect();
        } catch (err) {
            logger.error(`db.open: ${err}`);
            throw err;
        }
    }
}

export default MongoConnection.getInstance();
