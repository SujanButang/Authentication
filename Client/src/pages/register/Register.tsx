import { ButtonLoading } from "@/components/loadingButton/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IFormData } from "@/interfaces/register";
import { makeRequest } from "@/utils/axios";
import { handleError, validatePassword } from "@/utils/util";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState<IFormData>({
    username: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles input change events by updating the state with the new form data.
   * Prevents the default behavior of the event to avoid unintended side effects.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by an input element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /**
   * Handles the registration process by sending a POST request to the '/auth/register' endpoint.
   * Validates the password, displays success or error toasts, and navigates to the login page on success.
   */
  const handleRegister = async () => {
    try {
      if (
        formData.username == "" ||
        formData.password == "" ||
        formData.email
      ) {
        toast.error("Error", {
          description: "Input fields cannot be empty! ☹️☹️",
        });
        return;
      }
      const passwordValid = validatePassword(
        formData.password,
        confirmPassword
      );
      if (passwordValid) {
        setLoading(true);
        const response = await makeRequest.post("/auth/register", formData);
        toast.success("Success", {
          description: response.data,
        });
        setLoading(false);
        navigateToLogin();
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

  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <Card className="md:w-[500px] w-[370px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              onChange={(e) => {
                e.preventDefault();
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button className="w-full" onClick={handleRegister}>
              Create account
            </Button>
          )}
          <span>Already have an account? </span>
          <Button variant={"outline"} onClick={navigateToLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
