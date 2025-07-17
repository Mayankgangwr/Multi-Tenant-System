import { Cashfree, CFEnvironment } from "cashfree-pg";
import configENV from "./env.config";

const environment =
    configENV.CF_ENV === "PRODUCTION"
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX;

if (!configENV.CF_APP_ID || !configENV.CF_SECRET_KEY) {
    throw new Error("Cashfree credentials are missing in environment variables");
}

const cashfree = new Cashfree(environment, configENV.CF_APP_ID, configENV.CF_SECRET_KEY);

export default cashfree;
