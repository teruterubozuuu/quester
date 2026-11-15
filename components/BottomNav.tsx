"use client";
import { navLinks } from '@/utils/sidebar-constants';
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Supabase error:", error);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const sections = navLinks.map((nav) => {
    // Only build the dynamic profile href once we have the username
    if (nav.id === "profile" && user?.user_metadata?.username) {
      const myProfileHref = `/profile/${user.user_metadata.username}`;
      return {
        ...nav,
        href: myProfileHref,
        active: pathname === myProfileHref,
      };
    }
    return {
      ...nav,
      active:
        nav.href === pathname ||
        (nav.href !== undefined && pathname.startsWith(`${nav.href}/`)),
    };
  });


  return (
    <div className="fixed inset-x-0 bottom-0 z-50 h-13 border-t border-retro-muted/30 bg-retro-bg xl:hidden">
      <nav className="flex h-full items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {sections.map((nav) => (
          <Link
            href={nav.href}
            key={nav.id}
          >
            <span>{nav.icon}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}