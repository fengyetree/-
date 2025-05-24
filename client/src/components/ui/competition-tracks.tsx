import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export interface CompetitionTracksProps {
  tracks?: Array<{
    id: number;
    name: string;
    description: string;
    icon: string;
    count?: number;
  }>;
}

const defaultTracks = [
  {
    id: 1,
    name: "创新创业赛道",
    description: "针对具有市场潜力和商业价值的创新项目和创业计划",
    icon: "fas fa-lightbulb",
    count: 135
  },
  {
    id: 2,
    name: "人工智能赛道",
    description: "专注于人工智能技术在各领域的创新应用和解决方案",
    icon: "fas fa-laptop-code",
    count: 97
  },
  {
    id: 3,
    name: "乡村振兴赛道",
    description: "围绕乡村振兴战略，提出创新方案和实践项目",
    icon: "fas fa-leaf",
    count: 84
  },
  {
    id: 4,
    name: "生物医药赛道",
    description: "聚焦生物医学科技创新，提升健康医疗水平的项目",
    icon: "fas fa-flask",
    count: 72
  },
  {
    id: 5,
    name: "金融科技赛道",
    description: "金融科技创新与应用，推动金融行业数字化转型",
    icon: "fas fa-coins",
    count: 68
  },
  {
    id: 6,
    name: "环境保护赛道",
    description: "关注生态环境保护与可持续发展创新项目",
    icon: "fas fa-leaf",
    count: 59
  },
  {
    id: 7,
    name: "智能制造赛道",
    description: "智能制造与工业互联网领域的创新与实践",
    icon: "fas fa-robot",
    count: 61
  },
  {
    id: 8,
    name: "文化创意赛道",
    description: "文化创意、数字内容与新媒体创新项目",
    icon: "fas fa-palette",
    count: 54
  }
];

export default function CompetitionTracks({ tracks = [] }: CompetitionTracksProps) {
  // 强制前端始终展示12个默认赛道
  const displayTracks = defaultTracks;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">竞赛赛道</h2>
          <p className="text-gray-600 mt-2">多元化赛道，满足不同专业背景学生需求</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTracks.map((track) => (
            <div key={track.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mb-4">
                <i className={`${track.icon} text-2xl text-[#1E88E5]`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{track.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{track.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#1E88E5] font-medium">已报名: {track.count}支队伍</span>
                <Link href={`/tracks/${track.id}`}>
                  <a className="text-[#1E88E5] hover:text-blue-700 font-medium text-sm">
                    了解更多 <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/tracks">
            <Button variant="outline" className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white">
              查看全部赛道
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
