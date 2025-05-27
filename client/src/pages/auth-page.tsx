import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { universities } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(1, "密码不能为空"),
});

// Registration form schema
const registerSchema = insertUserSchema.extend({
  username: z.string().min(2, "用户名至少需要2个字符").max(30, "用户名不能超过30个字符"),
  password: z.string().min(6, "密码至少需要6个字符"),
  confirmPassword: z.string(),
  email: z.string().email("请输入有效的邮箱地址").optional().or(z.literal('')),
  university: z.string().min(1, "请选择您的院校"),
}).refine(data => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form setup
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      university: "",
      role: "student",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    await loginMutation.mutateAsync(values);
  };

  // Handle registration form submission
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...registerData } = values;
    await registerMutation.mutateAsync(registerData);
  };

  return (
    <>
      <Helmet>
        <title>登录/注册 - 全国高校大学生竞赛平台</title>
        <meta name="description" content="加入全国高校大学生竞赛平台，开启您的创新创业之旅。提供便捷的注册和登录服务，参与精彩赛事！" />
      </Helmet>
      <Navbar />
      
      <div className="min-h-screen bg-[#F5F5F5] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">欢迎加入全国高校大学生竞赛平台</h1>
                
                <Tabs defaultValue={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
                  <TabsList className="mb-6 grid grid-cols-2">
                    <TabsTrigger value="login">登录</TabsTrigger>
                    <TabsTrigger value="register">注册</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>用户名</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入用户名" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>密码</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="请输入密码" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-[#1E88E5] hover:bg-blue-700"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "登录中..." : "登录"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>用户名</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入用户名" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>邮箱</FormLabel>
                              <FormControl>
                                <Input placeholder="请输入邮箱" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>密码</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="请输入密码" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>确认密码</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="请再次输入密码" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>所在院校</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="请选择院校" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {universities.map((university) => (
                                    <SelectItem key={university} value={university}>
                                      {university}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-[#1E88E5] hover:bg-blue-700"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "注册中..." : "注册"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Hero section */}
              <div className="hidden md:block bg-[#1E88E5] text-white p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">加入我们，开启创新之旅</h2>
                <p className="mb-8">全国高校大学生竞赛平台为您提供丰富的创新创业竞赛资源，让您的创意得到展示和发展的机会。</p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 mr-4">
                      <i className="fas fa-trophy text-[#FFC107]"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">多元化赛事</h3>
                      <p className="text-white/80">参与创新创业、人工智能、生物医学等多个领域的专业竞赛</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 mr-4">
                      <i className="fas fa-users text-[#FFC107]"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">优秀导师指导</h3>
                      <p className="text-white/80">来自各大高校和企业的专业导师全程辅导和评审</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 mr-4">
                      <i className="fas fa-lightbulb text-[#FFC107]"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">丰厚奖励</h3>
                      <p className="text-white/80">优秀项目将获得资金支持、创业孵化和行业资源对接机会</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
