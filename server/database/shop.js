import mongoose, { Schema } from 'mongoose';

const shopSchema = new Schema({
  id: Number,
  displayName: String,
  profileURL: String,
  username: String,
  provider: String,
  emails: [],
  shop:{},
  associated_users: [{ type: Schema.ObjectId, ref: 'users' }],
  install_first_date: { type: Date, default: Date.now },
  install_uninstall_date: Date,
  install_current_date: Date,
  charge_approved: { type: Boolean, default: false },
  charge_activated_date: Date,
  charge_trial_days_used: {type: Number, default: 0 },
  charges: [{ type: Schema.ObjectId, ref: 'charges' }]
});

const Shop = mongoose.model('shop', shopSchema);

export default Shop;