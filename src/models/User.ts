import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  stars: number;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

export interface IUser extends Document {
  username: string;
  email: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  password: string;
  product: IProduct[];
}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
      "please provide a valid email address",
    ],
  },
  verifyCode: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  product: [ProductSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
