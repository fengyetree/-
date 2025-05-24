import { Link } from "wouter";
import { Competition } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface FeaturedCompetitionsProps {
  competitions: Competition[];
}

export default function FeaturedCompetitions({ competitions = [] }: FeaturedCompetitionsProps) {
  // Default competitions to display if none are provided
  const defaultCompetitions = [
    {
      id: 1,
      title: "2024年大学生数据要素素质大赛",
      description: "聚焦新时代创新创业，汇聚青年智慧，探索科技前沿，推动创业实践，打造全方位创新创业竞赛平台。",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      registrationDeadline: new Date("2023-10-15"),
      teamsCount: 528,
      schoolsCount: 32
    },
    {
      id: 2,
      title: "第十二届全国大学生数学建模竞赛",
      description: "通过数学建模与计算机模拟，解决实际问题，培养学生创新思维和实践能力，提升综合素质。",
      imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      registrationDeadline: new Date("2023-10-10"),
      teamsCount: 310,
      schoolsCount: 28
    },
    {
      id: 3,
      title: "2023互联网+创新创业大赛",
      description: "结合互联网技术与商业模式创新，促进创新成果转化，培育具有市场潜力的创新创业项目。",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      registrationDeadline: new Date("2023-10-20"),
      teamsCount: 285,
      schoolsCount: 25
    }
  ];

  // Use provided competitions if available, otherwise use default competitions
  const displayCompetitions = competitions.length > 0 
    ? competitions
    : defaultCompetitions;

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
              <img 
                src={competition.imageUrl || "https://obs-cq.cucloud.cn/zeno-videofile/files/20240603/0008a5be-2394-4b60-8a4b-86546e633a85.png"} 
                alt={competition.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#1E88E5]/10 text-[#1E88E5] text-xs font-medium px-2.5 py-0.5 rounded">正在报名</span>
                  <span className="text-xs text-gray-500">
                    截止日期: {competition.registrationDeadline ? 
                      format(new Date(competition.registrationDeadline), 'yyyy-MM-dd') : 
                      '未设置'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{competition.title}</h3>
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
                  <Link href={`/competition/${competition.id}/districts`}>
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
