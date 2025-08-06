import mongoose, { Document } from 'mongoose';
export interface ISpecification extends Document {
    name: string;
    length: number;
    width: number;
    height?: number;
    unit: string;
    resolution?: string;
    description?: string;
    isDefault: boolean;
    category?: string;
    createdBy: string;
    updatedBy: string;
    createTime: Date;
    updateTime: Date;
}
export declare const Specification: mongoose.Model<ISpecification, {}, {}, {}, mongoose.Document<unknown, {}, ISpecification, {}, {}> & ISpecification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Specification;
//# sourceMappingURL=Specification.d.ts.map