/**
 * 应用程序主入口组件
 * 负责配置全局状态管理和路由系统
 */

import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

// 导入页面组件
import HomePage from "@/pages/home-page";                    // 首页
import CompetitionPage from "@/pages/competition-page";      // 竞赛详情页
import RegisterCompetition from "@/pages/register-competition"; // 竞赛报名页
import TracksList from "@/pages/tracks-list";               // 赛道列表页
import TrackDetails from "@/pages/track-details";           // 赛道详情页
import CaseDetails from "@/pages/case-details";             // 案例详情页
import CompetitionMapPage from "@/pages/competition-map-page"; // 竞赛地图页
import AllUniversitiesPage from "@/pages/all-universities-page"; // 所有大学列表页
import CompetitionDistrictsPage from "@/pages/competition-districts-page"; // 竞赛赛区页
import DistrictRegistrationPage from "@/pages/district-registration-page"; // 赛区报名页
import NotFound from "@/pages/not-found";                   // 404页面
import NewsDetailPage from "@/pages/news-detail-page";      // 新闻详情页



/**
 * App组件
 * 配置全局状态管理和路由系统
 * 使用 QueryClientProvider 提供数据获取功能
 * 使用 AuthProvider 提供认证状态管理
 * 使用 wouter 进行路由管理
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            {/* 公共路由 */}
            <Route path="/" component={HomePage} />
            <Route path="/competition/:id" component={CompetitionPage} />
            <Route path="/register-competition/:id" component={RegisterCompetition} />
            <Route path="/tracks" component={TracksList} />
            <Route path="/track/:id" component={TrackDetails} />
            <Route path="/case/:id" component={CaseDetails} />
            <Route path="/competition/:id/map" component={CompetitionMapPage} />
            <Route path="/universities" component={AllUniversitiesPage} />
            <Route path="/competition/:id/districts" component={CompetitionDistrictsPage} />
            <Route path="/competition/:id/districts/:districtName" component={CompetitionDistrictsPage} />
            <Route path="/competition/:id/districts/:districtName/register" component={DistrictRegistrationPage} />
            <Route path="/district-registration/:district" component={DistrictRegistrationPage} />
            <Route path="/news/:newsId" component={NewsDetailPage} />
            
            
            
            {/* 404路由 - 捕获所有未匹配的路由 */}
            <Route component={NotFound} />
          </Switch>
          {/* 全局消息提示组件 */}
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
