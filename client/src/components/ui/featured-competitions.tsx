import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
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
      <section className="py-24 bg-white">
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">正在报名的赛事</h2>
          <p className="text-gray-600 mt-2">把握机会，展现才华</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCompetitions.map((competition) => (
            <Link href={`/competition/${competition.id}`} key={competition.id}>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full">
                {competition.imageUrl && (
                  <div className="relative w-full h-48">
                    <img
                      src={competition.imageUrl}
                      alt={competition.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {competition.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {competition.description}
                  </p>
                  <div className="mt-auto">
                     <p className="text-sm text-gray-500">
                       报名截止日期:{" "}
                       {competition.registrationDeadline
                         ? format(
                             new Date(competition.registrationDeadline),
                             "yyyy年MM月dd日 HH:mm"
                           )
                         : "待定"}
                     </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
