
import { IPaymentDocument, PaymentModel } from "../models/payment.model";
import BaseRepository from "./base.repository";


class PaymentRepository extends BaseRepository<IPaymentDocument> {
    constructor() {
        super(PaymentModel);
    }
}

const paymentRepository = new PaymentRepository();
export default paymentRepository;