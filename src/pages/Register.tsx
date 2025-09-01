import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/slices/authSlice";
import { register as registerApi } from "../apis/authApi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import { Link } from "react-router-dom";
import d2dlog from "../assets/d2dlogo_1.png";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useDispatch();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  const mutation = useMutation({
    mutationFn: (data: FormData) => registerApi(data),
    onSuccess: (res) => {
      dispatch(authLogin({ token: res.token }));
      window.location.href = "/";
    },
  });

  useEffect(() => {
    // Dynamically load Three.js and Vanta.js scripts
    const loadScripts = async () => {
      const threeScript = document.createElement("script");
      threeScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      threeScript.async = true;

      const vantaScript = document.createElement("script");
      vantaScript.src =
        "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js";
      vantaScript.async = true;

      document.body.appendChild(threeScript);
      threeScript.onload = () => {
        document.body.appendChild(vantaScript);
        vantaScript.onload = () => {
          if (window.VANTA && vantaRef.current) {
            vantaEffectRef.current = window.VANTA.BIRDS({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              backgroundColor: 0x000000,
              backgroundAlpha: 10,

              color1: 0x00ff00,
              color2: 0x9900ff,
              colorMode: "varianceGradient",
              quantity: 5,
              birdSize: 1,
              wingSpan: 30,
              speedLimit: 5,
              separation: 20,
              alignment: 20,
              cohesion: 20,
            });
          }
        };
      };

      return () => {
        // Cleanup Vanta effect and scripts
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }
        if (document.body.contains(threeScript)) {
          document.body.removeChild(threeScript);
        }
        if (document.body.contains(vantaScript)) {
          document.body.removeChild(vantaScript);
        }
      };
    };

    loadScripts();
  }, []);

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <div
      ref={vantaRef}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-sm p-6 rounded-xl border border-gray-800  bg-black ">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={d2dlog} alt="daretodoodle_logo.png" className="w-24" />
        </div>

        {/* Heading + Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Join Dare2Doodle</h2>
          <p className="text-gray-400 text-sm">
            Create your account and start your creative doodle journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Choose a username"
            register={formRegister("username", {
              required: "Username is required",
            })}
            error={errors.username?.message}
          />
          <Input
            type="email"
            placeholder="Enter your email"
            register={formRegister("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <Input
            type="password"
            placeholder="Create a password"
            register={formRegister("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          {/* Full width button */}
          <Button
            type="submit"
            className="w-full py-2 bg-[#4ade80]/90 hover:bg-[#22c55e] focus:ring-[#4ade80] text-white font-medium rounded-lg shadow-md"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </Button>

          {mutation.isError && (
            <ErrorMessage message="Registration failed. Please try again." />
          )}
        </form>

        {/* Already have account */}
        <div className="mt-6 text-sm text-gray-400">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#4ade80]/90 hover:text-amber-300 font-medium transition-colors duration-200"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
