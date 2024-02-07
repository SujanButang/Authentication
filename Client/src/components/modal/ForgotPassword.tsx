import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ButtonLoading } from "../loadingButton/LoadingButton";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { makeRequest } from "@/utils/axios";
import { handleError, validatePassword } from "@/utils/util";

const ForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  /**
   * Initiates the process of requesting a password reset by sending a POST request to the '/auth/reqReset' endpoint.
   * Sets loading state to true during the asynchronous operation.
   * Sends the email address to the server for password reset initiation.
   * On success, displays a success toast with the response data and updates the state to indicate that the OTP has been sent.
   * On failure, handles the error, displays an error toast, and sets loading state to false.
   */
  const requestReset = async () => {
    try {
      if (email == "") {
        toast.error("Error", {
          description: "Input fields cannot be empty! ☹️☹️",
        });
        return;
      }
      setLoading(true);
      const response = await makeRequest.post("/auth/reqReset", { email });
      toast("Success", {
        description: response.data,
      });
      setLoading(false);
      setOtpSent(true);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  /**
   * Initiates the process of verifying a One-Time Password (OTP) for password reset.
   * Sets loading state to true during the asynchronous operation.
   * Sends a POST request to the '/auth/verifyResetOtp' endpoint with the provided email and OTP.
   * On success, displays a success toast with the response data and updates the state to indicate OTP verification.
   * On failure, handles the error, displays an error toast, and sets loading state to false.
   */
  const verifyOtp = async () => {
    try {
      if (otp == "") {
        toast.error("Error", {
          description: "Input fields cannot be empty! ☹️☹️",
        });
        return;
      }
      setLoading(true);
      const response = await makeRequest.post("/auth/verifyResetOtp", {
        email,
        otp,
      });
      toast("Success", {
        description: response.data,
      });
      setOtpVerified(true);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  /**
   * Initiates the process of resetting the user's password.
   * Validates the password and confirms password match before sending a POST request to the '/auth/resetPassword' endpoint.
   * Displays a success toast on successful password reset.
   * Displays an error toast if the password is invalid or if there is an error during the reset process.
   */
  const resetPassword = async () => {
    try {
      if (password == "") {
        toast.error("Error", {
          description: "Input fields cannot be empty! ☹️☹️",
        });
        return;
      }
      const passwordValid = validatePassword(password, confirmPassword);
      if (passwordValid) {
        const response = await makeRequest.post("/auth/resetPassword", {
          email,
          password,
        });
        toast("Success", {
          description: response.data,
        });
        setLoading(false);
      } else {
        toast.error("Uh oh! Something seems wrong!!", {
          description: `Password should be eight characters,one letter, one number and one
                      special character.`,
        });
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <DialogContent className="w-[800px]">
      <DialogHeader>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogDescription>Enter passwords to change </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {otpVerified ? (
          <div id="inputs" className="flex flex-col items-center w-full gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                className="col-span-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="col-span-3"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        ) : otpSent ? (
          <div id="otp-input" className=" grid-cols-4 items-center gap-4">
            <Label htmlFor="otp" className="text-right">
              OTP
            </Label>
            <Input
              id="otp"
              type="number"
              className="col-span-3"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        ) : (
          <div id="email-input" className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
      </div>
      <DialogFooter>
        {loading ? (
          <ButtonLoading />
        ) : (
          <>
            {otpVerified && <Button onClick={resetPassword}>Reset</Button>}

            {otpSent && !otpVerified && (
              <Button onClick={verifyOtp}>Verify</Button>
            )}

            {!otpSent && !otpVerified && (
              <Button onClick={requestReset}>Request OTP</Button>
            )}
          </>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default ForgotPassword;
