import React, { useRef } from "react";

interface OtpInputProps {
  value: string[];
  length?: number;
  onChange: (otp: string[]) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, length = 6, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    const newOtp = [...value];
    newOtp[index] = digit.replace(/[^0-9]/g, "");
    onChange(newOtp);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(e, i)}
          className="w-10 h-12 text-center text-lg rounded-md border border-zinc-700 bg-zinc-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;
