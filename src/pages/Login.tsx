// import { useForm } from 'react-hook-form';
// import { useMutation } from '@tanstack/react-query';
// import { useDispatch } from 'react-redux';
// import { login as authLogin } from '../store/slices/authSlice';
// import { login } from '../apis/authApi';
// import Input from '../components/common/Input';
// import Button from '../components/common/Button';
// import ErrorMessage from '../components/common/ErrorMessage';
// import { Link } from 'react-router-dom';

// interface FormData {
//   email: string;
//   password: string;
// }

// const Login = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
//   const dispatch = useDispatch();

//   const mutation = useMutation({
//     mutationFn: (data: FormData) => login(data),
//     onSuccess: (res) => {
//       dispatch(authLogin({ token: res.token }));
//       window.location.href = '/';
//     },
//   });

//   const onSubmit = (data: FormData) => mutation.mutate(data);

//   return (
//     <div className="max-w-md mx-auto p-8" style={{ backgroundImage: 'url(/src/assets/doodle-bg.png)', backgroundSize: 'cover' }}>
//       <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Input
//             type="email"
//             placeholder="Email"
//             register={register('email', { required: 'Email is required' })}
//             error={errors.email?.message}
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             register={register('password', { required: 'Password is required' })}
//             error={errors.password?.message}
//           />
//           <Button type="submit" className="w-full bg-primary text-white" disabled={mutation.isPending}>
//             {mutation.isPending ? 'Logging in...' : 'Login'}
//           </Button>
//           {mutation.isError && <ErrorMessage message="Login failed" />}
//         </form>
//         <p className="mt-4 text-center text-gray-300">
//           Don&apos;t have an account?{' '}
//           <Link to="/register" className="text-secondary hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/slices/authSlice";
import { login } from "../apis/authApi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import { Link } from "react-router-dom";
import d2dlog from "../assets/d2dlogo_1.png";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useDispatch();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  const mutation = useMutation({
    mutationFn: (data: FormData) => login(data),
    onSuccess: (res) => {
      console.log("✅ Login API Success, response:", res);
      dispatch(authLogin({ token: res.token }));
      console.log("✅ Token dispatched to Redux:", res.token);
      console.log(
        "✅ Decoded user from token:",
        JSON.parse(atob(res.token.split(".")[1]))
      );
      window.location.href = "/";
    },
    onError: (err) => {
      console.error("❌ Login failed:", err);
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
        // Cleanup scripts and Vanta effect
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
        }
        document.body.removeChild(threeScript);
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
          <h2 className="text-2xl font-bold text-gray-100">Welcome Back</h2>
          <p className="text-gray-400 text-sm">
            Login to continue your creative doodle journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            register={register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <Input
            type="password"
            placeholder="Enter your password"
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password?.message}
          />

          {/* Forgot password link - left aligned */}
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          {/* Full width button */}
          <Button
            type="submit"
            className="w-full py-2 bg-[#4ade80]/90 hover:bg-[#22c55e] focus:ring-[#4ade80] text-white font-medium rounded-lg shadow-md"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>

          {mutation.isError && (
            <ErrorMessage message="Login failed. Please check your details." />
          )}
        </form>

        {/* Register */}
        <div className="mt-6 text-sm text-gray-400">
          <p>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[#4ade80]/90 hover:text-amber-300 font-medium transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
