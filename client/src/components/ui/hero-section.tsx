import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1000')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">2023全国大学生创新创业大赛</h1>
          <p className="text-xl text-white mb-8">汇聚青春智慧，点燃创新梦想</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/competition/1">
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
