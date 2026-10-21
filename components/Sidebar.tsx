"use client";
import { dropdownSections, sections } from "@/utils/sidebar-constants";
import { PixelDropdown, PixelSidebar } from "@pxlkit/ui-kit";
import logo from "../public/quester-logo.png";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Supabase API error:", error);
        return null;
      }

      setUser(user);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const activeSections = sections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      active:
        item.href === pathname ||
        (item.href !== undefined && pathname.startsWith(`${item.href}/`)),
    })),
  }));

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out failed:", error);
      return;
    }

    router.replace("/sign-in");
    router.refresh();
  };
  return (
    <div>
      <PixelSidebar
        sections={activeSections}
        className="hidden xl:flex rounded-lg px-2"
        header={
          <div className="flex gap-2 items-center py-2">
            <Image src={logo} alt="Logo" className="w-10 rounded-md" />
            <div className="flex flex-col">
              <span className="font-pixel uppercase text-lg">Quester</span>
              <span className="text-[10px] opacity-60 font-mono">
                Game Backlogs Tracker
              </span>
            </div>
          </div>
        }
        footer={
          <>
            <div className="min-w-0 w-full [&_button]:flex [&_button]:w-full [&_button]:cursor-pointer [&_button]:min-w-0 [&_button]:justify-between [&_button]:border-none [&_button]:bg-transparent [&_button]:px-0 [&_button>span:first-child]:min-w-0 [&_button>span:first-child]:overflow-hidden [&_button>span:first-child]:text-ellipsis [&_button>span:first-child]:whitespace-nowrap">
              <PixelDropdown
                label={user?.user_metadata.username}
                items={dropdownSections}
                onSelect={(value) => {
                  switch (value) {
                    case "settings":
                      router.push("/settings");
                      break;
                    case "sign-out":
                      void handleSignOut();
                      break;
                  }
                }}
              />
            </div>
          </>
        }
      />
    </div>
  );
}
