import { IHTTPError } from "@/interfaces/Error";
import { toast } from "sonner";

/**
 * Validates a password
 * - Matches the confirmation password, if provided
 *
 * @param {string} password - The password to be validated.
 * @param {string} confirm - The confirmation password (optional).
 * @returns {boolean} - Returns true if the password is valid; otherwise, returns false.
 */
export const validatePassword = (
  password: string,
  confirm: string
): boolean => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!passwordPattern.test(password)) {
    return false;
  } else if (password !== confirm) {
    return false;
  } else {
    return true;
  }
};


export const handleError = (error:unknown)=>{
    const errorMessage =
        typeof error === "object" && error !== null
          ? (error as IHTTPError)?.response?.data?.message
          : "";

      toast("Uh oh! Something seems wrong!!", {
        description: errorMessage,
      });
}