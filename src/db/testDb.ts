import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import config from "@jp/config";
import logger from "@jp/utils/logger";
import { dbOption } from "./dbOption";

class MongoConnection {
    private static _instance: MongoConnection;

    private _mongoServer?: MongoMemoryServer;

    static getInstance(): MongoConnection {
        if (!MongoConnection._instance) {
            MongoConnection._instance = new MongoConnection();
        }
        return MongoConnection._instance;
    }

    public async open(): Promise<void> {
        try {
            logger.debug("connecting to inmemory mongo db");
            this._mongoServer = await MongoMemoryServer.create();
            const mongoUrl = this._mongoServer.getUri();
            await mongoose.connect(mongoUrl, dbOption);

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
            await this._mongoServer!.stop();
        } catch (err) {
            logger.error(`db.open: ${err}`);
            throw err;
        }
    }
}

export default MongoConnection.getInstance();
