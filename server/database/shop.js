import mongoose, { Schema } from 'mongoose';

const shopSchema = new Schema({
  shop: Number,
  shop_URL: String,
  shop_name: String,
  email: String,
  access_token: String,
  scope: String,
  install_first_date: { type: Date, default: Date.now },
  install_uninstall_date: Date,
  install_current_date: Date,
  charge_type: String,
  charge_approved: { type: Boolean, default: false },
  charge_activated_date: Date,
  charge_trial_days_used: {type: Number, default: 0 },
  charges: [{ type: Schema.ObjectId, ref: 'charges' }],
  users: [{ type: Schema.ObjectId, ref: 'users' }]
});

const Shop = mongoose.model('shop', shopSchema);

export default Shop;