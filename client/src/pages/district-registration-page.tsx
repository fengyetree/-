import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function DistrictRegistrationPage() {
  const [, params] = useRoute("/competition/:competitionId/districts/:districtName/register");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const competitionId = params?.competitionId;
  const districtName = params?.districtName;

  // TODO: 根据 competitionId 和 districtId 获取赛区详细信息和比赛信息
  // 可以复用获取比赛信息的 useQuery
  const { data: competition, isLoading: isCompetitionLoading } = useQuery<Competition>({
    queryKey: [`/api/competitions/${competitionId}`],
    enabled: !!competitionId,
  });

  // TODO: 添加获取赛区详细信息的 useQuery
  // const { data: district, isLoading: isDistrictLoading } = useQuery<District>({
  //   queryKey: [`/api/districts/${districtId}`],
  //   enabled: !!districtId,
  // });

  const competitionTitle = competition?.title || "加载中...";

   const handleRegister = async (e: React.MouseEvent) => {
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      // 通知父级需要登录
      window.parent.postMessage({ type: 'NEED_LOGIN' }, '*');
      return;
    }

    try {
      // 请求加密接口
      const response = await fetch('http://localhost:10090/encryptUserInformationToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('加密请求失败');
      }

      const res = await response.json();
      if (res.code === 200) {
        const competitionUrl = "http://localhost:3100?auth_code=" + window.encodeURIComponent(res.data);
        console.log(competitionUrl);
        // 打开新标签页
        window.open(competitionUrl, '_blank');
      }
    } catch (error) {
      console.error('加密请求出错:', error);
      e.preventDefault();
      return;
    }
  };

  // TODO: 处理加载和错误状态
  if (isCompetitionLoading) {
     return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 px-4 flex justify-center">
          加载中...
        </div>
        <Footer />
      </>
    );
  }


  return (
    <>
      <Helmet>
        <title>{competitionTitle} - {districtName} 报名 - 全国高校大学生竞赛平台</title>
        <meta name="description" content={`报名参与 ${competitionTitle} 的 ${districtName} 赛区。`} />
      </Helmet>
      <Navbar />

      <main className="bg-[#F5F5F5] min-h-screen py-12">
        <div className="container mx-auto px-4">
            <Button
                variant="ghost"
                onClick={() => navigate(`/competition/${competitionId}/districts`)}
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回赛区列表
            </Button>
          <div className="bg-white rounded-lg p-6 shadow-md mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
              {competitionTitle} - {districtName}
            </h1>
            <p className="text-gray-600">
              在这里填写报名信息，参加 {districtName} 的比赛。
            </p>
          </div>

          {/* TODO: 添加赛区详情和报名表单组件 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">报名表单 (Placeholder)</h2>
            <p>这里将是赛区详情和具体的报名表单。</p>
            {/* 示例：添加一个简单的报名按钮 */}
             <Button className="mt-4 bg-[#1E88E5]"  onClick={handleRegister}>
                立即报名
             </Button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
} 