import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">全国高校大学生竞赛平台</h3>
            <p className="text-gray-400 mb-4">致力于为大学生提供优质创新创业竞赛服务，打造全方位的竞赛报名与管理平台。</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-weixin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-weibo text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-qq text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                
                  <a href="/" className="text-gray-400 hover:text-white">首页</a>
                
              </li>
              <li>
                
                  <a href="/" className="text-gray-400 hover:text-white">赛事信息</a>
                
              </li>
              <li>
                
                  <a href="/" className="text-gray-400 hover:text-white">参赛指南</a>
                
              </li>
              <li>
                
                  <a href="/" className="text-gray-400 hover:text-white">新闻公告</a>
                
              </li>
              <li>
                
                  <a className="text-gray-400 hover:text-white">关于我们</a>
                
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">赛事类型</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">创新创业赛道</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">人工智能赛道</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">乡村振兴赛道</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">生物医学赛道</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">查看全部赛道</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-400"></i>
                <span className="text-gray-400">北京市海淀区中关村大街1号</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-gray-400"></i>
                <span className="text-gray-400">010-12345678</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-gray-400"></i>
                <span className="text-gray-400">contact@competition.edu.cn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()}  Copyright © 2025 重庆芝诺大数据有限公司 保留所有权利 | </p>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">渝ICP备16008902号-3</a>
          <a href="http://113.207.120.45:7010/wljyzbs/index.html?sfdm=120160407143433244197#/index.html?sfdm=120160407143433244197" target="_blank" rel="noopener noreferrer">工商网监 </a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010402000559" target="_blank" rel="noopener noreferrer">渝公网安备 50010402000559号</a>
        </div>
      </div>
    </footer>
  );
}
