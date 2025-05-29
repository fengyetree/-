
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

// 静态赛程阶段数据
const scheduleStages = [
  {
    id: 1,
    stage: "报名阶段",
    title: "参赛报名",
    description: "开放所有赛道报名通道，提交项目计划书进行资格审核"
  },
  {
    id: 2,
    stage: "分赛区赛题公布时期",
    title: "公布分赛区赛题",
    description: "各赛道专家评审团对项目进行初步评估，选拔优秀项目进入复赛"
  },
  {
    id: 3,
    stage: "提交作品阶段",
    title: "作品提交",
    description: "复赛团队进行线上项目展示与答辩，展现项目价值与可行性"
  },
  {
    id: 4,
    stage: "分赛区评审结果公布时间",
    title: "公布分赛区评审结果",
    description: "优秀团队齐聚北京，进行现场路演与展示，角逐全国总冠军"
  }
  ,
  {
    id: 5,
    stage: "全国赛网评结果公布时间",
    title: "公布全国赛网评结果",
    description: "优秀团队齐聚北京，进行现场路演与展示，角逐全国总冠军"
  }
  ,
  {
    id: 6,
    stage: "全国赛现场答辩赛时间",
    title: "全国赛现场答辩",
    description: "优秀团队齐聚北京，进行现场路演与展示，角逐全国总冠军"
  }
];

// 静态分赛区数据
const districts = [
  {
    name: "华北赛区",
    region: "north"
  },
  {
    name: "华东赛区",
    region: "east"
  },
  {
    name: "西南赛区",
    region: "southwest"
  },
  {
    name: "东北赛区",
    region: "northeast"
  }
];

// 时间数据接口类型
interface ScheduleTimeline {
  stages: Array<{
    stageId: number;
    dateRange: string;
  }>;
  districts: Array<{
    region: string;
    registrationDates: string;
    preliminaryDates: string;
    finalDate: string;
  }>;
}

export default function CompetitionSchedule() {
  // 获取时间数据的API接口
  const { data: timeline, isLoading } = useQuery<ScheduleTimeline>({
    queryKey: ['/api/competition-timeline'],
    queryFn: async () => {
      // 这里可以替换为实际的API调用
      // const response = await fetch('/api/competition-timeline');
      // return response.json();
      
      // 暂时返回模拟数据，等API准备好后可以替换
      return {
        stages: [
          { stageId: 1, dateRange: "6月1日 - 6月30日" },
          { stageId: 2, dateRange: "6月1日 - 7月10日" },
          { stageId: 3, dateRange: "9月14日24时前" },
          { stageId: 4, dateRange: "2025年9月30日" },
          { stageId: 5, dateRange: "2025年10月26日" },
          { stageId: 6, dateRange: "2025年11月22日-23日" }
        ],
        districts: [
          { region: "north", registrationDates: "2023-09-01 ~ 09-20", preliminaryDates: "2023-10-10 ~ 10-15", finalDate: "2023-12-10" },
          { region: "east", registrationDates: "2023-09-05 ~ 09-25", preliminaryDates: "2023-10-12 ~ 10-18", finalDate: "2023-12-12" },
          { region: "southwest", registrationDates: "2023-09-10 ~ 09-28", preliminaryDates: "2023-10-15 ~ 10-20", finalDate: "2023-12-15" },
          { region: "northeast", registrationDates: "2023-09-12 ~ 09-30", preliminaryDates: "2023-10-18 ~ 10-22", finalDate: "2023-12-18" }
        ]
      };
    }
  });

  // 获取指定阶段的时间范围
  const getStageDate = (stageId: number) => {
    if (!timeline) return "待定";
    const stage = timeline.stages.find(s => s.stageId === stageId);
    return stage ? stage.dateRange : "待定";
  };

  // 获取指定赛区的时间信息
  const getDistrictTimes = (region: string) => {
    if (!timeline) return { registrationDates: "待定", preliminaryDates: "待定", finalDate: "待定" };
    const district = timeline.districts.find(d => d.region === region);
    return district ? district : { registrationDates: "待定", preliminaryDates: "待定", finalDate: "待定" };
  };

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
                        <p className="text-gray-500 text-sm mb-2">
                          {isLoading ? "加载中..." : getStageDate(stage.id)}
                        </p>
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
                        <p className="text-gray-500 text-sm mb-2">
                          {isLoading ? "加载中..." : getStageDate(stage.id)}
                        </p>
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
              {districts.map((district, index) => {
                const times = getDistrictTimes(district.region);
                return (
                  <tr key={district.region} className="even:bg-blue-50 hover:bg-blue-100 transition">
                    <td className="py-3 px-4 font-semibold text-blue-700">{district.name}</td>
                    <td className="py-3 px-4">
                      {isLoading ? "加载中..." : times.registrationDates}
                    </td>
                    <td className="py-3 px-4">
                      {isLoading ? "加载中..." : times.preliminaryDates}
                    </td>
                    <td className="py-3 px-4">
                      {isLoading ? "加载中..." : times.preliminaryDates}
                    </td>
                    <td className="py-3 px-4">
                      {isLoading ? "加载中..." : times.finalDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
