import { Link } from "wouter";

export default function CompetitionSchedule() {
  const scheduleStages = [
    {
      id: 1,
      stage: "报名阶段",
      title: "项目报名与审核",
      date: "9月1日 - 10月15日",
      description: "开放所有赛道报名通道，提交项目计划书进行资格审核"
    },
    {
      id: 2,
      stage: "初赛阶段",
      title: "初赛评审与筛选",
      date: "10月20日 - 11月5日",
      description: "各赛道专家评审团对项目进行初步评估，选拔优秀项目进入复赛"
    },
    {
      id: 3,
      stage: "复赛阶段",
      title: "项目展示与答辩",
      date: "11月15日 - 12月5日",
      description: "复赛团队进行线上项目展示与答辩，展现项目价值与可行性"
    },
    {
      id: 4,
      stage: "决赛阶段",
      title: "全国总决赛",
      date: "12月20日 - 12月22日",
      description: "优秀团队齐聚北京，进行现场路演与展示，角逐全国总冠军"
    }
  ];

  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">赛事赛程</h2>
          <p className="text-gray-600 mt-2">全周期赛事安排，助力选手逐步成长</p>
        </div>
        
        <div className="relative">
          {/* Timeline */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#1E88E5]/20 transform -translate-x-1/2"></div>
          
          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-0">
            {scheduleStages.map((stage, index) => (
              <div key={stage.id} className="md:grid md:grid-cols-2 md:gap-8 relative">
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right md:pr-12 mb-8 md:mb-24">
                      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all inline-block">
                        <span className="inline-block bg-[#1E88E5]/10 text-[#1E88E5] text-sm font-medium px-3 py-1 rounded-full mb-2">
                          {stage.stage}
                        </span>
                        <h3 className="text-xl font-semibold mb-1">{stage.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{stage.date}</p>
                        <p className="text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:block"></div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block"></div>
                    <div className="md:pl-12 mb-8 md:mb-24">
                      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all inline-block">
                        <span className="inline-block bg-[#1E88E5]/10 text-[#1E88E5] text-sm font-medium px-3 py-1 rounded-full mb-2">
                          {stage.stage}
                        </span>
                        <h3 className="text-xl font-semibold mb-1">{stage.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{stage.date}</p>
                        <p className="text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                  </>
                )}
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 top-6 w-6 h-6 rounded-full bg-[#1E88E5] transform -translate-x-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 分赛区节点时间表 */}
      <div className="container mx-auto px-4 mt-12">
        <h3 className="text-2xl font-bold mb-4 text-[#1E88E5]">分赛区节点时间表</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-xl text-center border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900">
                <th className="py-3 px-4">赛区</th>
                <th className="py-3 px-4">报名时间</th>
                <th className="py-3 px-4">初赛时间</th>
                <th className="py-3 px-4">复赛时间</th>
                <th className="py-3 px-4">决赛时间</th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-blue-50 hover:bg-blue-100 transition">
                <td className="py-3 px-4 font-semibold text-blue-700">华北赛区</td>
                <td className="py-3 px-4">2023-09-01 ~ 09-20</td>
                <td className="py-3 px-4">2023-10-10 ~ 10-15</td>
                <td className="py-3 px-4">2023-11-01 ~ 11-05</td>
                <td className="py-3 px-4">2023-12-10</td>
              </tr>
              <tr className="even:bg-blue-50 hover:bg-blue-100 transition">
                <td className="py-3 px-4 font-semibold text-blue-700">华东赛区</td>
                <td className="py-3 px-4">2023-09-05 ~ 09-25</td>
                <td className="py-3 px-4">2023-10-12 ~ 10-18</td>
                <td className="py-3 px-4">2023-11-03 ~ 11-08</td>
                <td className="py-3 px-4">2023-12-12</td>
              </tr>
              <tr className="even:bg-blue-50 hover:bg-blue-100 transition">
                <td className="py-3 px-4 font-semibold text-blue-700">西南赛区</td>
                <td className="py-3 px-4">2023-09-10 ~ 09-28</td>
                <td className="py-3 px-4">2023-10-15 ~ 10-20</td>
                <td className="py-3 px-4">2023-11-06 ~ 11-12</td>
                <td className="py-3 px-4">2023-12-15</td>
              </tr>
              <tr className="even:bg-blue-50 hover:bg-blue-100 transition">
                <td className="py-3 px-4 font-semibold text-blue-700">东北赛区</td>
                <td className="py-3 px-4">2023-09-12 ~ 09-30</td>
                <td className="py-3 px-4">2023-10-18 ~ 10-22</td>
                <td className="py-3 px-4">2023-11-10 ~ 11-15</td>
                <td className="py-3 px-4">2023-12-18</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
