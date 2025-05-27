import { Link } from "wouter";
import { Competition } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface FeaturedCompetitionsProps {
  competitions?: (
    Competition & { description: string | null; }
  )[];
}

export default function FeaturedCompetitions({ competitions: propCompetitions }: FeaturedCompetitionsProps) {
  // 从接口获取竞赛数据
  const { data: apiCompetitions, isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  // 使用传入的竞赛数据或从接口获取的数据
  const displayCompetitions = propCompetitions || apiCompetitions || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333]">正在报名的赛事</h2>
            <p className="text-gray-600 mt-2">把握机会，展现才华</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">正在报名的赛事</h2>
          <p className="text-gray-600 mt-2">把握机会，展现才华</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCompetitions.map((competition) => (
            <div key={competition.id} className="bg-[#F5F5F5] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#1E88E5]/10 text-[#1E88E5] text-xs font-medium px-2.5 py-0.5 rounded">
                    {competition.status === "active" ? "正在报名" : "已结束"}
                  </span>
                  <span className="text-xs text-gray-500">
                    截止日期: {competition.registrationDeadline ? 
                      format(new Date(competition.registrationDeadline), 'yyyy-MM-dd') : 
                      '未设置'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#333333]">{competition.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{competition.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-xs text-gray-500 mr-4">
                      <i className="fas fa-users mr-1"></i> {Math.floor(Math.random() * 400) + 100}支队伍
                    </div>
                    <div className="text-xs text-gray-500">
                      <i className="fas fa-university mr-1"></i> {Math.floor(Math.random() * 20) + 10}所高校
                    </div>
                  </div>
                  <Link href={`/competition/${competition.id}/map`}>
                    <a className="text-[#1E88E5] hover:text-blue-700 font-medium text-sm">
                      立即报名
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/">
            <Button className="bg-[#1E88E5] hover:bg-blue-700">
              查看更多赛事
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
