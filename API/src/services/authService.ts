import NotAcceptableError from "../errors/NotAcceptableError";
import NotFoundError from "../errors/NotfoundError";
import {
  ILoginMessageResponse,
  IMessageResponse,
} from "../interfaces/responseInterface";
import userModel, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/nodemailer";
import { generateRandomNumber } from "../utils/util";
import { SALT_ROUNDS, maxOTP, minOTP } from "../constants";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constants/jwt";
import BadRequestError from "../errors/BadRequestError";

/**
 * Creates a new user with the provided registration details.
 * @param email - The email address of the new user.
 * @param username - The desired username for the new user.
 * @param password - The password for the new user.
 * @param profileImage - The URL or path to the profile image for the new user.
 * @returns A Promise that resolves to a message response indicating the success of the user registration.
 * @throws NotAcceptableError if a user with the provided email already exists.
 */
export const createUser = async (
  email: string,
  username: string,
  password: string,
  profileImage: string
): Promise<IMessageResponse> => {
  const userExist = await userModel.findOne({ email });
  if (userExist) throw new NotAcceptableError("User already exists! ☹️");

  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  const newUser = await userModel.create({
    email,
    password: hashedPassword,
    username,
    profileImage,
  });
  await newUser.save();
  return { message: "User registration successfull. 🎉🎉", status: 200 };
};

/**
 * Initiates the email verification process for a user by generating and sending a one-time password (OTP).
 * @param userId - The unique identifier of the user to verify.
 * @returns A Promise that resolves to a message response indicating the OTP has been sent for email verification.
 */
export const verifyEmail = async (
  userId: string
): Promise<IMessageResponse> => {
  const user = await findUserById(userId);
  const email = user.email;
  const otp = generateRandomNumber(minOTP, maxOTP);
  user.otp = otp;
  await user.save();
  sendMail({ email, otp });
  return {
    message: "A four digit OTP has been sent to the email. 🎉🎉",
    status: 200,
  };
};

/**
 * Verifies the user's email by checking if the provided OTP (One-Time Password) matches the stored OTP for the user.
 * If the OTP is valid, the user's email is marked as verified, and the stored OTP is cleared.
 * @param id - The unique identifier of the user to verify.
 * @param otp - The OTP provided by the user for email verification.
 * @returns A Promise that resolves to a message response indicating the success of email verification.
 * @throws NotAcceptableError if the provided OTP is invalid.
 */
export const verifyOtp = async (
  id: string,
  otp: number
): Promise<IMessageResponse> => {
  const user = await findUserById(id);
  if (otp == user.otp) {
    user.emailVerified = true;
    user.otp = null;
    await user.save();
    return {
      message: "Email has been verified successfully. 🎉🎉",
      status: 200,
    };
  }
  throw new NotAcceptableError("Invalid OTP provided! ☹️☹️");
};

/**
 * Authenticates a user by verifying the provided email and password.
 * Upon successful authentication, it generates access and refresh tokens for the user.
 * @param email - The email address of the user attempting to sign in.
 * @param password - The password provided by the user for authentication.
 * @returns A Promise that resolves to a login message response containing access and refresh tokens.
 * @throws UnauthorizedError if the provided email or password is incorrect.
 */
export const signInUser = async (
  email: string,
  password: string
): Promise<ILoginMessageResponse> => {
  const user = await findUserByEmail(email);
  matchPassword(password, user.password);
  const accessToken = generateToken(
    user.id,
    process.env.JWT_ACCESS_SECRET as string,
    ACCESS_TOKEN_EXPIRY
  );
  const refreshToken = generateToken(
    user.id,
    process.env.JWT_REFRESH_SECRET as string,
    REFRESH_TOKEN_EXPIRY
  );
  return {
    message: "User signed in successfully. 🎉🎉",
    status: 200,
    data: { accessToken, refreshToken },
  };
};

/**
 * Initiates the password reset process by generating and sending a one-time password (OTP) to the user's email.
 * @param email - The email address of the user requesting a password reset.
 * @returns A Promise that resolves to a message response indicating the OTP has been sent for password reset.
 */
export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);

  const otp = generateRandomNumber(minOTP, maxOTP);
  user.otp = otp;
  await user.save();
  sendMail({ email, otp });
  return {
    message: "A four digit OTP has been sent to the email. 🎉🎉",
    status: 200,
  };
};

/**
 * Verifies the provided OTP (One-Time Password) for a password reset request.
 * If the OTP is valid, the user's email is marked as verified, and the resetRequested flag is set.
 * @param email - The email address of the user for whom the password reset is requested.
 * @param otp - The OTP provided by the user for verification.
 * @returns A Promise that resolves to a message response indicating the success of OTP verification.
 * @throws NotAcceptableError if the provided OTP is invalid.
 */
export const verifyResetOtp = async (
  email: string,
  otp: number
): Promise<IMessageResponse> => {
  const user = await findUserByEmail(email);
  if (otp == user.otp) {
    user.emailVerified = true;
    user.resetRequested = true;
    user.otp = null;
    await user.save();
    return {
      message: "OTP has been verified successfully. 🎉🎉",
      status: 200,
    };
  }
  throw new NotAcceptableError("Invalid OTP provided! ☹️☹️");
};

/**
 * Changes the password for a user by verifying the current password and updating it with a new one.
 * @param userId - The unique identifier of the user whose password is to be changed.
 * @param password - The current password for authentication.
 * @param newPassword - The new password to set for the user.
 * @returns A Promise that resolves to a message response indicating the success of password change.
 * @throws UnauthorizedError if the provided current password is incorrect.
 */
export const changePassword = async (
  userId: string,
  password: string,
  newPassword: string
): Promise<IMessageResponse> => {
  const user: IUser = await findUserById(userId);
  matchPassword(password, user.password);
  const newHashedPassword = bcrypt.hashSync(newPassword, SALT_ROUNDS);
  user.password = newHashedPassword;
  await user.save();
  return { message: "Password changed successfully. 🎉🎉", status: 200 };
};

/**
 * Resets the password for a user after verifying that a password reset was requested for the associated email.
 * @param email - The email address of the user for whom the password is to be reset.
 * @param password - The new password to set for the user.
 * @returns A Promise that resolves to a message response indicating the success of password reset.
 * @throws BadRequestError if a password reset was not requested for the provided email.
 */
export const resetPassword = async (
  email: string,
  password: string
): Promise<IMessageResponse> => {
  const user = await findUserByEmail(email);
  if (!user.resetRequested) throw new BadRequestError("Bad Request! ☹️☹️");
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  user.password = hashedPassword;
  user.resetRequested = false;
  await user.save();
  return { message: "Password has been reset successfully. 🎉🎉", status: 200 };
};

/**
 * Finds a user in the database based on their email address.
 * @param email - The email address of the user to be retrieved.
 * @returns A Promise that resolves to the user object.
 * @throws NotFoundError if the user with the provided email is not found.
 */
const findUserByEmail = async (email: string): Promise<IUser> => {
  const user: IUser | null = await userModel.findOne({ email });
  if (!user) throw new NotFoundError("User not found! ☹️☹️");
  return user;
};

/**
 * Finds a user in the database based on their unique identifier.
 * @param id - The unique identifier of the user to be retrieved.
 * @returns A Promise that resolves to the user object.
 * @throws NotFoundError if the user with the provided ID is not found.
 */
const findUserById = async (id: string): Promise<IUser> => {
  const user: IUser | null = await userModel.findById(id);
  if (!user) throw new NotFoundError("User not found! ☹️☹️");
  return user;
};

/**
 * Compares a plain-text password with a hashed password to check for a match.
 * @param password - The plain-text password to be checked.
 * @param userPassword - The hashed password stored in the database.
 * @throws NotAcceptableError if the passwords do not match.
 */
const matchPassword = (password: string, userPassword: string) => {
  const matched = bcrypt.compareSync(password, userPassword);
  if (matched) return true;
  throw new NotAcceptableError("Inavlid Credentials! ☹️☹️");
};

/**
 * Generates a JSON Web Token (JWT) for a user.
 * @param userId - The unique identifier of the user for whom the token is generated.
 * @param secretKey - The secret key used to sign the JWT.
 * @param expiry - The expiration time for the JWT in seconds.
 * @returns The generated JWT as a string.
 */
const generateToken = (
  userId: string,
  secretKey: string,
  expiry: number
): string => {
  console.log(userId, secretKey, expiry);
  return jwt.sign({ userId: userId }, secretKey, { expiresIn: expiry });
};
