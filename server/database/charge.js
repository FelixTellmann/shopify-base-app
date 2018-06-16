import mongoose, { Schema } from 'mongoose';

const chargeSchema = new Schema({
  id: Number,
  method: String,
  type: String,
  data: {}
});

const Charge = mongoose.model('charge', chargeSchema);

export default Charge;