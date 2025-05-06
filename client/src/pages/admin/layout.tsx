import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  if (!user || user.role !== "admin") {
    navigate("/auth");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  const menuItems = [
    {
      title: "仪表盘",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "赛事管理",
      path: "/admin/competitions",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "参赛者管理",
      path: "/admin/participants",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r shadow-sm">
        <div className="p-6">
          <Link href="/">
            <a className="flex items-center">
              <span className="text-xl font-bold text-[#1E88E5]">竞赛平台</span>
              <span className="ml-2 text-xl font-bold">管理后台</span>
            </a>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`flex items-center px-4 py-3 text-base rounded-md transition-colors ${
                  location === item.path
                    ? "bg-[#1E88E5] text-white"
                    : "text-gray-700 hover:bg-[#1E88E5]/10 hover:text-[#1E88E5]"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </a>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="md:hidden sticky top-0 z-10 bg-white border-b shadow-sm p-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-lg font-bold text-[#1E88E5]">竞赛平台管理后台</span>
              </a>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex overflow-x-auto mt-4 pb-2 space-x-2">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex items-center px-3 py-2 text-sm rounded-md whitespace-nowrap ${
                    location === item.path
                      ? "bg-[#1E88E5] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </a>
              </Link>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
