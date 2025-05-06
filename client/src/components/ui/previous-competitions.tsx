import { Link } from "wouter";

export default function PreviousCompetitions() {
  const previousProjects = [
    {
      id: 1,
      year: "2022年度",
      title: "智慧农业物联网解决方案",
      description: "来自清华大学的团队，将物联网技术应用于农业生产，提高农作物产量20%以上，获得金奖。"
    },
    {
      id: 2,
      year: "2021年度",
      title: "基于AR技术的远程医疗辅助系统",
      description: "北京大学与哈尔滨工业大学联合团队开发，解决偏远地区医疗资源不足问题，获得特等奖。"
    },
    {
      id: 3,
      year: "2020年度",
      title: "环保可降解包装材料创新应用",
      description: "浙江大学化学工程团队研发的新型环保包装材料，已成功商业化，年产值超过3000万。"
    },
    {
      id: 4,
      year: "2019年度",
      title: "智能残障辅助设备",
      description: "上海交通大学机械工程团队设计的低成本智能假肢，大幅提升使用体验，获得社会效益奖。"
    }
  ];

  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">往届比赛回顾</h2>
          <p className="text-gray-600 mt-2">精彩瞬间，永恒回忆</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg overflow-hidden shadow-md h-full">
              <img 
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450" 
                alt="2022年度优秀项目展示" 
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">2022年度优秀项目展示</h3>
                <p className="text-gray-600 mb-4">回顾去年比赛中脱颖而出的创新项目，包括获奖作品及团队介绍。</p>
                <Link href="/">
                  <a className="text-[#1E88E5] hover:text-blue-700 font-medium inline-flex items-center">
                    查看详情 <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <h3 className="text-xl font-bold mb-4">历届获奖项目</h3>
              
              {previousProjects.map((project) => (
                <div key={project.id} className="mb-6 last:mb-0">
                  <div className="flex items-center mb-3">
                    <div className="bg-[#FFC107]/10 text-[#FFC107] text-sm font-medium px-3 py-1 rounded-full mr-3">
                      {project.year}
                    </div>
                    <h4 className="text-lg font-semibold">{project.title}</h4>
                  </div>
                  <p className="text-gray-600 ml-16">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
