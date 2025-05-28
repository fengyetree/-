import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { User, universities as defaultUniversities } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AllUniversitiesPage() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // 使用默认大学列表
  const universities = defaultUniversities;

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

  return (
    <>
      <Helmet>
        <title>全部参赛院校 - 全国高校大学生竞赛平台</title>
        <meta name="description" content="查看所有参加全国高校大学生竞赛平台的院校列表。" />
      </Helmet>
      <Navbar />

      <main className="bg-[#F5F5F5] min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-6 shadow-md mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
              全部参赛院校
            </h1>
            <Link href="/">
              <a className="text-[#1E88E5] hover:text-blue-700 font-medium inline-flex items-center">
                <span className="mr-1">&larr;</span> 返回主页
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#1E88E5] font-bold text-lg">
                        {university.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{university}</h3>
                      <p className="text-sm text-gray-500">
                        {users?.filter(user => user.university === university).length || 0} 名参赛者
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 