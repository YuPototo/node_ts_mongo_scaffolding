import dotenvExtended from "dotenv-extended";
import dotenvParseVariables from "dotenv-parse-variables";

// winston log levels
type LogLevel =
    | "silent" // 默认选项，彻底不用 log
    | "error"
    | "warn"
    | "info"
    | "http" // prod 环境下，低于这个的不记录
    | "verbose"
    | "debug" // dev 环境
    | "silly";

// env
const env = dotenvExtended.load({
    path: process.env.ENV_FILE, // 会在 package.json 内设置这个 ENV_FILE
    defaults: "./config/.env.defaults", // 即刚才创建的 .env.defaults
    schema: "./config/.env.schema", // 即刚才创建的 .env.schema
    includeProcessEnv: true, // 把 process.env 里的变量也放进校验里
    silent: false, // 没有 .env 或 .env.defaults 文件时，会 console.log 信息
    errorOnMissing: true, // 缺少 schema 需要的变量时，会报错
    errorOnExtra: true, // 存在多余的变量时，会报错
});

const parsedEnv = dotenvParseVariables(env); // parse 环境变量

interface Config {
    port: number;

    // logger
    logger: {
        morganLogger: boolean;
        morganBodyLogger: boolean;
        loggerLevel: LogLevel;
    };

    // mongo
    mongo: {
        url: string;
        useCreateIndex: boolean;
        autoIndex: boolean;
    };
}

const config: Config = {
    port: parsedEnv.PORT as number,

    logger: {
        morganLogger: parsedEnv.MORGAN_LOGGER as boolean,
        morganBodyLogger: parsedEnv.MORGAN_BODY_LOGGER as boolean,
        loggerLevel: parsedEnv.LOGGER_LEVEL as LogLevel,
    },

    mongo: {
        url: parsedEnv.MONGO_URL as string,
        useCreateIndex: parsedEnv.MONGO_CREATE_INDEX as boolean,
        autoIndex: parsedEnv.MONGO_AUTO_INDEX as boolean,
    },
};

export default config;
