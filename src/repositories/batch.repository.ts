import { IBatchDocument, BatchModel } from "../models/batch.model";
import BaseRepository from "./base.repository";


class BatchRepository extends BaseRepository<IBatchDocument> {
    constructor() {
        super(BatchModel);
    }
}

const batchRepository = new BatchRepository();
export default batchRepository;