import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import RandGenerator from "../utils/util";
import { sendMail } from "../utils/nodemailer";

import {
  ILoginMessageResponse,
  IMessageResponse,
} from "../interfaces/responseInterface";

import NotFoundError from "../errors/NotfoundError";
import BadRequestError from "../errors/BadRequestError";
import NotAcceptableError from "../errors/NotAcceptableError";

import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants/jwt";

/**
 * Checks if the provided email already exists. If not, sends a verification email and
 * creates a new user record with a generated OTP for verification.
 * @param email - The email to be verified and registered.
 * @returns A Promise resolving to an IMessageResponse indicating the status and message.
 */
export const verifyUserEmail = async (
  email: string
): Promise<IMessageResponse> => {
  const otp = RandGenerator(1000, 9999);

  const user: IUser | null = await userModel.findOne({ email: email });
  if (user && user.emailVerified == false) {
    sendMail({ email, otp });
    user.otp = otp;
    user.save();
  } else if (user?.emailVerified) {
    throw new BadRequestError("User already exists! ☹️");
  } else {
    sendMail({ email, otp });
    await userModel.create({ email, otp });
  }

  return { message: "Verification mail sent succefully! 🎉", status: 200 };
};

/**
 * Checks and verifies the provided OTP for a user, updating the account's verification status.
 * @param email - The email of the user.
 * @param otp - The One-Time Password to be verified.
 * @returns A Promise resolving to an IMessageResponse indicating the status and message.
 */
export const verifyOTP = async (
  email: string,
  otp: number
): Promise<IMessageResponse> => {
  const user: IUser | null = await userModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("Uh Oh! Email not found! ☹️");
  }
  if (parseInt(user.password) == otp) {
    user.emailVerified = true;
    await user.save();
    return { message: "OTP verified. 🎉", status: 200 };
  } else {
    throw new NotAcceptableError("OTP is not valid! ☹️");
  }
};

/**
 * Registers a user with the provided email, username, and password.
 * @param email - The email of the user.
 * @param username - The desired username for the user.
 * @param password - The password for the user.
 * @returns A Promise resolving to an IMessageResponse indicating the status and message.
 */
export const registerUser = async (
  email: string,
  username: string,
  password: string
): Promise<IMessageResponse> => {
  const saltRound = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRound);
  const user: IUser | null = await userModel.findOne({ email });
  if (!user) throw new NotFoundError("User not found! ☹️");
  if (!user.emailVerified)
    throw new NotAcceptableError("Email is not verified.");
  user.username = username;
  user.password = hashedPassword;
  await user.save();
  return {
    message: "User registration successful. 🎉",
    status: 200,
  };
};

/**
 * Handles the authentication and login process for a user.
 * @param email - The email of the user attempting to log in.
 * @param password - The password provided by the user for login.
 * @returns A Promise resolving to an IMessageResponse with login result and tokens.
 */
export const login = async (
  email: string,
  password: string
): Promise<ILoginMessageResponse> => {
  const user: IUser | null = await userModel.findOne({ email });
  if (!user) throw new NotFoundError("User not found! ☹️");
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) throw new BadRequestError("Invalid Credentials! ☹️");

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );

  return {
    message: "User login successful. 🎉",
    status: 200,
    data: {
      accessToken,
      refreshToken,
    },
  };
};
