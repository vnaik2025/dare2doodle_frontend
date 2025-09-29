import { useState, useEffect } from "react";
import { requestEmailVerification, verifyEmailApi } from "../../apis/authApi";
import OtpInput from "../common/OtpInput";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = useState<"idle" | "sent" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Request OTP on mount
    requestEmailVerification()
      .then(res => {
        setMessage(res.message);
        setStatus("sent");
      })
      .catch(() => setMessage("Failed to send OTP. Try again."));
  }, []);

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setMessage("Please enter all digits");
      return;
    }

    setStatus("verifying");
    try {
      const res = await verifyEmailApi({ otp: otpString });
      setMessage(res.message);
      setStatus("success");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Verification failed");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center text-white">
      {status !== "success" ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Verify your Email</h2>
          <p className="text-zinc-400 mb-6">
            OTP has been sent to your registered email. <br />
            Please check inbox or spam folder.
          </p>

          <OtpInput value={otp} onChange={setOtp} />

          <Button
            className="mt-6 w-full"
            onClick={handleVerify}
            disabled={status === "verifying"}
          >
            {status === "verifying" ? "Verifying..." : "Verify"}
          </Button>

          {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            ✅ Email Verified Successfully
          </h2>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
