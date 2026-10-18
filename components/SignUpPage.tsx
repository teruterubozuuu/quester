"use client";
import { SignUpSchema } from "@/lib/schemas/user.schema";
import { supabase } from "@/utils/supabase/client";
import { AnimatedPxlKitIcon, PxlKitIcon } from "@pxlkit/core";
import { HeartPulse } from "@pxlkit/gamification";
import { ArrowRight, LoadingSpinner } from "@pxlkit/ui";
import {
  PixelButton,
  PixelCard,
  PixelInput,
  PixelPasswordInput,
  useToast,
} from "@pxlkit/ui-kit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import z from "zod";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");

      const result = SignUpSchema.parse({ email, username, password });

      const { error } = await supabase.auth.signUp({
        email: result.email,
        password: result.password,
        options: {
          data: {
            username: result.username,
          },
        },
      });

      if (error) {
        toast.error("Account creation failed");
        throw new Error("Account creation failed", error);
      }

      setIsLoading(false);
      toast.success("Account creation success", "Welcome to Quester!");
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed");
      if (error instanceof z.ZodError) {
        toast.error("Validation Failed", error.message);
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PixelButton
        tone="red"
        className="cursor-pointer absolute left-3 top-3"
        asChild
      >
        <Link href="/">
          <PxlKitIcon icon={ArrowRight} className="-scale-x-100" />
        </Link>
      </PixelButton>

      <div className="flex items-center justify-center p-3 h-svh">
        <PixelCard
          tone="red"
          icon={<AnimatedPxlKitIcon icon={HeartPulse} />}
          title="Start your adventure"
          description="Create an account to get started"
        >
          <form className="space-y-3" onSubmit={handleSignUp}>
            <PixelInput
              type="email"
              label="Email"
              name="email"
              placeholder="darklord@quester.xyz"
            />

            <PixelInput
              type="text"
              label="Username"
              name="username"
              placeholder="Teruterubozu"
              hint="Your in-game alias"
            />

            <PixelPasswordInput
              label="Password"
              name="password"
              placeholder="Enter password"
            />

            <PixelButton
              type="submit"
              tone="red"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
            {isLoading ? (
             <>
              <AnimatedPxlKitIcon icon={LoadingSpinner} size={32}/> "Creating account..."
             </>
            ): "Sign Up"}
            </PixelButton>
          </form>

          <div className="text-center mt-3">
            <span>Already have an account?</span>
            <Link href="/sign-in" className="font-bold hover:underline">
              {" "}
              Sign In
            </Link>
          </div>
        </PixelCard>
      </div>
    </>
  );
}
