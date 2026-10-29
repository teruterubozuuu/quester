"use client";
import { SignInSchema } from "@/lib/schemas/user.schema";
import { supabase } from "@/utils/supabase/client";
import { AnimatedPxlKitIcon, PxlKitIcon } from "@pxlkit/core";
import { FloatingGem, Trophy } from "@pxlkit/gamification";
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

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      const result = SignInSchema.parse({ email, password });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: result.email,
        password: result.password,
      });

      if (error) {
        console.error("Sign-in error:", error);
        toast.error("Sign in failed", error.message);
        return;
      }

      if (!data.session || !data.user) {
        toast.error("Sign in failed", "No authenticated session was created.");
        return;
      }

      setIsLoading(false);
      toast.success("Sign in success");
      router.push("/quests");
    } catch (error) {
      console.error(error);
      toast.error("Sign in failed");
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
          icon={<AnimatedPxlKitIcon icon={FloatingGem} />}
          title="Welcome back to Quester"
          description="Sign in to your account"
        >
          <form className="space-y-3 min-w-xs" onSubmit={handleSignIn}>
            <PixelInput
              type="email"
              label="Email"
              name="email"
              placeholder="darklord@quester.xyz"
            />

            <PixelPasswordInput
              label="Password"
              placeholder="Enter password"
              name="password"
            />

            <PixelButton
              type="submit"
              tone="red"
              className="w-full cursor-pointer"
            >
              {isLoading ? (
                <>
                  <AnimatedPxlKitIcon icon={LoadingSpinner} size={32} />{" "}
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </PixelButton>
          </form>

          <div className="text-center mt-3">
            <span>Don't have an account?</span>
            <Link href="/sign-up" className="font-bold hover:underline">
              {" "}
              Sign up
            </Link>
          </div>
        </PixelCard>
      </div>
    </>
  );
}
