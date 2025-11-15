import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!loading && !currentUser) {
      setLocation("/login");
    }
  }, [currentUser, loading, setLocation]);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not logged in (useEffect will handle redirect)
  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
