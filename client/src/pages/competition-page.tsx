/**
 * 竞赛详情页面组件
 * 展示竞赛的详细信息，包括竞赛介绍、报名信息、主办方等
 */

import { useQuery } from "@tanstack/react-query";  // 用于数据获取的React Query
import { Link, useRoute, useLocation } from "wouter";  // 路由相关hooks
import Navbar from "@/components/layout/navbar";  // 导航栏组件
import Footer from "@/components/layout/footer";  // 页脚组件
import { Button } from "@/components/ui/button";  // 按钮组件
import { Card, CardContent } from "@/components/ui/card";  // 卡片组件
import { Competition, Track } from "@shared/schema";  // 类型定义
import { useAuth } from "@/hooks/use-auth";  // 认证相关hook
import { Loader2, Calendar, Users, Award, School, Clock } from "lucide-react";  // 图标组件
import { format } from "date-fns";  // 日期格式化工具
import { Helmet } from "react-helmet";  // 页面头部管理
import axios from "axios"; // 导入 axios 用于发起HTTP请求

export default function CompetitionPage() {
  // 获取路由参数中的竞赛ID
  const [, params] = useRoute("/competition/race/:id"); // 使用 wouter 的 useRoute hook 获取路径参数
  const [, navigate] = useLocation(); // 使用 wouter 的 useLocation hook 获取导航功能
  const { user } = useAuth();  // 获取当前用户信息，用于判断是否已登录和检查报名状态
  const competitionId = params?.id; // 从params中提取竞赛ID

  // 使用 React Query 获取竞赛详情数据
  const { data: competition, isLoading: isCompetitionLoading } = useQuery<Competition>({
    queryKey: ["competition", competitionId], // 查询的唯一键，当competitionId改变时会重新获取数据
    queryFn: async () => { // 实际获取数据的函数
      // 使用 axios 发起GET请求到后端API获取竞赛详情
      const response = await axios.get(`http://127.0.0.1:8088/competition/race/${competitionId}`);
      return response.data; // 返回响应中的数据部分
    },
    enabled: !!competitionId, // 只有当competitionId存在时才启用查询
  });

  // 使用 React Query 获取赛道信息
  // 注意：这里的queryKey依赖于competition数据，所以会在获取到competition后再执行
  const { data: track } = useQuery<Track>({
    queryKey: [`/tracks/${competition?.trackId}`], // 查询键包含赛道ID
    queryFn: async () => { // 获取赛道数据的函数
      // 使用 axios 发起GET请求获取赛道详情
      const response = await axios.get(`http://127.0.0.1:8088/tracks/${competition?.trackId}`);
      return response.data; // 返回赛道数据
    },
    enabled: !!competition?.trackId, // 只有当competition数据存在且trackId存在时才启用查询
  });

  // 使用 React Query 检查用户是否已报名特定竞赛
  const { data: isRegistered } = useQuery<boolean>({
    queryKey: [`/api/registrations/check/${competitionId}`], // 查询键包含竞赛ID
    queryFn: async () => { // 检查报名状态的函数
      // 使用 axios 发起GET请求检查报名状态
      const response = await axios.get(`http://127.0.0.1:8088/registrations/check/${competitionId}`);
      return response.data; // 返回报名状态 (true/false)
    },
    enabled: !!competitionId && !!user, // 只有当competitionId和user都存在时才启用查询
  });

  // 处理报名截止日期，将其转换为Date对象
  const registrationDeadline = competition?.registrationDeadline 
    ? new Date(competition.registrationDeadline)
    : null;

  // 检查报名是否开放 (截止日期晚于当前时间)
  const isRegistrationOpen = registrationDeadline && registrationDeadline > new Date();

  // === 渲染部分 ===

  // 加载状态显示：如果在加载竞赛数据，显示加载动画
  if (isCompetitionLoading) {
    return (
      <>
        {/* 导航栏 (注释掉了) */}
        {/* <Navbar /> */}
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer /> {/* 页脚 */}
      </>
    );
  }

  // 竞赛不存在时显示：如果获取不到竞赛数据，显示"赛事不存在"信息
  if (!competition) {
    return (
      <>
        {/* 导航栏 (注释掉了) */}
        {/* <Navbar /> */}
        <div className="container mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">赛事不存在</h1>
            <p className="mb-6">抱歉，您查询的赛事不存在或已被删除。</p>
            <Link href="/"> {/* 返回首页的链接 */}
              <a className="inline-block bg-primary text-white px-4 py-2 rounded-md">
                返回首页
              </a>
            </Link>
          </div>
        </div>
        <Footer /> {/* 页脚 */}
      </>
    );
  }

  // 正常显示竞赛详情页面
  return (
    <>
      {/* 导航栏 (注释掉了) */}
      {/* <Navbar /> */}
      {/* Helmet 用于管理页面头部信息，如标题和meta标签 */}
      <Helmet>
        <title>{competition.title} - 赛事详情 - 全国高校大学生竞赛平台</title>
        <meta name="description" content={competition.description || `查看 ${competition.title} 的详细信息。`} />
      </Helmet>

      <main className="bg-[#F5F5F5] min-h-screen"> {/* 主内容区域，设置背景色和最小高度 */}
        {/* 顶部横幅区域 */}
        <div 
          className="w-full h-64 bg-cover bg-center relative" // 设置宽度、高度、背景图片覆盖、居中，相对定位
          style={{ 
            backgroundImage: `url(${competition.imageUrl || 'https://obs-cq.cucloud.cn/zeno-videofile/files/20240603/0008a5be-2394-4b60-8a4b-86546e633a85.png'})` // 根据竞赛数据设置背景图片，没有则使用默认图片
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center relative z-10"> {/* 容器，自动居中，padding，高度充满，flex布局，z-index */}
            <div className="text-white"> {/* 文字颜色白色 */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{competition.title}</h1> {/* 竞赛标题 */}
            </div>
          </div>
        </div>

        {/* 竞赛详情内容区域 */}
        <div className="container mx-auto px-4 py-12"> {/* 容器，自动居中，padding */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* 网格布局，小屏幕1列，大屏幕3列，设置间距 */}
            {/* 主要内容区域 - 竞赛详情和规则 */}
            <div className="lg:col-span-2"> {/* 大屏幕占两列 */}
              <Card> {/* 卡片组件 */}
                <CardContent className="p-6"> {/* 卡片内容，设置padding */}
                  <h2 className="text-2xl font-bold mb-6">赛事详情</h2> {/* 详情标题 */}
                  <div className="prose max-w-none"> {/* 使用prose类，设置最大宽度 */}
                    <p className="text-gray-700 mb-6">{competition.description}</p> {/* 竞赛描述 */}

                    {/* 赛事亮点部分 */}
                    <h3 className="text-xl font-semibold mb-4">赛事亮点</h3> {/* 亮点标题 */}
                    <ul className="space-y-2 mb-6"> {/* 亮点列表，设置垂直间距 */}
                      {/* 示例亮点条目 */}
                      <li className="flex items-start"> {/* flex布局，顶部对齐 */}
                        <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3"> {/* 图标背景和样式 */}
                          <i className="fas fa-check text-[#1E88E5] text-sm"></i> {/* 图标 */}
                        </span>
                        <span>培养创新思维和实践能力，提升综合素质</span> {/* 亮点文本 */}
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-check text-[#1E88E5] text-sm"></i>
                        </span>
                        <span>对接优质企业资源，获得实习和就业机会</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                          <i className="fas fa-check text-[#1E88E5] text-sm"></i>
                        </span>
                        <span>优秀项目有机会获得风险投资和创业扶持</span>
                      </li>
                    </ul>

                    {/* 参赛规则部分 */}
                    <h3 className="text-xl font-semibold mb-4">参赛规则</h3> {/* 规则标题 */}
                    <p>1. 参赛对象：全国高校在校学生，可跨校组队</p> {/* 规则条目 */}
                    <p>2. 团队规模：每队人数3-5人，需设一名队长</p>
                    <p>3. 指导教师：每队可有1-2名指导教师</p>
                    <p>4. 作品要求：参赛作品必须为原创，且不得侵犯他人知识产权</p>
                    <p>5. 评审标准：创新性(30%)、实用性(25%)、完整性(20%)、展示表现(15%)、团队协作(10%)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 - 报名信息和主办方信息 */}
            <div> {/* 侧边栏区域 */}
              {/* 报名信息卡片 */}
              <Card className="mb-6"> {/* 卡片组件，设置底部外边距 */}
                <CardContent className="p-6"> {/* 卡片内容 */}
                  <h3 className="text-lg font-semibold mb-4">报名信息</h3> {/* 报名信息标题 */}

                  {/* 报名详情列表 */}
                  <div className="space-y-4 mb-6"> {/* 列表容器，设置垂直间距 */}
                    {/* 报名截止日期 */}
                    <div className="flex items-center"> {/* flex布局，垂直居中 */}
                      <Calendar className="h-5 w-5 text-[#1E88E5] mr-3" /> {/* 图标 */}
                      <div>
                        <p className="text-sm text-gray-500">报名截止日期</p> {/* 标签 */}
                        <p className="font-medium">
                          {/* 格式化显示报名截止日期，如果没有则显示"待定" */}
                          {registrationDeadline ? format(registrationDeadline, 'yyyy年MM月dd日') : '待定'}
                        </p>
                      </div>
                    </div>

                    {/* 参赛团队数量 */}
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">参赛团队</p>
                        {/* 这里显示的是静态数据，将来可能需要从后端获取 */}
                        <p className="font-medium">已有165支队伍报名</p>
                      </div>
                    </div>

                    {/* 参赛院校数量 */}
                    <div className="flex items-center">
                      <School className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">参赛院校</p>
                        {/* 这里显示的是静态数据，将来可能需要从后端获取 */}
                        <p className="font-medium">来自28所高校</p>
                      </div>
                    </div>

                    {/* 奖项设置 */}
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">奖项设置</p>
                        {/* 这里显示的是静态数据，将来可能需要从后端获取 */}
                        <p className="font-medium">金奖(3名)、银奖(5名)、铜奖(10名)</p>
                      </div>
                    </div>

                    {/* 竞赛周期 */}
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#1E88E5] mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">竞赛周期</p>
                        <p className="font-medium">
                          {/* 格式化显示竞赛开始和结束日期，如果没有则显示"待定" */}
                          {competition.startDate && competition.endDate ? 
                            `${format(new Date(competition.startDate), 'yyyy年MM月dd日')} - ${format(new Date(competition.endDate), 'yyyy年MM月dd日')}` : 
                            '待定'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 报名按钮区域 */}
                  {/* 根据报名状态和报名是否开放显示不同的按钮 */}
                  {isRegistered ? ( // 如果已报名，显示"已报名"按钮 (禁用状态)
                    <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                      已报名
                    </Button>
                  ) : isRegistrationOpen ? ( // 如果未报名且报名开放，显示"立即报名"按钮
                    <Link href={`/competition/${competitionId}/map`} key={competitionId}> {/* 导航到赛区地图页面，传递竞赛ID */}
                      <Button className="w-full bg-[#1E88E5] hover:bg-blue-700"> {/* 设置按钮样式 */}
                        立即报名
                      </Button>
                    </Link>
                  ) : ( // 如果报名已截止，显示"报名已截止"按钮 (禁用状态)
                    <Button className="w-full" disabled>
                      报名已截止
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* 主办方信息卡片 */}
              <Card> {/* 卡片组件 */}
                <CardContent className="p-6"> {/* 卡片内容 */}
                  <h3 className="text-lg font-semibold mb-4">主办单位</h3> {/* 主办单位标题 */}
                  <div className="space-y-3"> {/* 列表容器，设置垂直间距 */}
                    {/* 主办方 */}
                    <div className="flex items-center"> {/* flex布局，垂直居中 */}
                      <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3"> {/* 图标背景和样式 */}
                        <span className="text-[#1E88E5] font-bold text-sm">主办</span> {/* 标签 */}
                      </div>
                      {/* 这里显示的是静态数据，将来可能需要从后端获取 */}
                      <span>中国高等教育学会</span> 
                    </div>

                    {/* 承办方 */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1E88E5] font-bold text-sm">承办</span>
                      </div>
                      {/* 这里显示的是静态数据，将来可能需要从后端获取 */}
                      <span>全国高校创新创业教育联盟</span>
                    </div>

                    {/* 协办方 */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1E88E5] font-bold text-sm">协办</span>
                      </div>
                      {/* 这里显示的是静态数据，将来可能需要从后端获取 */}
                      <span>中国科学院科技创新发展中心</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer /> {/* 页脚 */}
    </>
  );
}