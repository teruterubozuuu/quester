import {
  AnimatedPxlKitIcon,
  ParallaxPxlKitIcon,
  PxlKitIcon,
} from "@pxlkit/core";
import { Bell } from "@pxlkit/feedback";
import {
  Heart,
  HeartPulse,
  Scroll,
  SpellBook,
  Sword,
} from "@pxlkit/gamification";
import { CoolEmoji } from "@pxlkit/parallax";
import { Community, User } from "@pxlkit/social";

export const sections = [
  {
    items: [
      {
        id: "quests",
        label: "Quests",
        href: "/quests",
        icon: <PxlKitIcon icon={Scroll} />,
      },
      {
        id: "community",
        label: "Community",
        href: "/community",
        icon: <PxlKitIcon icon={Community} />,
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/notifications",
        icon: <PxlKitIcon icon={Bell} />,
      },
      {
        id: "avatar",
        label: "Avatar",
        href: "/avatar",
        icon: <PxlKitIcon icon={Heart} />,
      },
      {
        id: "profile",
        label: "Profile",
        href: "/profile",
        icon: <PxlKitIcon icon={User} />,
      },
    ],
  },
];

export const dropdownSections = [
  {
    value: "settings",
    label: "Settings",
  },
  {
    value: "sign-out",
    label: "Sign Out",
  },
];
