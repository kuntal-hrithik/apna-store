import dbConnect from "@/lib/connect";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, password } = await request.json();
  const veriifyCode = Math.floor(1000 + Math.random() * 9000).toString();
  if (!username || !email || !password) {
    return NextResponse.json({
      message: "All fields are required",
    });
  }
  const existingVerifiedUser = await UserModel.findOne({
    username,
    isVerified: true,
  });
  if (existingVerifiedUser) {
    return NextResponse.json({
      message: "username already exists",
    });
  }
  const existingUserByEmail = await UserModel.findOne({ email });
  if (existingUserByEmail) {
    if (existingUserByEmail.isVerified) {
      return Response.json(
        {
          sucess: false,
          message: "User already exists with this email",
        },
        { status: 400 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = veriifyCode;
      existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
      await existingUserByEmail.save();
    }
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyCode: veriifyCode,
      verifyCodeExpiry: expiryDate,
    });
    await newUser.save();
  }
  try {
  } catch (error) {
    
  }
}
