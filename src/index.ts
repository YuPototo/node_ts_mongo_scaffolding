import { createApp } from "@jp/app";
import db from "@jp/db/singleton";
import config from "@jp/config";
import logger from "@jp/utils/logger";

db.open()
    .then(() => createApp())
    .then((app) => {
        app.listen(config.port, () => {
            logger.info(`Listening on http://localhost:${config.port}`);
        });
    })
    .catch((err) => {
        logger.error(`Error: ${err}`);
    });
