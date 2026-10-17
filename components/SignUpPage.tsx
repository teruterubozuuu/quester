"use client";
import { AnimatedPxlKitIcon, PxlKitIcon } from "@pxlkit/core";
import { FloatingGem, HeartPulse, Trophy } from "@pxlkit/gamification";
import { ArrowRight } from "@pxlkit/ui";
import {
  PixelButton,
  PixelCard,
  PixelInput,
  PixelPasswordInput,
} from "@pxlkit/ui-kit";
import Link from "next/link";

export default function SignUpPage() {
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
          icon={<AnimatedPxlKitIcon icon={HeartPulse} />}
          title="Start your adventure"
          description="Create an account to get started"
        >
          <form className="space-y-3">
            <PixelInput
              type="email"
              label="Email"
              placeholder="darklord@quester.xyz"
            />

            <PixelInput
              type="text"
              label="Username"
              placeholder="Teruterubozu"
              hint="Your in-game alias"
            />

            <PixelPasswordInput label="Password" placeholder="Enter password" />

            <PixelButton
              type="submit"
              tone="red"
              className="w-full cursor-pointer"
            >
              Sign Up
            </PixelButton>
          </form>

          <div className="text-center mt-3">
            <span>Don't have an account?</span>
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
