import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export function LogoutModal() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Logout</DialogTitle>
        <DialogDescription>Are you sure you want to logout? </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button type="submit" onClick={handleLogout}>
          Logout
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
