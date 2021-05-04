import { Schema, Document, model, Model } from 'mongoose';

export interface IOption extends Document {
  optionKey: string;
  optionValue: string;
}
const optionSchema: Schema = new Schema({
  optionKey: {
    type: String,
    required: true,
    unique: true,
  },
  optionValue: {
    type: String,
  },
});

export const optionModel: Model<IOption> = model<IOption>('option', optionSchema);
