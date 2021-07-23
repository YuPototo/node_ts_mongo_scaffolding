import express, { Request, Response, NextFunction } from "express";
import { Express } from "express-serve-static-core";
import morgan from "morgan";
import morganBody from "morgan-body";

import config from "@jp/config";

import logger from "@jp/utils/logger";

const setLogger = (app: Express) => {
    if (config.logger.morganLogger) {
        const loggerFormat =
            ":method :url :status :response-time ms - :res[content-length]";
        app.use(morgan(loggerFormat));
    }

    if (config.logger.morganBodyLogger) {
        morganBody(app);
    }
};

export async function createApp(): Promise<Express> {
    const app = express();

    // middleware
    app.use(express.json()); // 保证 http request body 会被作为 json 传入

    // logger
    setLogger(app);

    // routes

    // Error-handling middleware: 必须使用 4个 argument
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.message);
        res.status(500).json({ message: err.message });
    });

    return app;
}
