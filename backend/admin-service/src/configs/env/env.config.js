import { configDotenv } from "dotenv";
configDotenv();

const mode = process.env.MODE


const envconfig = {
    dburi: mode == 'development' ? process.env.POSTGRES_URL_DEV : process.env.POSTGRES_URL_PROD,
    port: mode == 'development' ? process.env.PORT_DEV : process.env.PORT_PROD,
    dbname: mode == 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD,
    jwtsignature: mode == 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD,
    userserviceurl:mode == 'development' ? process.env.USER_SERVICE_URL : process.env.USER_SERVICE_URL
}

export default envconfig


















