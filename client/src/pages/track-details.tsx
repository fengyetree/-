import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Track, Competition } from "@shared/schema";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Users, School, Trophy } from "lucide-react";

export default function TrackDetailsPage() {
  const [, params] = useRoute("/tracks/:id");
  const trackId = params?.id ? parseInt(params.id) : 0;
  const [activeTab, setActiveTab] = useState("introduction");

  // Fetch track data
  const { data: track, isLoading: isLoadingTrack } = useQuery<Track>({
    queryKey: [`/api/tracks/${trackId}`],
    enabled: trackId > 0,
  });

  // Fetch competitions for this track
  const { data: allCompetitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  // Filter competitions for this track
  const trackCompetitions = allCompetitions?.filter(
    (comp) => comp.trackId === trackId
  ) || [];

  // If track not found after loading
  if (!isLoadingTrack && !track) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">未找到赛道信息</h1>
        <p className="text-gray-600 mb-8">
          抱歉，您所查找的赛道信息不存在或已被移除。
        </p>
        <Link href="/">
          <Button className="bg-[#1E88E5]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>
    );
  }

  // 赛道详情内容定制
  const renderCustomContent = (track: Track) => {
    switch (track.name) {
      case "区块链赛道":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">赛道简介</h2>
            <p className="text-gray-700 mb-6">区块链赛道聚焦于区块链底层技术创新、智能合约开发、数字资产管理、去中心化应用（DApp）等领域，推动数字经济与实体经济深度融合。</p>
            <h2 className="text-2xl font-bold mb-4">赛道特点</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>强调去中心化、安全性与可追溯性</li>
              <li>鼓励跨行业区块链创新应用</li>
              <li>支持多链互操作与新型共识机制探索</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4">参赛要求</h2>
            <p className="text-gray-700">参赛项目需具备创新性、可落地性，鼓励结合实际场景提出区块链解决方案。</p>
          </>
        );
      case "智慧交通赛道":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">赛道简介</h2>
            <p className="text-gray-700 mb-6">智慧交通赛道关注智能交通系统、车联网、自动驾驶、交通大数据分析等领域，致力于提升城市交通效率与安全。</p>
            <h2 className="text-2xl font-bold mb-4">赛道特点</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>强调智能感知与实时数据处理</li>
              <li>鼓励交通仿真、路径优化、智能调度等创新</li>
              <li>支持多源数据融合与AI算法应用</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4">参赛要求</h2>
            <p className="text-gray-700">项目需聚焦交通领域实际问题，具备创新性和可推广性。</p>
          </>
        );
      case "航空航天赛道":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">赛道简介</h2>
            <p className="text-gray-700 mb-6">航空航天赛道面向航空航天技术创新、卫星应用、无人机系统、航天器设计等方向，推动前沿科技发展。</p>
            <h2 className="text-2xl font-bold mb-4">赛道特点</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>强调工程创新与系统集成能力</li>
              <li>鼓励新材料、新结构、新动力等探索</li>
              <li>支持航天遥感、空间信息处理等应用</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4">参赛要求</h2>
            <p className="text-gray-700">项目需具备技术创新性和工程可实现性，鼓励产学研结合。</p>
          </>
        );
      case "教育科技赛道":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">赛道简介</h2>
            <p className="text-gray-700 mb-6">教育科技赛道聚焦教育信息化、智能学习、在线教育平台、AI助教等领域，推动教育公平与个性化发展。</p>
            <h2 className="text-2xl font-bold mb-4">赛道特点</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>强调技术赋能教育创新</li>
              <li>鼓励智能评测、个性化推荐、虚拟仿真等应用</li>
              <li>支持多终端、多场景教育解决方案</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4">参赛要求</h2>
            <p className="text-gray-700">项目需关注教育实际需求，具备创新性和社会价值。</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Helmet>
        <title>{track?.name || "赛道详情"} - 全国高校大学生竞赛平台</title>
        <meta
          name="description"
          content={track?.description || "赛道详细信息，包括简介、竞赛和要求"}
        />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-[#1E88E5] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/">
              <a className="text-white hover:text-blue-100">首页</a>
            </Link>
            <span className="mx-2">/</span>
            <Link href="/tracks">
              <a className="text-white hover:text-blue-100">赛道列表</a>
            </Link>
            <span className="mx-2">/</span>
            <span className="text-blue-100">{track?.name || "赛道详情"}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-white/10 rounded-full p-6 mb-4 md:mb-0 md:mr-8">
              <i
                className={`${
                  track?.icon || "fas fa-lightbulb"
                } text-4xl text-white`}
              ></i>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {track?.name || "加载中..."}
              </h1>
              <p className="text-blue-100 max-w-3xl">
                {track?.description || "加载中..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="introduction">赛道简介</TabsTrigger>
              <TabsTrigger value="competitions">相关赛事</TabsTrigger>
              <TabsTrigger value="requirements">参赛要求</TabsTrigger>
            </TabsList>
          </div>

          {/* 赛道简介 */}
          <TabsContent value="introduction" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">赛道背景</h2>
                <p className="text-gray-700 mb-6">
                  {track?.description ||
                    "此赛道致力于培养学生的创新思维和解决实际问题的能力，鼓励跨学科合作和前沿技术应用。通过参与此赛道，学生将有机会展示自己的创新项目，获得专家指导，并有可能获得创业支持和奖金。"}
                </p>
                <h2 className="text-2xl font-bold mb-4">赛道特点</h2>
                {/* 自定义内容 */}
                {track ? renderCustomContent(track) : null}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 相关赛事 */}
          <TabsContent value="competitions" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">相关赛事</h2>
                {trackCompetitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trackCompetitions.map((competition) => (
                      <div
                        key={competition.id}
                        className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                      >
                        <img
                          src={
                            competition.imageUrl ||
                            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
                          }
                          alt={competition.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="bg-[#1E88E5]/10 text-[#1E88E5] text-xs font-medium px-2.5 py-0.5 rounded">
                              {competition.status === "active"
                                ? "正在报名"
                                : "已结束"}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {competition.registrationDeadline
                                ? format(
                                    new Date(competition.registrationDeadline),
                                    "yyyy-MM-dd"
                                  )
                                : "未设置"}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {competition.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {competition.description}
                          </p>
                          <Link href={`/competition/${competition.id}`}>
                            <a className="text-[#1E88E5] hover:text-blue-700 font-medium text-sm">
                              查看详情
                            </a>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>暂无相关赛事</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 参赛要求 */}
          <TabsContent value="requirements" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">参赛要求</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">参赛对象</h3>
                    <p className="text-gray-700">
                      全日制普通高等院校在校学生，包括本科生、硕士研究生和博士研究生。参赛者可以跨院校组队，每支队伍人数不超过5人，须有1名指导教师。
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">项目要求</h3>
                    <p className="text-gray-700 mb-4">
                      参赛项目应具有创新性、可行性和商业价值，且符合国家法律法规。项目内容可涵盖但不限于以下方向：
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>人工智能与大数据应用</li>
                      <li>智能制造与工业互联网</li>
                      <li>生物医药与健康科技</li>
                      <li>新能源与环保技术</li>
                      <li>乡村振兴与社会创新</li>
                      <li>文化创意与数字内容</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">材料提交</h3>
                    <p className="text-gray-700">
                      参赛团队需在规定时间内提交项目计划书、团队介绍、指导教师信息等材料。进入复赛的团队还需提交项目展示PPT和项目演示视频。
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h3 className="text-lg font-semibold mb-1">特别说明</h3>
                    <p className="text-gray-700">
                      参赛项目必须是原创作品，不得侵犯他人知识产权。一经发现存在抄袭、剽窃等行为，将取消参赛资格并通报批评。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}