import NotFoundError from "../errors/NotfoundError";
import { IProfileResponse } from "../interfaces/profileInterface";
import userModel, { IUser } from "../models/userModel";

/**
 * Retrieves profile details for a given user ID.
 * @param userId - The unique identifier of the user.
 * @returns A Promise that resolves to an object containing profile details.
 * @throws NotFoundError if the user with the specified ID is not found.
 */
export const getProfileDetails = async (
  userId: string
): Promise<IProfileResponse> => {
  const user: IUser | null = await userModel.findById(userId);
  if (!user) throw new NotFoundError("User not found! ☹️☹️");
  return {
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    profileImage: user.profileImage,
  };
};
