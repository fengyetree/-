import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, UserCircle, LogOut } from "lucide-react";

const NavbarLink = ({ href, text, children }: { href: string, text: string, children?: React.ReactNode }) => {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return children ? (
    <div className="relative group">
      <button className="text-[#333333] hover:text-[#1E88E5] font-medium flex items-center"
        onClick={() => setIsOpen(!isOpen)}>
        {text}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      <div className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10 ${isOpen ? 'block' : 'hidden md:group-hover:block'}`}>
        {children}
      </div>
    </div>
  ) : (
    <Link href={href}>
      <a className="text-[#333333] hover:text-[#1E88E5] font-medium">{text}</a>
    </Link>
  );
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <span className="text-[#1E88E5] text-2xl font-bold">全国高校大学生竞赛平台</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <div className="text-[#333333] hover:text-[#1E88E5] font-medium cursor-pointer">首页</div>
          </Link>

          <NavbarLink href="#" text="赛事信息">
            <Link href="/competitions">
              <div className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white cursor-pointer">全部赛事</div>
            </Link>
            <Link href="/competitions?status=active">
              <div className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white cursor-pointer">正在报名</div>
            </Link>
            <Link href="/competitions?status=upcoming">
              <div className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white cursor-pointer">即将开始</div>
            </Link>
            <Link href="/competitions?status=past">
              <div className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white cursor-pointer">历届赛事</div>
            </Link>
          </NavbarLink>

          <Link href="/guide">
            <div className="text-[#333333] hover:text-[#1E88E5] font-medium cursor-pointer">参赛指南</div>
          </Link>

          <Link href="/news">
            <div className="text-[#333333] hover:text-[#1E88E5] font-medium cursor-pointer">新闻公告</div>
          </Link>

          <Link href="/about">
            <div className="text-[#333333] hover:text-[#1E88E5] font-medium cursor-pointer">关于我们</div>
          </Link>
        </div>

        {/* Login/Register */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  {user.username}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => setLocation("/admin")}>
                    管理后台
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <div className="hidden md:inline-block text-[#1E88E5] hover:text-primary-dark cursor-pointer">
                  登录
                </div>
              </Link>
              <Link href="/login">
                <div className="hidden md:inline-block bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all cursor-pointer">
                  注册
                </div>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#333333] hover:text-[#1E88E5]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-3">
          <Link href="/">
            <div className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2 cursor-pointer">首页</div>
          </Link>

          <div className="py-2">
            <button
              className="flex justify-between w-full text-[#333333] font-medium items-center"
              onClick={() => {}}
            >
              赛事信息
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="hidden pl-4 mt-2 space-y-2">
              <Link href="/competitions">
                <div className="block py-2 text-[#333333] hover:text-[#1E88E5] cursor-pointer">全部赛事</div>
              </Link>
              <Link href="/competitions?status=active">
                <div className="block py-2 text-[#333333] hover:text-[#1E88E5] cursor-pointer">正在报名</div>
              </Link>
              <Link href="/competitions?status=upcoming">
                <div className="block py-2 text-[#333333] hover:text-[#1E88E5] cursor-pointer">即将开始</div>
              </Link>
              <Link href="/competitions?status=past">
                <div className="block py-2 text-[#333333] hover:text-[#1E88E5] cursor-pointer">历届赛事</div>
              </Link>
            </div>
          </div>

          <Link href="/guide">
            <div className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2 cursor-pointer">参赛指南</div>
          </Link>

          <Link href="/news">
            <div className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2 cursor-pointer">新闻公告</div>
          </Link>

          <Link href="/about">
            <div className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2 cursor-pointer">关于我们</div>
          </Link>

          {!user && (
            <div className="flex space-x-3 pt-3 border-t border-gray-200">
              <Link href="/login">
                <div className="bg-white border border-[#1E88E5] text-[#1E88E5] font-medium py-2 px-4 rounded-md text-center w-1/2 cursor-pointer">
                  登录
                </div>
              </Link>
              <Link href="/login">
                <div className="bg-[#1E88E5] text-white font-medium py-2 px-4 rounded-md text-center w-1/2 cursor-pointer">
                  注册
                </div>
              </Link>
            </div>
          )}

          {user && (
            <div className="pt-3 border-t border-gray-200">
              {user.role === "admin" && (
                <Link href="/admin">
                  <div className="block py-2 text-[#333333] hover:text-[#1E88E5] cursor-pointer">管理后台</div>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-2 text-[#333333] hover:text-[#1E88E5]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
