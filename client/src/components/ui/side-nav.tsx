import { useState, useEffect } from "react";

const navItems = [
  { id: "baoming", label: "赛事详情" },
  { id: "saidao", label: "竞赛赛道" },
  { id: "xuanchuan", label: "赛事赛程" },
  { id: "saicheng", label: "赛事报名" },
  { id: "wangjie", label: "往届案例" },
  { id: "jiangli", label: "参赛院校" },
];

export default function SideNav() {
  const [active, setActive] = useState(navItems[0].id);

  useEffect(() => {
    const handleScroll = () => {
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section && window.scrollY + 100 >= section.offsetTop) {
          setActive(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="flex flex-col items-center rounded-3xl py-4 px-1 shadow-xl w-28 fixed top-1/2 -translate-y-1/2 right-6 z-50 border-2 border-white/20 backdrop-blur-sm"
      style={{
        background: "linear-gradient(to bottom, rgba(96, 165, 250, 0.9) 0%, rgba(56, 189, 248, 0.9) 100%)"
      }}
    >
      {/* 顶部图标 */}
      <div className="mb-3">
        <img src="/icon.png" alt="icon" className="w-10 h-10 drop-shadow" />
      </div>
      {navItems.map((item, idx) => (
        <div key={item.id} className="w-full">
          <button
            className={`w-full text-center px-2 py-2 my-0.5 rounded-2xl transition-all duration-200 text-sm
              ${active === item.id
                ? "bg-white/20 text-white font-bold shadow-md scale-105"
                : "text-white hover:bg-white/10"}
            `}
            onClick={() => handleClick(item.id)}
          >
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
} 