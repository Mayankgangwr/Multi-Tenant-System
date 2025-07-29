import { Cashfree, CFEnvironment } from 'cashfree-pg';
import envConfig from './env.config';

const {
    env: cfEnv,
    appId: cfAppId,
    secretKey: cfSecretKey,
    webhookSecret: cfWebhookSecret,
} = envConfig.cashfree;

if (!cfAppId || !cfSecretKey) {
    throw new Error('[Cashfree Config] Missing required credentials (App ID or Secret Key). Please check your environment variables.');
}

const environment =
    cfEnv?.toUpperCase() === 'PRODUCTION'
        ? CFEnvironment.PRODUCTION
        : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(environment, cfAppId, cfSecretKey);

// Optional: Set API version explicitly (if required by your integration)
cashfree.XApiVersion = '2025-01-01';

// Optional: Export webhook secret too if needed for verification
export { cfWebhookSecret };
export default cashfree;