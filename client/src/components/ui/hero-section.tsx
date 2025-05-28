import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://obs-cq.cucloud.cn/zeno-videofile/files/20240603/0008a5be-2394-4b60-8a4b-86546e633a85.png')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">2025年（第二届）大学生数据要素素质大赛</h1>
          <p className="text-xl text-white mb-8">汇聚青春智慧，点燃创新梦想</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/competition/1/map">
              <Button size="lg" className="bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all">
                立即报名
              </Button>
            </Link>
            <Link href="/competition/1">
              <Button size="lg" className="bg-[#FFC107] hover:bg-yellow-600 text-white font-medium py-3 px-8 rounded-md transition-all">
                赛事详情
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex justify-center space-x-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">32</div>
              <div className="text-sm">参赛院校</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">528</div>
              <div className="text-sm">参赛团队</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm">赛道项目</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">￥50万</div>
              <div className="text-sm">总奖金</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
