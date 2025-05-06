import { Link } from "wouter";
import { Track } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface CompetitionTracksProps {
  tracks: Track[];
}

export default function CompetitionTracks({ tracks = [] }: CompetitionTracksProps) {
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
      name: "生物医学赛道",
      description: "聚焦生物医学科技创新，提升健康医疗水平的项目",
      icon: "fas fa-flask",
      count: 72
    }
  ];

  // Use provided tracks if available, otherwise use default tracks
  const displayTracks = tracks.length > 0 
    ? tracks.map(track => ({
        ...track,
        count: Math.floor(Math.random() * 150) + 50 // Just for display purposes
      }))
    : defaultTracks;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">竞赛赛道</h2>
          <p className="text-gray-600 mt-2">多元化赛道，满足不同专业背景学生需求</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTracks.map((track) => (
            <div key={track.id} className="bg-[#F5F5F5] rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mb-4">
                <i className={`${track.icon} text-2xl text-[#1E88E5]`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{track.name}</h3>
              <p className="text-gray-600 mb-4">{track.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#1E88E5] font-medium">已报名: {track.count}支队伍</span>
                <Link href="/">
                  <a className="text-[#1E88E5] hover:text-blue-700 font-medium text-sm">
                    了解更多 <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/">
            <Button variant="outline" className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white">
              查看全部赛道
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
