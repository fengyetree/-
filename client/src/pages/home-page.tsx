import Footer from "@/components/layout/footer";
import HeroSection from "@/components/ui/hero-section";
import CompetitionTracks from "@/components/ui/competition-tracks";
import CompetitionSchedule from "@/components/ui/competition-schedule";
import FeaturedCompetitions from "@/components/ui/featured-competitions";
import PreviousCompetitions from "@/components/ui/previous-competitions";
import Universities from "@/components/ui/universities";
import SideNav from "@/components/ui/side-nav";
import LatestNews from "@/components/ui/latest-news";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { competitionService, trackService } from "@/lib/services";
import { Competition, Track } from "@shared/schema";

export default function HomePage() {
  const { data: competitions, isLoading: competitionsLoading } = useQuery({
    queryKey: ["competitions"],
    queryFn: competitionService.getAllCompetitions,
  });

  const { data: tracks, isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: trackService.getAllTracks,
  });

  const featuredCompetitions = competitions/*?.filter(comp => 
    new Date(comp.registrationDeadline?.toString() || '') > new Date()
  )*/ || [];

  const trackNames = [
    "创新创业赛道", "人工智能赛道", "乡村振兴赛道", "生物医药赛道",
    "金融科技赛道", "环境保护赛道", "智能制造赛道", "文化创意赛道"
  ];

  return (
    <>
      <Helmet>
        <title>全国高校大学生竞赛平台</title>
        <meta name="description" content="全国高校大学生竞赛平台是大学生展示创新能力、参与学术交流、实现自我价值的重要舞台。" />
      </Helmet>
      {/* <Navbar /> */}
      
      <main className="bg-[#F5F5F5] min-h-screen">
          <section id="baoming"><HeroSection /></section>
        <section id="saidao"><CompetitionTracks tracks={tracks?.map(track => ({ ...track, description: track.description || '', icon: track.icon || '' })) || []} /></section>
          <section id="xuanchuan"><CompetitionSchedule /></section>
        <section id="saicheng" className="py-16 bg-white">
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10 text-white">
            <FeaturedCompetitions competitions={featuredCompetitions} />
          </div>
        </section>
          <section id="dongtai"><LatestNews /></section>
          <section id="wangjie"><PreviousCompetitions /></section>
          <section id="jiangli"><Universities /></section>
        </main>
        <SideNav />
      <div id="lianxi">
        <Footer />
      </div>
    </>
  );
}