"use client";
import { AnimatedPxlKitIcon, PxlKitIcon } from "@pxlkit/core";
import { FloatingGem, Trophy } from "@pxlkit/gamification";
import { ArrowRight } from "@pxlkit/ui";
import {
  PixelButton,
  PixelCard,
  PixelInput,
  PixelPasswordInput,
} from "@pxlkit/ui-kit";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <PixelButton tone="red" className="cursor-pointer absolute left-3 top-3" asChild>
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
          <form className="space-y-3">
            <PixelInput
              type="email"
              label="Email"
              placeholder="darklord@quester.xyz"
            />

            <PixelPasswordInput label="Password" placeholder="Enter password" />

            <PixelButton
              type="submit"
              tone="red"
              className="w-full cursor-pointer"
            >
              Sign In
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
