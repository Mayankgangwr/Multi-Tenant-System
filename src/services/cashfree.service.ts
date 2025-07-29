import { CreateOrderRequest, PayOrderRequest } from "cashfree-pg";
import cashfree from "../config/cashfree.config";

class CashfreeService {
    async createOrder(createOrderPayload: CreateOrderRequest) {
        const response = await cashfree.PGCreateOrder(createOrderPayload);
        return response.data;
    }

    async getOrder(orderId: string) {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        return response.data;

    }

    async verifWebhook(signature: string, rawBody: string, timestamp: string) {
        const validateSignature = await cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
        if (validateSignature) {
            return validateSignature;
        }
        return false;
    }
}

const cashfreeService = new CashfreeService();
export default cashfreeService;
