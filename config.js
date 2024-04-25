export const getDbUrl = () => {
    if(process.env.ENVIRONMENT == "development")
        return process.env.DEV_DB_URL;

    return process.env.DB_URL;
}