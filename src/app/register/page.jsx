"use client";

import React, { useState } from "react";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Home, Eye, EyeOff, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  // const {register, handleSubmit} = useForm();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    await authClient.signUp.email({
      ...user,
      image: user.photo,
      // plan: 'free',
    });

    redirect('/')
  };

  const inputClassName =
    "w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E05638] focus:border-transparent transition-all";

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 px-6 py-12 dark:bg-zinc-950 transition-colors duration-200">
      <div className="w-full max-w-md bg-white border border-slate-100 dark:border-zinc-800/80 dark:bg-zinc-900 rounded-3xl p-8 shadow-xl shadow-slate-100/40 dark:shadow-none">
        {/* Top Header & Logo Identity */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E05638] text-white shadow-sm mb-3">
            <Home size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Join NestFinder to locate your perfect rental property
          </p>
        </div>

        {/* HeroUI Form Structure */}
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {/* 1. Name Field */}
          <TextField
            isRequired
            name="name"
            type="text"
            className="w-full flex flex-col gap-1.5"
          >
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Full Name
            </Label>
            <Input placeholder="John Doe" className={inputClassName} />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* 2. Email Field with Regex Validation */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="w-full flex flex-col gap-1.5"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Email Address
            </Label>
            <Input placeholder="john@example.com" className={inputClassName} />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* 3. Photo URL Field */}
          <TextField
            isRequired
            name="photo"
            type="url"
            className="w-full flex flex-col gap-1.5"
          >
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Profile Photo URL
            </Label>
            <Input
              placeholder="https://example.com/avatar.jpg"
              className={inputClassName}
            />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* 4. Password Field with Advanced Strength Validation */}
          <TextField
            isRequired
            name="password"
            type={isVisible ? "text" : "password"}
            className="w-full flex flex-col gap-1.5"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Password
            </Label>
            <div className="relative w-full">
              <Input
                placeholder="Enter your password"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none"
              >
                {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <Description className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <Button
              type="submit"
              className="w-full rounded-xl bg-[#E05638] text-sm font-semibold text-white shadow-md hover:bg-[#c9492e] transition-all h-11 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Sign Up
            </Button>

            <Button
              type="reset"
              variant="light"
              className="w-full rounded-xl text-xs text-slate-400 dark:text-zinc-500 h-9"
            >
              Reset Form
            </Button>

            <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#E05638] font-bold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </Form>
      </div>
    </main>
  );
}
