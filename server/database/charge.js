import mongoose, { Schema } from 'mongoose';

const chargeSchema = new Schema({
  id: Number,
  type: String,
  application_charge: {},
  recurring_application_charge: {},
  application_credit: {},
  usage_charge: {}
});

const Charge = mongoose.model('charge', chargeSchema);

export default Charge;