import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Award,
  Calendar,
  BarChart,
  PlusCircle,
  Layers,
  ClipboardList,
} from "lucide-react";
import { Competition, Track, Registration } from "@shared/schema";
import AdminLayout from "./layout";
import { Helmet } from "react-helmet";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: tracks } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  const { data: registrations } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
  });

  const totalCompetitions = competitions?.length || 0;
  const activeCompetitions = competitions?.filter(c => c.status === "active").length || 0;
  const pendingRegistrations = registrations?.filter(r => r.status === "pending").length || 0;
  const approvedRegistrations = registrations?.filter(r => r.status === "approved").length || 0;

  return (
    <AdminLayout>
      <Helmet>
        <title>管理后台 - 全国高校大学生竞赛平台</title>
        <meta name="description" content="全国高校大学生竞赛平台管理后台，管理赛事和参赛者信息" />
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">管理后台</h2>
          <div className="flex items-center space-x-2">
            <Link href="/admin/competitions">
              <Button className="bg-[#1E88E5]">
                <PlusCircle className="mr-2 h-4 w-4" />
                创建新赛事
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="competitions">赛事管理</TabsTrigger>
            <TabsTrigger value="participants">参赛管理</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总赛事数量</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCompetitions}</div>
                  <p className="text-xs text-muted-foreground">
                    正在进行: {activeCompetitions}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">报名总数</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{registrations?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    待审核: {pendingRegistrations}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">赛道数量</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tracks?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    活跃赛道: {tracks?.length || 0}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">审核通过率</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {registrations?.length ? 
                      Math.round((approvedRegistrations / registrations.length) * 100) + "%" : 
                      "0%"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    已通过: {approvedRegistrations}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>近期赛事</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-8">
                    {competitions?.slice(0, 5).map((competition) => (
                      <div key={competition.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{competition.title}</p>
                          <p className="text-sm text-muted-foreground">
                            截止日期: {competition.registrationDeadline ? 
                              new Date(competition.registrationDeadline).toLocaleDateString('zh-CN') : 
                              '未设置'}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {competition.status === 'active' ? (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80">
                              活跃
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground border-border">
                              已结束
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {(!competitions || competitions.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">暂无赛事数据</p>
                    )}
                  </div>

                  {competitions && competitions.length > 0 && (
                    <div className="mt-6 text-right">
                      <Link href="/admin/competitions">
                        <Button variant="ghost" className="text-[#1E88E5]">
                          查看全部
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>待处理报名</CardTitle>
                  <CardDescription>
                    最近等待审核的报名
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registrations?.filter(r => r.status === "pending")
                      .slice(0, 5)
                      .map((registration) => (
                        <div key={registration.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                团队: {registration.teamName || '未命名团队'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                报名时间: {new Date(registration.createdAt || '').toLocaleDateString('zh-CN')}
                              </p>
                            </div>
                          </div>
                          <Link href={`/admin/participants`}>
                            <Button variant="outline" size="sm">
                              <ClipboardList className="mr-2 h-4 w-4" />
                              审核
                            </Button>
                          </Link>
                        </div>
                      ))}

                    {(!registrations || registrations.filter(r => r.status === "pending").length === 0) && (
                      <p className="text-center text-muted-foreground py-4">暂无待处理报名</p>
                    )}

                    {registrations && registrations.filter(r => r.status === "pending").length > 0 && (
                      <div className="mt-6 text-right">
                        <Link href="/admin/participants">
                          <Button variant="ghost" className="text-[#1E88E5]">
                            查看全部
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="competitions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>赛事管理</CardTitle>
                <CardDescription>
                  管理平台上的所有竞赛信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/competitions">
                  <Button className="w-full bg-[#1E88E5]">
                    <Calendar className="mr-2 h-4 w-4" />
                    进入赛事管理
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>参赛者管理</CardTitle>
                <CardDescription>
                  审核和管理参赛团队信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/participants">
                  <Button className="w-full bg-[#1E88E5]">
                    <Users className="mr-2 h-4 w-4" />
                    进入参赛者管理
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
