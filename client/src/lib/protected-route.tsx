import { Route, useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "@/components/ui/navigate";

export function ProtectedRoute(Component: React.ComponentType) {
  return function ProtectedRouteWrapper(props: any) {
    const { user } = useAuth();
    const [match, params] = useRoute();

    if (!user) {
      return <Navigate to="/login" />;
  }

  // Admin route check
    if (match && match.toString().startsWith("/admin") && user.role !== "admin") {
    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">访问受限</h1>
            <p className="text-gray-600">您没有权限访问此页面</p>
          </div>
        </div>
    );
  }

    return <Component {...props} />;
  };
}
