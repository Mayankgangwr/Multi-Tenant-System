import { CreateOrderRequest, PayOrderRequest } from "cashfree-pg";
import cashfree from "../config/cashfree.config";

class CashfreeService {
    async createOrder(createOrderPayload: CreateOrderRequest) {
        const response = await cashfree.PGCreateOrder(createOrderPayload);
        return response.data;
    }

    async payOrder(sessionId: string) {
        const request: PayOrderRequest = {
            payment_method: {
                "card": {
                    "channel": "link",
                    "card_number": "4111111111111111",
                    "card_holder_name": "Harshith",
                    "card_expiry_mm": "08",
                    "card_expiry_yy": "32",
                    "card_cvv": "111"
                }
            },
            payment_session_id: sessionId
        }
        const response = await cashfree.PGPayOrder(request);
        return response.data;
    }

    async getOrder(orderId: string) {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        return response.data;

    }
}

const cashfreeService = new CashfreeService();
export default cashfreeService;
