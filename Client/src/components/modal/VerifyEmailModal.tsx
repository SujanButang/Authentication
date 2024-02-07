import { useState } from "react";
import { ButtonLoading } from "../loadingButton/LoadingButton";
import { toast } from "sonner";
import { makeRequest } from "@/utils/axios";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { handleError } from "@/utils/util";

const VerifyEmailModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");

  /**
 * Initiates the process of sending a One-Time Password (OTP) for email verification.
 * Sets loading state to true during the asynchronous operation.
 * On success, displays a success toast and updates the state to indicate that the OTP has been sent.
 * On failure, handles the error, displays an error toast, and sets loading state to false.
 */
  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await makeRequest.get("/auth/verifyEmail");
      toast("Success", {
        description: response.data,
      });
      setOtpSent(true);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  /**
 * Initiates the process of verifying the One-Time Password (OTP) for email confirmation.
 * Sets loading state to true during the asynchronous operation.
 * Sends a POST request to the '/auth/verifyOtp' endpoint with the provided OTP.
 * On success, displays a success toast with the response data.
 * On failure, handles the error, displays an error toast, and sets loading state to false.
 */
  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await makeRequest.post("/auth/verifyOtp", { otp });
      toast("Success", {
        description: response.data,
      });
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <DialogContent className="w-[800px]">
      <DialogHeader>
        <DialogTitle>Change Password</DialogTitle>
        <DialogDescription>Enter passwords to change </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
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
      </div>
      <DialogFooter>
        {loading ? (
          <ButtonLoading />
        ) : otpSent ? (
          <Button type="submit" onClick={verifyEmail}>
            Verify
          </Button>
        ) : (
          <Button type="submit" onClick={sendOtp}>
            Request OTP
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default VerifyEmailModal;
