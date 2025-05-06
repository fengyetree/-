import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Competition,
  Track,
  insertCompetitionSchema,
  insertTrackSchema,
} from "@shared/schema";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Calendar,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

// Competition form schema
const competitionFormSchema = insertCompetitionSchema.extend({
  title: z.string().min(2, "标题至少需要2个字符").max(100, "标题不能超过100个字符"),
  description: z.string().min(10, "描述至少需要10个字符"),
  imageUrl: z.string().url("请输入有效的图片URL").optional().or(z.literal('')),
  trackId: z.number().or(z.string().transform(val => parseInt(val))),
  registrationDeadline: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

// Track form schema
const trackFormSchema = insertTrackSchema.extend({
  name: z.string().min(2, "名称至少需要2个字符").max(50, "名称不能超过50个字符"),
  description: z.string().min(10, "描述至少需要10个字符"),
  icon: z.string().min(1, "请选择一个图标"),
});

export default function AdminCompetitions() {
  const [isAddingCompetition, setIsAddingCompetition] = useState(false);
  const [isEditingCompetition, setIsEditingCompetition] = useState(false);
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const { toast } = useToast();

  // Queries
  const { data: competitions, isLoading: isLoadingCompetitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: tracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  // Competition form
  const competitionForm = useForm<z.infer<typeof competitionFormSchema>>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      trackId: 0,
      registrationDeadline: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "active",
    },
  });

  // Track form
  const trackForm = useForm<z.infer<typeof trackFormSchema>>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  // Competition mutations
  const createCompetitionMutation = useMutation({
    mutationFn: async (values: z.infer<typeof competitionFormSchema>) => {
      const res = await apiRequest("POST", "/api/competitions", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      setIsAddingCompetition(false);
      competitionForm.reset();
      toast({
        title: "创建成功",
        description: "赛事已成功创建",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "创建失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCompetitionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: z.infer<typeof competitionFormSchema> }) => {
      const res = await apiRequest("PATCH", `/api/competitions/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      setIsEditingCompetition(false);
      setSelectedCompetition(null);
      competitionForm.reset();
      toast({
        title: "更新成功",
        description: "赛事信息已更新",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCompetitionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/competitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competitions"] });
      toast({
        title: "删除成功",
        description: "赛事已成功删除",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "删除失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Track mutations
  const createTrackMutation = useMutation({
    mutationFn: async (values: z.infer<typeof trackFormSchema>) => {
      const res = await apiRequest("POST", "/api/tracks", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks"] });
      setIsAddingTrack(false);
      trackForm.reset();
      toast({
        title: "创建成功",
        description: "赛道已成功创建",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "创建失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle edit competition
  const handleEditCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
    competitionForm.reset({
      title: competition.title,
      description: competition.description || "",
      imageUrl: competition.imageUrl || "",
      trackId: competition.trackId,
      registrationDeadline: competition.registrationDeadline ? 
        new Date(competition.registrationDeadline).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
      startDate: competition.startDate ? 
        new Date(competition.startDate).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
      endDate: competition.endDate ? 
        new Date(competition.endDate).toISOString().split('T')[0] : 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: competition.status,
    });
    setIsEditingCompetition(true);
  };

  // Handle competition submission
  const onCompetitionSubmit = async (values: z.infer<typeof competitionFormSchema>) => {
    if (isEditingCompetition && selectedCompetition) {
      await updateCompetitionMutation.mutateAsync({
        id: selectedCompetition.id,
        data: values,
      });
    } else {
      await createCompetitionMutation.mutateAsync(values);
    }
  };

  // Handle track submission
  const onTrackSubmit = async (values: z.infer<typeof trackFormSchema>) => {
    await createTrackMutation.mutateAsync(values);
  };

  // Handle delete competition
  const handleDeleteCompetition = async (id: number) => {
    if (confirm("确定要删除这个赛事吗？此操作不可逆。")) {
      await deleteCompetitionMutation.mutateAsync(id);
    }
  };

  // Find track name by ID
  const getTrackName = (trackId: number) => {
    const track = tracks?.find(t => t.id === trackId);
    return track ? track.name : "未知赛道";
  };

  // Available icons for tracks
  const trackIcons = [
    "fas fa-lightbulb",
    "fas fa-laptop-code",
    "fas fa-leaf",
    "fas fa-flask",
    "fas fa-brain",
    "fas fa-robot",
    "fas fa-seedling",
    "fas fa-microscope",
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>赛事管理 - 全国高校大学生竞赛平台</title>
        <meta name="description" content="管理平台上的所有竞赛信息，创建和编辑赛事与赛道" />
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">赛事管理</h2>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddingTrack} onOpenChange={setIsAddingTrack}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  添加赛道
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新赛道</DialogTitle>
                  <DialogDescription>
                    创建一个新的竞赛赛道类别
                  </DialogDescription>
                </DialogHeader>
                <Form {...trackForm}>
                  <form onSubmit={trackForm.handleSubmit(onTrackSubmit)} className="space-y-4">
                    <FormField
                      control={trackForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛道名称</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：创新创业赛道" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛道描述</FormLabel>
                          <FormControl>
                            <Textarea placeholder="简要描述赛道的特点和要求" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackForm.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛道图标</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="选择图标" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {trackIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  <div className="flex items-center">
                                    <i className={`${icon} mr-2 text-[#1E88E5]`}></i>
                                    {icon.split('-')[1]}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" className="bg-[#1E88E5]" disabled={createTrackMutation.isPending}>
                        {createTrackMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        创建赛道
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddingCompetition} onOpenChange={setIsAddingCompetition}>
              <DialogTrigger asChild>
                <Button className="bg-[#1E88E5]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  添加赛事
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>添加新赛事</DialogTitle>
                  <DialogDescription>
                    创建一个新的竞赛项目
                  </DialogDescription>
                </DialogHeader>
                <Form {...competitionForm}>
                  <form onSubmit={competitionForm.handleSubmit(onCompetitionSubmit)} className="space-y-4">
                    <FormField
                      control={competitionForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛事标题</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：2023全国大学生创新创业大赛" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={competitionForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛事描述</FormLabel>
                          <FormControl>
                            <Textarea placeholder="详细介绍赛事的目标、内容和意义" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={competitionForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>封面图片URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            提供赛事宣传图片的URL链接
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={competitionForm.control}
                        name="trackId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>所属赛道</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择赛道" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tracks?.map((track) => (
                                  <SelectItem key={track.id} value={track.id.toString()}>
                                    {track.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={competitionForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>赛事状态</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择状态" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">活跃</SelectItem>
                                <SelectItem value="upcoming">即将开始</SelectItem>
                                <SelectItem value="completed">已结束</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={competitionForm.control}
                        name="registrationDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>报名截止日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={competitionForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>开始日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={competitionForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>结束日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-[#1E88E5]"
                        disabled={createCompetitionMutation.isPending || updateCompetitionMutation.isPending}
                      >
                        {(createCompetitionMutation.isPending || updateCompetitionMutation.isPending) && 
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditingCompetition ? "更新赛事" : "创建赛事"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditingCompetition} onOpenChange={setIsEditingCompetition}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>编辑赛事</DialogTitle>
                  <DialogDescription>
                    修改赛事信息
                  </DialogDescription>
                </DialogHeader>
                <Form {...competitionForm}>
                  <form onSubmit={competitionForm.handleSubmit(onCompetitionSubmit)} className="space-y-4">
                    <FormField
                      control={competitionForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛事标题</FormLabel>
                          <FormControl>
                            <Input placeholder="例如：2023全国大学生创新创业大赛" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={competitionForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>赛事描述</FormLabel>
                          <FormControl>
                            <Textarea placeholder="详细介绍赛事的目标、内容和意义" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={competitionForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>封面图片URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            提供赛事宣传图片的URL链接
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={competitionForm.control}
                        name="trackId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>所属赛道</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择赛道" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tracks?.map((track) => (
                                  <SelectItem key={track.id} value={track.id.toString()}>
                                    {track.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={competitionForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>赛事状态</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="选择状态" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">活跃</SelectItem>
                                <SelectItem value="upcoming">即将开始</SelectItem>
                                <SelectItem value="completed">已结束</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={competitionForm.control}
                        name="registrationDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>报名截止日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={competitionForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>开始日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={competitionForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>结束日期</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-[#1E88E5]"
                        disabled={updateCompetitionMutation.isPending}
                      >
                        {updateCompetitionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        更新赛事
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>赛事列表</CardTitle>
            <CardDescription>
              管理平台上的所有竞赛信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCompetitions || isLoadingTracks ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>标题</TableHead>
                      <TableHead>赛道</TableHead>
                      <TableHead>报名截止日期</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitions?.map((competition) => (
                      <TableRow key={competition.id}>
                        <TableCell className="font-medium">{competition.title}</TableCell>
                        <TableCell>{getTrackName(competition.trackId)}</TableCell>
                        <TableCell>
                          {competition.registrationDeadline ? 
                            format(new Date(competition.registrationDeadline), 'yyyy-MM-dd') : 
                            '未设置'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${competition.status === 'active' ? 'bg-green-100 text-green-800' : 
                              competition.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {competition.status === 'active' ? '活跃' : 
                             competition.status === 'upcoming' ? '即将开始' : '已结束'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditCompetition(competition)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDeleteCompetition(competition.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {!competitions || competitions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          暂无赛事数据
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>赛道管理</CardTitle>
            <CardDescription>
              管理竞赛赛道分类
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTracks ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tracks?.map((track) => (
                  <Card key={track.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center">
                          <i className={`${track.icon} text-[#1E88E5]`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{track.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{track.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {!tracks || tracks.length === 0 ? (
                  <div className="col-span-full flex justify-center items-center py-4 text-muted-foreground">
                    暂无赛道数据
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
