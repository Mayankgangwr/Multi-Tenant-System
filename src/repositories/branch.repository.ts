import { IBranchDocument, BranchModel } from "../models/branch.model";
import BaseRepository from "./base.repository";


class BranchRepository extends BaseRepository<IBranchDocument> {
    constructor() {
        super(BranchModel);
    }
}

const branchRepository = new BranchRepository();
export default branchRepository;