import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IUserDetails } from "@/interfaces/profile";
import { makeRequest } from "@/utils/axios";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { LogoutModal } from "@/components/modal/LogoutModal";
import { ChangePasswordModal } from "@/components/modal/ChangePasswordModal";
import VerifyEmailModal from "@/components/modal/VerifyEmailModal";
import { handleError } from "@/utils/util";

const Profile = () => {
  const [userDetails, setUserDetail] = useState<IUserDetails>({
    email: "",
    username: "",
    emailVerified: false,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await makeRequest.get("/profile");
        console.log(response);
        setUserDetail(response.data);
      } catch (error) {
        handleError(error);
      }
    };
    fetchDetails();
  }, []);
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <Card className="md:w-[500px] w-[370px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>Yoou are signed in as</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <div className="gap-2 flex items-center">
            <span className="text-sm">User Name :</span>
            <span>{userDetails.username}</span>
          </div>
          <div className="gap-2 flex items-center">
            <span className="text-sm">Email : </span>
            <span>{userDetails.email}</span>
          </div>
          <div className="gap-2 flex items-center">
            <span className="text-sm">Email Status : </span>
            <span>
              {userDetails.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-2 items-center justify-between w-full">
            {!userDetails.emailVerified ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Verify Email</Button>
                </DialogTrigger>
                <VerifyEmailModal />
              </Dialog>
            ) : (
              ""
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-36">Change Password</Button>
              </DialogTrigger>
              <ChangePasswordModal />
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-36">Logout</Button>
              </DialogTrigger>
              <LogoutModal />
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
