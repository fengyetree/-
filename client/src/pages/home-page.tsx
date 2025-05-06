import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/ui/hero-section";
import CompetitionTracks from "@/components/ui/competition-tracks";
import CompetitionSchedule from "@/components/ui/competition-schedule";
import FeaturedCompetitions from "@/components/ui/featured-competitions";
import PreviousCompetitions from "@/components/ui/previous-competitions";
import Universities from "@/components/ui/universities";
import { useQuery } from "@tanstack/react-query";
import { Competition, Track } from "@shared/schema";
import { Helmet } from "react-helmet";

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

  return (
    <>
      <Helmet>
        <title>全国高校大学生竞赛平台 - 汇聚青春智慧，点燃创新梦想</title>
        <meta name="description" content="全国高校大学生竞赛平台为全国大学生提供创新创业、人工智能等多元化赛道的竞赛报名和管理服务。立即参与，展示你的创新才华！" />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <CompetitionTracks tracks={tracks || []} />
        <CompetitionSchedule />
        <FeaturedCompetitions competitions={featuredCompetitions} />
        <PreviousCompetitions />
        <Universities />
      </main>
      <Footer />
    </>
  );
}
