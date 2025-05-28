import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Competition, insertRegistrationSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { competitionService, registrationService } from "@/lib/services";

const registrationSchema = z.object({
  teamName: z.string().min(2, "团队名称至少需要2个字符").max(50, "团队名称不能超过50个字符"),
  teamMembers: z.string().min(5, "请填写团队成员信息"),
  projectTitle: z.string().min(2, "项目名称至少需要2个字符").max(100, "项目名称不能超过100个字符"),
  projectDescription: z.string().min(10, "项目描述至少需要10个字符"),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterCompetition() {
  const [, params] = useRoute("/register-competition/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const competitionId = params?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: competition, isLoading: isCompetitionLoading } = useQuery<Competition>({
    queryKey: [`/api/competitions/${competitionId}`],
    enabled: !!competitionId,
    queryFn: () => competitionService.getCompetition(parseInt(competitionId as string)),
  });

  const { data: isRegistered } = useQuery<boolean>({
    queryKey: [`/api/registrations/check/${competitionId}`],
    enabled: !!competitionId && !!user,
    queryFn: () => registrationService.checkRegistration(parseInt(competitionId as string)),
  });

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: "",
      teamMembers: "",
      projectTitle: "",
      projectDescription: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegistrationFormValues) => {
      if (!user || !competitionId) {
        throw new Error("未登录或竞赛ID无效");
      }

      return registrationService.createRegistration({
        userId: user.id,
        competitionId: parseInt(competitionId),
        teamName: values.teamName,
        status: "pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/registrations/check/${competitionId}`] });
      toast({
        title: "报名成功",
        description: "您的报名信息已提交，请等待审核",
      });
      navigate(`/competition/${competitionId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "报名失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      await registerMutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isCompetitionLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!competition) {
    navigate("/");
    return null;
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>已报名</CardTitle>
              <CardDescription>
                您已经报名参加了"{competition.title}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>报名参赛 - {competition.title} - 全国高校大学生竞赛平台</title>
        <meta name="description" content={`报名参加${competition.title}，填写团队信息和项目提案，展示您的创新能力！`} />
      </Helmet>
      <Navbar />

      <div className="bg-[#F5F5F5] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/competition/${competitionId}`)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回赛事详情
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>报名参赛 - {competition.title}</CardTitle>
                <CardDescription>
                  请填写您的参赛信息，提交后等待审核
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="teamName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>团队名称</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入团队名称" {...field} />
                          </FormControl>
                          <FormDescription>
                            创建一个独特的团队名称，将代表您的团队参赛
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teamMembers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>团队成员</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="请填写团队成员信息，格式：姓名/学校/专业/年级" 
                              className="resize-none min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            填写所有团队成员信息，包括姓名、学校、专业和年级
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>项目名称</FormLabel>
                          <FormControl>
                            <Input placeholder="请输入项目名称" {...field} />
                          </FormControl>
                          <FormDescription>
                            一个简短而有吸引力的项目名称
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>项目描述</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="请简要描述您的项目创意、解决的问题和预期成果" 
                              className="resize-none min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            简要介绍您的项目创意、解决的问题和预期成果
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-[#1E88E5] hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 提交中...</> : 
                          "提交报名"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}