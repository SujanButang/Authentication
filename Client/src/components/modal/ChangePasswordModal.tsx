import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { makeRequest } from "@/utils/axios";
import { useState } from "react";
import { handleError, validatePassword } from "@/utils/util";
import { ButtonLoading } from "../loadingButton/LoadingButton";

export function ChangePasswordModal() {
  const navigate = useNavigate();

  const [passwordDetails, setPasswordDetails] = useState({
    password: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /**
   * Handles input change events by updating the state with the new data.
   * Prevents the default behavior of the event to avoid unintended side effects.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by an input element.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPasswordDetails({ ...passwordDetails, [e.target.id]: e.target.value });
  };
  const handlePasswordChange = async () => {
    try {
      if (passwordDetails.password == "" || passwordDetails.newPassword == "") {
        toast.error("Error", {
          description: "Input fields cannot be empty! ☹️☹️",
        });
        return;
      }
      const passwordValid = validatePassword(
        passwordDetails.newPassword,
        confirmPassword
      );
      setLoading(true);
      if (passwordValid) {
        const response = await makeRequest.post(
          "/auth/changePassword",
          passwordDetails
        );
        toast.success("Success", {
          description: response.data,
        });
        setLoading(false);
        navigate("/");
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
        <DialogTitle>Change Password</DialogTitle>
        <DialogDescription>Enter passwords to change </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Current Password
          </Label>
          <Input
            id="password"
            type="password"
            className="col-span-3"
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="newPassword" className="text-right">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            className="col-span-3"
            onChange={handleInputChange}
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
      <DialogFooter>
        {loading ? (
          <ButtonLoading />
        ) : (
          <Button type="submit" onClick={handlePasswordChange}>
            Change
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}
