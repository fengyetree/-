export default function LatestNews() {
  const newsList = [
    { date: "2024-05-10", title: "全国大学生创新创业大赛决赛圆满落幕！", desc: "本届大赛吸引了来自全国数百所高校的优秀团队，创新项目精彩纷呈。" },
    { date: "2024-05-05", title: "赛事报名通道已关闭", desc: "感谢所有参赛团队的积极参与，预祝大家取得优异成绩。" },
    { date: "2024-04-28", title: "赛事官方发布最新赛道规则说明", desc: "请各参赛队伍及时查阅，确保参赛材料符合要求。" },
  ];
  return (
    <section className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">最新赛事动态</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-lg p-6 hover:scale-105 transition">
            <div className="text-sm text-blue-500 mb-2">{news.date}</div>
            <h3 className="text-lg font-bold mb-2 text-blue-800">{news.title}</h3>
            <p className="text-gray-700">{news.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 