import { IEnrollmentDocument } from "../models/enrollment.model";
import { IPaymentDocument } from "../models/payment.model";
import paymentRepository from "../repositories/payment.repository";
import ApiError from "../utils/apiError";
import enrollmentService from "./enrollment.service";

class PaymentService {
    public async create(data: Partial<IPaymentDocument>): Promise<IPaymentDocument> {
        const paymentResponse = await paymentRepository.create(data);
        if (!paymentResponse) throw ApiError.internal("Failed to create new payment.");
        return paymentResponse;
    }

    public async getByOrderId(order_id: string): Promise<IPaymentDocument> {
        const paymentResponse = await paymentRepository.findOne({ order_id });
        if (!paymentResponse) throw ApiError.internal("Failed to fetch payment.");
        return paymentResponse;
    }

    public async handleWebhook(payload: any) {
        const type = payload.type;
        const data = payload.data;

        const orderId = data.order?.order_id;

        const payment = await paymentRepository.findOne({ order_id: orderId });

        if (!payment) throw ApiError.internal(`No payment found for invoiceId / order_id: ${orderId}`)

        if (type !== 'PAYMENT_CHARGES_WEBHOOK') {
            payment.status = data.payment.payment_status;
            payment.bank_reference = data.payment.bank_reference;
            payment.payment_message = data.payment.payment_message;
            payment.payment_time = new Date(data.payment.payment_time);
            payment.paymentMethod = data.payment.payment_group?.toUpperCase() || 'NetBanking';
            payment.paymentGateway = data.payment_gateway_details?.gateway_name || 'Cashfree';


        }

        const enrollPayload: Partial<IEnrollmentDocument> = {
            studentId: payment.studentId,
            batchId: payment.batchId,
            fee: {
                amount: payment.amount,
                currency: payment.currency,
                paid: payment.amount,
                due: 0,
                status: 'paid'
            },
            status: 'active'
        }

        await enrollmentService.enroll(enrollPayload);

        await payment.save();

        return payment;
    };

}

const paymentService = new PaymentService();
export default paymentService;
