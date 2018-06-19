import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  id: Number,
  shop_id: Number,
  profileURL: String,
  account_owner: Boolean,
  email: String,
  first_name: String,
  last_name: String,
  locale: String,
  associated_user_scope: String,
  scope: String,
  access_token: String
});

const User = mongoose.model('user', userSchema);

export default User;