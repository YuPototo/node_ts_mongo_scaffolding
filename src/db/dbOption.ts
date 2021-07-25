import config from "@jp/config";

export const dbOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: config.mongo.useCreateIndex,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    autoIndex: config.mongo.autoIndex,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};
