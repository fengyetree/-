import { useRoute, Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"; // 导入 ArrowLeft 图标
import { useQuery } from "@tanstack/react-query";
import { Competition } from "@shared/schema";

// 这个页面将显示特定赛事的赛区详情
export default function CompetitionDistrictsPage() {
  const [, params] = useRoute("/competition/:id/districts");
  const [, navigate] = useLocation();
  const competitionId = params?.id;

  const { data: competition } = useQuery<Competition>({
    queryKey: [`/api/competitions/${competitionId}`],
    enabled: !!competitionId,
  });

  const competitionTitle = competition?.title || "加载中...";

  // TODO: 这里需要根据 competitionId 从后端获取该赛事的赛区信息
  // 目前先使用模拟数据
  const districts = [
    { id: 1, name: "华北赛区", registrationDates: "2024-09-01 ~ 2024-09-20", preliminaryDates: "2024-10-10 ~ 2024-10-15", finalDate: "2024-12-10" },
    { id: 2, name: "华东赛区", registrationDates: "2024-09-05 ~ 2024-09-25", preliminaryDates: "2024-10-12 ~ 2024-10-18", finalDate: "2024-12-12" },
    { id: 3, name: "西南赛区", registrationDates: "2024-09-10 ~ 2024-09-28", preliminaryDates: "2024-10-15 ~ 2024-10-20", finalDate: "2024-12-15" },
    // ...更多赛区
  ];

  // TODO: 如果 competitionId 无效或未找到比赛，需要处理加载和错误状态

  return (
    <>
      <Helmet>
        <title>{competitionTitle} 赛区列表 - 全国高校大学生竞赛平台</title>
        <meta name="description" content={`查看 ${competitionTitle} 的不同赛区详细信息和时间安排。`} />
      </Helmet>
      {/* <Navbar /> */}

      <main className="bg-[#F5F5F5] min-h-screen py-12">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
            <Button
                variant="ghost"
                onClick={() => navigate(`/competition/${competitionId}/map`)} // 返回到地图页面
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回地图
            </Button>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
              {competitionTitle} - 赛区列表
            </h1>
            <p className="text-gray-600">
              请选择您要报名的赛区，查看详细信息或进行报名。
            </p>
          </div>
        </div>

        {/* Districts List/Timeline */}
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {districts.length > 0 ? (
              districts.map((district) => (
                <Card key={district.id}>
                  <CardContent className="p-6">
                    <Link href={`/competition/${competitionId}/districts/${encodeURIComponent(district.name)}/register`}>
                      <a>
                    <div className="flex items-center mb-4">
                        <MapPin className="h-6 w-6 text-[#1E88E5] mr-3" />
                        <h2 className="text-xl font-bold">{district.name}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <span>报名时间: {district.registrationDates}</span>
                        </div>
                         <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-500 mr-2" />
                            <span>初赛时间: {district.preliminaryDates}</span>
                        </div>
                         <div className="flex items-center">
                            <Clock className="h-5 w-5 text-gray-500 mr-2" />
                            <span>决赛时间: {district.finalDate}</span>
                        </div>
                    </div>
                    {/* TODO: 可以根据需要添加更多赛区相关的详细信息 */}
                      </a>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>暂无赛区信息</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
} 