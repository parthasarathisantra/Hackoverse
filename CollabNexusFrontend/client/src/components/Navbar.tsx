import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-6">

          {/* Logo */}
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer">
              CollabNexus
            </span>
          </Link>

          {/* Profile Page Link (NEW) */}
          {currentUser && (
            <Link href="/profile">
              <span className="cursor-pointer text-sm font-medium text-gray-700 hover:text-black transition">
                Profile
              </span>
            </Link>
          )}
        </div>

        {/* CENTER NAV LINKS */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/">
            <span className="hover:text-primary cursor-pointer">Home</span>
          </Link>

          {currentUser && (
            <>
              <Link href="/dashboard">
                <span className="hover:text-primary cursor-pointer">Dashboard</span>
              </Link>

              <Link href="/projects">
                <span className="hover:text-primary cursor-pointer">Projects</span>
              </Link>

              <Link href="/matchmaking">
                <span className="hover:text-primary cursor-pointer">Find Teammates</span>
              </Link>

              <Link href="/reviews">
                <span className="hover:text-primary cursor-pointer">Reviews</span>
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SECTION (Login / Logout) */}
        <div>
          {currentUser ? (
            <Button
              variant="destructive"
              className="px-6"
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button className="px-6">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
