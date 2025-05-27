import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { User } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AllUniversitiesPage() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const [universities, setUniversities] = useState<string[]>([]);

  useEffect(() => {
    if (users) {
      // Get unique universities from users
      const uniqueUniversities = Array.from(
        new Set(
          users
            .filter(user => user.university && user.university.trim() !== '')
            .map(user => user.university as string)
        )
      ).sort(); // Sort universities alphabetically
      
      setUniversities(uniqueUniversities);
    }
  }, [users]);

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

          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && universities.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <ul className="list-disc list-inside space-y-2">
                {universities.map((uni, index) => (
                  <li key={index} className="text-gray-800">{uni}</li>
                ))}
              </ul>
            </div>
          )}

          {!isLoading && universities.length === 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md text-center text-gray-600">
              暂无参赛院校信息。
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
} 