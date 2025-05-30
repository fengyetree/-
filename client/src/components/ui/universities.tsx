import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function Universities() {
  // Try to get unique universities from users
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const [universities, setUniversities] = useState<string[]>([]);

  useEffect(() => {
    if (users && users.length > 0) {
      // Get unique universities from users
      const uniqueUniversities = Array.from(
        new Set(
          users
            .filter(user => user.university && user.university.trim() !== '')
            .map(user => user.university as string)
        )
      ).slice(0, 11); // Get first 11 universities
      
      if (uniqueUniversities.length > 0) {
        setUniversities(uniqueUniversities);
      } else {
        // Default universities if none found in users
        setUniversities([
          "清华大学", "北京大学", "复旦大学", "浙江大学", 
          "上海交通大学", "南京大学", "武汉大学", "中国人民大学", 
          "哈尔滨工业大学", "四川大学", "西安交通大学"
        ]);
      }
    }
  }, [users]);

  // Default universities if none available
  const defaultUniversities = [
    { shortName: "清大", fullName: "清华大学" },
    { shortName: "北大", fullName: "北京大学" },
    { shortName: "复旦", fullName: "复旦大学" },
    { shortName: "浙大", fullName: "浙江大学" },
    { shortName: "交大", fullName: "上海交通大学" },
    { shortName: "南大", fullName: "南京大学" },
    { shortName: "武大", fullName: "武汉大学" },
    { shortName: "人大", fullName: "中国人民大学" },
    { shortName: "哈工", fullName: "哈尔滨工业大学" },
    { shortName: "川大", fullName: "四川大学" },
    { shortName: "西交", fullName: "西安交通大学" },
    { shortName: "更多", fullName: "查看全部" }
  ];

  const displayUniversities = universities.length > 0
    ? universities.map(uni => {
        // Get shortName from the first characters of each word
        const shortName = uni
          .split(/\s+/)
          .map(word => word.charAt(0))
          .join('')
          .slice(0, 2);
        return { shortName, fullName: uni };
      })
    : defaultUniversities;

  // Add "More" button if we have actual universities
  if (universities.length > 0 && !displayUniversities.find(u => u.shortName === "更多")) {
    displayUniversities.push({ shortName: "更多", fullName: "查看全部" });
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">参赛院校</h2>
          <p className="text-gray-600 mt-2">汇聚全国优秀高校力量</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayUniversities.map((university, index) => (
            <Link key={index} href={university.shortName === "更多" ? "/universities" : "/"}>
              <a className="bg-[#F5F5F5] rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-center">
                <div>
                  <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-[#1E88E5] font-bold">{university.shortName}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{university.fullName}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
