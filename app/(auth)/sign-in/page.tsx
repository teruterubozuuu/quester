"use client"
import Loader from "@/components/Loader"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try{
      const form = new FormData(e.currentTarget);
      const result = await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        redirect: false, //handle redirect manually to catch errors
        callbackUrl: "/dashboard"
      })

      if(result?.error){
        toast.error("Invalid email or password");
        return;
      }
      router.push("/dashboard");
    } finally{
      setLoading(false);
    }

  }

  if (loading) return <Loader/>
  

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 mt-5">
          <Button
            type="submit"
            className="w-full cursor-pointer text-foreground"
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Login with Google
          </Button>
          <span className="text-center">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline hover:text-primary">
              Sign up here
            </Link>
          </span>
        </CardFooter>
      </form>
    </Card>
  )
}
