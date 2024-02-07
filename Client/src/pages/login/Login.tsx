import { ButtonLoading } from "@/components/loadingButton/LoadingButton";
import ForgotPassword from "@/components/modal/ForgotPassword";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import { ILoginData } from "@/interfaces/login";
import { makeRequest } from "@/utils/axios";
import { handleError } from "@/utils/util";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState<ILoginData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * Handles input change events by updating the state with the new form data.
   * Prevents the default behavior of the event to avoid unintended side effects.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by an input element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const { setAuthenticated } = useContext(AuthContext);

  /**
   * Handles the login process by sending a POST request to the '/auth/login' endpoint.
   * Updates the state, local storage, and navigates to the home page on successful login.
   * Displays error toasts in case of login failure.
   */
  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await makeRequest.post("/auth/login", loginData);
      setAuthenticated(true);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setLoading(false);
      navigate("/");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <Card className="md:w-[500px] w-[370px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"link"}>Forgot Password?</Button>
            </DialogTrigger>
            <ForgotPassword />
          </Dialog>
          <span>Don't have an account? </span>
          <Button variant={"outline"} onClick={() => navigate("/register")}>
            Register Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
