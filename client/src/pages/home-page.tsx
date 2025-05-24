import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/ui/hero-section";
import CompetitionTracks from "@/components/ui/competition-tracks";
import CompetitionSchedule from "@/components/ui/competition-schedule";
import FeaturedCompetitions from "@/components/ui/featured-competitions";
import PreviousCompetitions from "@/components/ui/previous-competitions";
import Universities from "@/components/ui/universities";
import SideNav from "@/components/ui/side-nav";
import { useQuery } from "@tanstack/react-query";
import { Competition, Track } from "@shared/schema";
import { Helmet } from "react-helmet";
import LatestNews from "@/components/ui/latest-news";

export default function HomePage() {
  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: tracks } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  const featuredCompetitions = competitions?.filter(comp => 
    new Date(comp.registrationDeadline?.toString() || '') > new Date()
  ) || [];

  const trackNames = [
    "创新创业赛道", "人工智能赛道", "乡村振兴赛道", "生物医药赛道",
    "金融科技赛道", "环境保护赛道", "智能制造赛道", "文化创意赛道"
  ];

  return (
    <>
      <Helmet>
        <title>全国高校大学生竞赛平台 - 汇聚青春智慧，点燃创新梦想</title>
        <meta name="description" content="全国高校大学生竞赛平台为全国大学生提供创新创业、人工智能等多元化赛道的竞赛报名和管理服务。立即参与，展示你的创新才华！" />
      </Helmet>
      <Navbar />
      <div className="relative">
        <main className="w-full">
          <section id="baoming"><HeroSection /></section>
          <section id="saidao"><CompetitionTracks tracks={tracks || []} /></section>
          <section id="xuanchuan"><CompetitionSchedule /></section>
          <section id="saicheng"><FeaturedCompetitions competitions={featuredCompetitions} /></section>
          <section id="dongtai"><LatestNews /></section>
          <section id="wangjie"><PreviousCompetitions /></section>
          <section id="jiangli"><Universities /></section>
        </main>
        <SideNav />
      </div>
      <div id="lianxi">
        <Footer />
      </div>
    </>
  );
}
