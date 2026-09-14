import { configDotenv } from "dotenv";
configDotenv();

const mode = process.env.MODE


const envconfig = {
    mongouri: mode == 'development' ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PROD,
    port: mode == 'development' ? process.env.PORT_DEV : process.env.PORT_PROD,
    dbname: mode == 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD,
    jwtsignature: mode == 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD
}

export default envconfig


