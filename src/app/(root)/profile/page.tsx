"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, LogOut, PlusCircle } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <p className="text-center mt-10">Loading profile...</p>
  }

  const user = session?.user

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full shadow-lg rounded-2xl">
        <CardHeader className="flex items-center justify-center flex-col gap-2">
          {user?.image ? (
            <img
              src={user.image}
              alt="User Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <PlusCircle size={64} className="text-muted-foreground" />
          )}
          <CardTitle className="text-xl font-semibold">
            {user?.username || "Username Not Available"}
          </CardTitle>
          {user?.name && (
            <p className="text-sm text-muted-foreground">({user.name})</p>
          )}
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            <User className="inline-block mr-2" size={16} />
            {user?.email || "No email available"}
          </p>
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="destructive"
            className="w-full flex gap-2 justify-center"
          >
            <LogOut size={18} /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
