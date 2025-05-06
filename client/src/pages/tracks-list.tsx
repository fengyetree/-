import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Track } from "@shared/schema";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TracksListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all tracks
  const { data: tracks, isLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  // Filter tracks based on search query
  const filteredTracks = tracks?.filter((track) =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Helmet>
        <title>赛道列表 - 全国高校大学生竞赛平台</title>
        <meta name="description" content="浏览所有可用的竞赛赛道信息" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-[#1E88E5] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/">
              <a className="text-white hover:text-blue-100">首页</a>
            </Link>
            <span className="mx-2">/</span>
            <span className="text-blue-100">赛道列表</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">竞赛赛道</h1>
          <p className="text-blue-100 max-w-3xl">
            探索多元化的竞赛赛道，找到适合您专业背景和兴趣方向的参赛类别
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索赛道..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-[#1E88E5]" />
          </div>
        ) : filteredTracks && filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <Card
                key={track.id}
                className="hover:shadow-md transition-all cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="w-14 h-14 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-4">
                      <i
                        className={`${track.icon} text-2xl text-[#1E88E5]`}
                      ></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {track.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        已有 {Math.floor(Math.random() * 200) + 50} 支队伍参赛
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {track.description}
                  </p>

                  <div className="flex justify-end">
                    <Link href={`/tracks/${track.id}`}>
                      <Button
                        variant="ghost"
                        className="text-[#1E88E5] hover:text-blue-700"
                      >
                        查看详情
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">未找到赛道</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `没有找到与"${searchQuery}"相关的赛道`
                : "当前没有可用的赛道信息"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mx-auto"
              >
                清除搜索
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}