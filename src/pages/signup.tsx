import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const signup = () => {
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const handleRegister = async () => {
    if (!username || mobileNumber.length !== 10) {
      toast({
        title: "Invalid Details",
        description: "Enter a username and valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("https://apis.allsoft.co/api/documentManagement/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, mobile_number: mobileNumber }),
      });

      const data = await res.json();

      if (res.ok && data.status) {
        toast({
          title: "Registered ✅",
          description: "Mobile number added. Now try sending OTP on Login.",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: data.data || "Unable to register number.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Server Error",
        description: "Number not registered — contact Allsoft Support to enable OTP.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <UserPlus className="w-12 h-12 mx-auto mb-2 text-primary" />
          <CardTitle className="text-2xl font-bold">Register Number</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <Label>Mobile Number</Label>
            <Input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
            />
          </div>

          <Button className="w-full rounded-xl" onClick={handleRegister}>
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default signup;
