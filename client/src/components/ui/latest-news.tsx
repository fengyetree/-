export default function LatestNews() {
  const newsList = [
    { date: "2025-05-28", title: '【数据赋能 乘数而上】2025年"数据要素×"大赛山东分赛济南市选拔赛火...', desc: "" },
    { date: "2025-05-28", title: '济南市大数据局、中共济南市委网络安全和信息化委员会办公室等19部门...', desc: "" },
    { date: "2025-05-27", title: '关于组织参加 2025 "数据要素×"大赛山东分赛的通知', desc: "" },
  ];
  return (
    <section className="bg-white rounded-lg shadow px-6 py-10 mb-8 ">
      <h2 className="text-2xl font-bold mb-6">最新赛事动态</h2>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column for Image/Carousel */}
        <div className="md:w-1/2 h-auto py-2">
          <img
            src="https://obs-cq.cucloud.cn/zeno-videofile/files/20240603/0008a5be-2394-4b60-8a4b-86546e633a85.png"
            alt="赛事动态配图"
            className="w-full h-full rounded-lg object-cover"
          />
        </div>

        {/* Right Column for News List */}
        <div className="md:w-1/2 flex flex-col justify-between h-full">
          {newsList.map((news, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-lg pt-2 px-6 pb-6 hover:scale-105 transition flex-grow h-[110px]">
              <div className="text-sm text-blue-500 mb-2 ">{news.date}</div>
              <h3 className="text-lg font-bold mb-2 text-blue-800 whitespace-nowrap overflow-hidden text-ellipsis">{news.title}</h3>
              <p className="text-gray-700">{news.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 