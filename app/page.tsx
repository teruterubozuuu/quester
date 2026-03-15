import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export default function Page() {
  const navLinks = [
    { id: "home", content: "Home", href: "/" },
    { id: "about", content: "About", href: "#about" },
    { id: "features", content: "Features", href: "#features" },
    { id: "contact", content: "Contact", href: "#contact" },
    { id: "sign-in", content: "Sign In", href: "/sign-in" },
  ]
  return (
    <>
      <NavigationMenu>
        <div className="flex w-screen justify-between border-b p-2">
          <div>
            <NavigationMenuItem>
              <NavigationMenuLink>Quester</NavigationMenuLink>
            </NavigationMenuItem>
          </div>

          <div>
            <NavigationMenuList className="cursor-pointer">
              {navLinks.map((links) => (
                <NavigationMenuItem key={links.id}>
                  <NavigationMenuLink
                    className={
                      links.id === "sign-in"
                        ? "bg-primary px-5 hover:bg-primary/40 ml-2"
                        : ""
                    }
                    href={links.href}
                  >
                    {links.content}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </div>
        </div>
      </NavigationMenu>
    </>
  )
}
