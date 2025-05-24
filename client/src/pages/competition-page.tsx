import { useQuery } from "@tanstack/react-query";
import { Link, useRoute, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Competition, Track } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Calendar, Users, Award, School, Clock } from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

export default function CompetitionPage() {
  const [, params] = useRoute("/competition/:id");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const competitionId = params?.id;

  const { data: competition, isLoading: isCompetitionLoading } = useQuery<Competition>({
    queryKey: [`/api/competitions/${competitionId}`],
    enabled: !!competitionId,
  });

  const { data: track } = useQuery<Track>({
    queryKey: [`/api/tracks/${competition?.trackId}`],
    enabled: !!competition?.trackId,
  });

  const { data: isRegistered } = useQuery<boolean>({
    queryKey: [`/api/registrations/check/${competitionId}`],
    enabled: !!competitionId && !!user,
  });

  const registrationDeadline = competition?.registrationDeadline 
    ? new Date(competition.registrationDeadline)
    : null;
  
  const isRegistrationOpen = registrationDeadline && registrationDeadline > new Date();

  const handleRegister = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate(`/register-competition/${competitionId}`);
  };

  if (isCompetitionLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!competition) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">赛事不存在</h1>
            <p className="mb-6">抱歉，您查询的赛事不存在或已被删除。</p>
            <Link href="/">
              <a className="inline-block bg-primary text-white px-4 py-2 rounded-md">
                返回首页
              </a>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-white rounded-full shadow-lg border border-blue-200 p-3 hover:bg-blue-100 hover:text-[#1E88E5] transition z-50 text-lg font-bold text-[#333]"
        style={{ boxShadow: '0 4px 16px rgba(30,136,229,0.10)' }}
      >
        返回主页
      </button>
      <Helmet>
        <title>{competition.title} - 全国高校大学生竞赛平台</title>
        <meta name="description" content={competition.description || `查看${competition.title}详情并参与报名。全国高校大学生竞赛平台为全国大学生提供优质竞赛服务。`} />
      </Helmet>
      <Navbar />
      
      <main className="bg-[#F5F5F5] min-h-screen">
        {/* Hero Banner */}
        <div 
          className="w-full h-64 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${competition.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1000'})` 
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{competition.title}</h1>
              {track && (
                <div className="inline-block bg-[#1E88E5]/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {track.name}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Competition Details */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">赛事详情</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">{competition.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-4">赛事亮点</h3>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-check text-[#1E88E5] text-sm"></i>
                        </span>
                        <span>培养创新思维和实践能力，提升综合素质</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-check text-[#1E88E5] text-sm"></i>
                        </span>
                        <span>对接优质企业资源，获得实习和就业机会</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-check text-[#1E88E5] text-sm"></i>
                        </span>
                        <span>优秀项目有机会获得风险投资和创业扶持</span>
                      </li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mb-4">参赛规则</h3>
                    <p>1. 参赛对象：全国高校在校学生，可跨校组队</p>
                    <p>2. 团队规模：每队人数3-5人，需设一名队长</p>
                    <p>3. 指导教师：每队可有1-2名指导教师</p>
                    <p>4. 作品要求：参赛作品必须为原创，且不得侵犯他人知识产权</p>
                    <p>5. 评审标准：创新性(30%)、实用性(25%)、完整性(20%)、展示表现(15%)、团队协作(10%)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">报名信息</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">报名截止日期</p>
                        <p className="font-medium">
                          {registrationDeadline ? format(registrationDeadline, 'yyyy年MM月dd日') : '待定'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">参赛团队</p>
                        <p className="font-medium">已有165支队伍报名</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">参赛院校</p>
                        <p className="font-medium">来自28所高校</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">奖项设置</p>
                        <p className="font-medium">金奖(3名)、银奖(5名)、铜奖(10名)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">竞赛周期</p>
                        <p className="font-medium">
                          {competition.startDate && competition.endDate ? 
                            `${format(new Date(competition.startDate), 'yyyy年MM月dd日')} - ${format(new Date(competition.endDate), 'yyyy年MM月dd日')}` : 
                            '待定'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isRegistered ? (
                    <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                      已报名
                    </Button>
                  ) : isRegistrationOpen ? (
                    <Button 
                      className="w-full bg-[#1E88E5] hover:bg-blue-700"
                      onClick={handleRegister}
                    >
                      立即报名
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      报名已截止
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">主办单位</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1E88E5] font-bold text-sm">主办</span>
                      </div>
                      <span>中国高等教育学会</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1E88E5] font-bold text-sm">承办</span>
                      </div>
                      <span>全国高校创新创业教育联盟</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1E88E5] font-bold text-sm">协办</span>
                      </div>
                      <span>中国科学院科技创新发展中心</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
