import { useAuth } from "@/context/AuthContext";
import { Redirect } from "wouter";

export default function PrivateRoute({ component: Component }: any) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return currentUser ? <Component /> : <Redirect to="/login" />;
}
