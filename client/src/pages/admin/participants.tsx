import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Registration, Competition, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Search,
  Award,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

export default function AdminParticipants() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Queries
  const { data: registrations, isLoading: isLoadingRegistrations } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
  });

  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Mutations
  const updateRegistrationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/registrations/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      toast({
        title: "状态已更新",
        description: "参赛申请状态已成功更新",
      });
      setIsViewingDetails(false);
    },
    onError: (error: Error) => {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle approve registration
  const handleApproveRegistration = async (id: number) => {
    await updateRegistrationStatusMutation.mutateAsync({ id, status: "approved" });
  };

  // Handle reject registration
  const handleRejectRegistration = async (id: number) => {
    await updateRegistrationStatusMutation.mutateAsync({ id, status: "rejected" });
  };

  // Filter registrations based on active tab and search query
  const filteredRegistrations = registrations?.filter((registration) => {
    if (!registration) return false;
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pending" && registration.status === "pending") ||
      (activeTab === "approved" && registration.status === "approved") ||
      (activeTab === "rejected" && registration.status === "rejected");
    
    if (!matchesTab) return false;
    
    if (searchQuery.trim() === "") return true;
    
    const teamName = registration.teamName?.toLowerCase() || "";
    const competitionName = competitions?.find(c => c.id === registration.competitionId)?.title.toLowerCase() || "";
    const userName = users?.find(u => u.id === registration.userId)?.username.toLowerCase() || "";
    const university = users?.find(u => u.id === registration.userId)?.university?.toLowerCase() || "";
    
    return teamName.includes(searchQuery.toLowerCase()) || 
           competitionName.includes(searchQuery.toLowerCase()) ||
           userName.includes(searchQuery.toLowerCase()) ||
           university?.includes(searchQuery.toLowerCase());
  });

  // Get competition name by ID
  const getCompetitionName = (competitionId: number) => {
    const competition = competitions?.find(c => c.id === competitionId);
    return competition ? competition.title : "未知赛事";
  };

  // Get user information by ID
  const getUserInfo = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user ? { username: user.username, university: user.university } : { username: "未知用户", university: "未知院校" };
  };

  // View registration details
  const viewRegistrationDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsViewingDetails(true);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>参赛者管理 - 全国高校大学生竞赛平台</title>
        <meta name="description" content="管理参赛团队和审核参赛申请" />
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">参赛者管理</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索参赛者..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>参赛统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-[#1E88E5]" />
                    <span>总参赛申请</span>
                  </div>
                  <span className="font-bold">{registrations?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-[#FFC107]" />
                    <span>待审核</span>
                  </div>
                  <span className="font-bold">{registrations?.filter(r => r.status === "pending").length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-green-500" />
                    <span>已通过</span>
                  </div>
                  <span className="font-bold">{registrations?.filter(r => r.status === "approved").length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-5 w-5 text-red-500" />
                    <span>已拒绝</span>
                  </div>
                  <span className="font-bold">{registrations?.filter(r => r.status === "rejected").length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>参赛申请列表</CardTitle>
              <CardDescription>
                审核和管理所有参赛团队
              </CardDescription>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="pending">待审核</TabsTrigger>
                  <TabsTrigger value="approved">已通过</TabsTrigger>
                  <TabsTrigger value="rejected">已拒绝</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {isLoadingRegistrations ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>团队名称</TableHead>
                        <TableHead>参赛赛事</TableHead>
                        <TableHead>申请者</TableHead>
                        <TableHead>院校</TableHead>
                        <TableHead>提交时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations?.map((registration) => {
                        const userInfo = getUserInfo(registration.userId);
                        return (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">{registration.teamName || "未命名团队"}</TableCell>
                            <TableCell>{getCompetitionName(registration.competitionId)}</TableCell>
                            <TableCell>{userInfo.username}</TableCell>
                            <TableCell>{userInfo.university || "未知院校"}</TableCell>
                            <TableCell>
                              {registration.createdAt ? format(new Date(registration.createdAt), 'yyyy-MM-dd') : '-'}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                ${registration.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                  registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {registration.status === 'approved' ? '已通过' : 
                                 registration.status === 'pending' ? '待审核' : '已拒绝'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => viewRegistrationDetails(registration)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {registration.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-green-500"
                                    onClick={() => handleApproveRegistration(registration.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() => handleRejectRegistration(registration.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {!filteredRegistrations || filteredRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            暂无参赛申请数据
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Registration Details Dialog */}
      <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>参赛申请详情</DialogTitle>
            <DialogDescription>
              查看参赛团队的详细信息
            </DialogDescription>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">团队名称</h4>
                  <p className="text-lg font-semibold">{selectedRegistration.teamName || "未命名团队"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">参赛赛事</h4>
                  <p className="text-lg font-semibold">{getCompetitionName(selectedRegistration.competitionId)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">申请者</h4>
                  <p className="text-lg font-semibold">{getUserInfo(selectedRegistration.userId).username}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">院校</h4>
                  <p className="text-lg font-semibold">{getUserInfo(selectedRegistration.userId).university || "未知院校"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">提交时间</h4>
                  <p className="text-lg font-semibold">
                    {selectedRegistration.createdAt ? format(new Date(selectedRegistration.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">当前状态</h4>
                  <p className="text-lg font-semibold">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${selectedRegistration.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        selectedRegistration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {selectedRegistration.status === 'approved' ? '已通过' : 
                       selectedRegistration.status === 'pending' ? '待审核' : '已拒绝'}
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedRegistration.status === 'pending' && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">更新申请状态</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                      onClick={() => handleApproveRegistration(selectedRegistration.id)}
                      disabled={updateRegistrationStatusMutation.isPending}
                    >
                      {updateRegistrationStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      通过申请
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                      onClick={() => handleRejectRegistration(selectedRegistration.id)}
                      disabled={updateRegistrationStatusMutation.isPending}
                    >
                      {updateRegistrationStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <XCircle className="mr-2 h-4 w-4" />
                      拒绝申请
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsViewingDetails(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
