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
            <a className="flex items-center">
              <span className="text-[#1E88E5] text-2xl font-bold">全国高校大学生竞赛平台</span>
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className="text-[#333333] hover:text-[#1E88E5] font-medium">首页</a>
          </Link>
          
          <NavbarLink href="#" text="赛事信息">
            <Link href="/">
              <a className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white">全部赛事</a>
            </Link>
            <Link href="/">
              <a className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white">正在报名</a>
            </Link>
            <Link href="/">
              <a className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white">即将开始</a>
            </Link>
            <Link href="/">
              <a className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#1E88E5] hover:text-white">历届赛事</a>
            </Link>
          </NavbarLink>
          
          <Link href="/">
            <a className="text-[#333333] hover:text-[#1E88E5] font-medium">参赛指南</a>
          </Link>
          
          <Link href="/">
            <a className="text-[#333333] hover:text-[#1E88E5] font-medium">新闻公告</a>
          </Link>
          
          <Link href="/">
            <a className="text-[#333333] hover:text-[#1E88E5] font-medium">关于我们</a>
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
              <Link href="/auth">
                <a className="hidden md:inline-block text-[#1E88E5] hover:text-primary-dark">
                  登录
                </a>
              </Link>
              <Link href="/auth">
                <a className="hidden md:inline-block bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all">
                  注册
                </a>
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
            <a className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2">首页</a>
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
              <Link href="/">
                <a className="block py-2 text-[#333333] hover:text-[#1E88E5]">全部赛事</a>
              </Link>
              <Link href="/">
                <a className="block py-2 text-[#333333] hover:text-[#1E88E5]">正在报名</a>
              </Link>
              <Link href="/">
                <a className="block py-2 text-[#333333] hover:text-[#1E88E5]">即将开始</a>
              </Link>
              <Link href="/">
                <a className="block py-2 text-[#333333] hover:text-[#1E88E5]">历届赛事</a>
              </Link>
            </div>
          </div>
          
          <Link href="/">
            <a className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2">参赛指南</a>
          </Link>
          
          <Link href="/">
            <a className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2">新闻公告</a>
          </Link>
          
          <Link href="/">
            <a className="block text-[#333333] hover:text-[#1E88E5] font-medium py-2">关于我们</a>
          </Link>
          
          {!user && (
            <div className="flex space-x-3 pt-3 border-t border-gray-200">
              <Link href="/auth">
                <a className="bg-white border border-[#1E88E5] text-[#1E88E5] font-medium py-2 px-4 rounded-md text-center w-1/2">
                  登录
                </a>
              </Link>
              <Link href="/auth">
                <a className="bg-[#1E88E5] text-white font-medium py-2 px-4 rounded-md text-center w-1/2">
                  注册
                </a>
              </Link>
            </div>
          )}
          
          {user && (
            <div className="pt-3 border-t border-gray-200">
              {user.role === "admin" && (
                <Link href="/admin">
                  <a className="block py-2 text-[#333333] hover:text-[#1E88E5]">管理后台</a>
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
