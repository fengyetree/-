import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

// TODO: 定义新闻数据类型
interface NewsItem {
  id: number;
  date: string; // 或者 Date 类型，取决于后端返回格式
  title: string;
  content: string;
}

export default function NewsDetailPage() {
  const [, params] = useRoute("/news/:newsId");
  const [, navigate] = useLocation();
  const newsId = params?.newsId;

  // TODO: 根据 newsId 从后端获取新闻详情
  // 假设有一个 API endpoint /api/news/:newsId 返回单条新闻详情
  const { data: newsItem, isLoading } = useQuery<NewsItem>({
    queryKey: ["news", newsId],
    queryFn: async () => {
      // 模拟 API 调用，实际需要替换为真实的 fetch 或服务调用
      console.log(`Fetching news item with ID: ${newsId}`);
      // Placeholder data - replace with actual API call
      return {
        id: parseInt(newsId || '0'), // 使用 newsId
        date: "2025-05-28", // 示例日期
        title: "【数据赋能 乘数而上】2025年\"数据要素×\"大赛山东分赛济南市选拔赛火热启动！", // 示例标题
        content: "这里是赛事动态的详细内容。具体内容需要从后端获取。", // 示例内容
      };
    },
    enabled: !!newsId, // 只有当 newsId 存在时才执行查询
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!newsItem) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">动态不存在</h1>
            <p className="mb-6">抱歉，您查询的赛事动态不存在或已被删除。</p>
            <Button onClick={() => navigate("/")}>
                返回首页
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formattedDate = format(new Date(newsItem.date), 'yyyy年MM月dd日');

  return (
    <>
      <Helmet>
        <title>{newsItem.title} - 赛事动态 - 全国高校大学生竞赛平台</title>
        <meta name="description" content={newsItem.title} />
      </Helmet>
      {/* <Navbar /> */}

      <main className="bg-[#F5F5F5] min-h-screen py-12">
        <div className="container mx-auto px-4">
            <Button
                variant="ghost"
                onClick={() => navigate(`/`)} // 或者返回到新闻列表页 if exists
                className="mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
            </Button>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
              {newsItem.title}
            </h1>
            <p className="text-gray-600 text-sm mb-4">发布日期: {formattedDate}</p>
            <div className="prose max-w-none">
              <p>{newsItem.content}</p>
              {/* TODO: Render full news content, potentially including HTML/Markdown */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 