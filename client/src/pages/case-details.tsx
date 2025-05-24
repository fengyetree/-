import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { caseStudies } from "@/data/case-studies";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function CaseDetails() {
  const { id } = useParams();
  const caseData = caseStudies.find(c => c.id === Number(id));

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">未找到相关案例</h1>
            <p className="mt-4 text-gray-600">请返回首页查看其他案例</p>
          </div>
        </div>
      </div>
    );
  }

  // 针对第一个案例，展示更详细内容
  if (caseData.id === 1) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Helmet>
          <title>{caseData.title} - 优秀案例详情</title>
        </Helmet>
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-blue-600">首页</a>
              <span>/</span>
              <a href="/#previous-competitions" className="hover:text-blue-600">往届优秀案例</a>
              <span>/</span>
              <span className="text-gray-900">{caseData.title}</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">🌟 优秀案例展示</h1>
            <h2 className="text-2xl font-semibold mb-2">{caseData.title}</h2>
            <div className="mb-4 text-gray-600">参赛团队：梅有导师也队 | 学校：新疆大学 | 专业/领域：数据科学、数学</div>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-2">一、项目简介：以数据为基，构建智能服务</h3>
              <p>本项目聚焦于政务采购领域的数据要素重构与应用，致力于实现招投标信息的结构化提取、系统集成与AI增强问答服务。通过数据链条的构建，打通横向条目与纵向要素，实现数据的高效流转与智能利用。</p>
            </section>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-2">二、项目核心结构与技术亮点</h3>
              <ul className="list-disc pl-6 mb-2">
                <li>数据采集：自动化爬取政务公开招投标公告。</li>
                <li>数据清洗与结构化：多级字段抽取，统一格式。</li>
                <li>数据存储：MySQL 8.1，支持高并发与复杂查询。</li>
                <li>智能问答：基于RAG（Retrieval-Augmented Generation）模型，结合LangChain与OpenAI Embeddings，实现自然语言检索与智能应答。</li>
              </ul>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                <img src="https://img.zenodt.com/2024-case1-1.png" alt="结构图" className="rounded-lg border" />
                <img src="https://img.zenodt.com/2024-case1-2.png" alt="统计图" className="rounded-lg border" />
              </div>
              <div className="mb-2">统计分析：如公开招标占比61.4%，99.82%项目实现双盲评审。</div>
            </section>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-2">三、系统方案与技术栈</h3>
              <div className="mb-2">技术栈：Python 3.9、MySQL 8.1、OpenAI Embeddings、Chroma、LangChain、Flask、ChatGPT接口。</div>
              <div className="bg-gray-100 rounded p-4 overflow-x-auto mb-2">
                <pre className="text-sm"><code>{`
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

embeddings = OpenAIEmbeddings()
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
llm = OpenAI()
qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=db.as_retriever())
result = qa({"query": "公开招标占比多少？"})
print(result)
`}</code></pre>
              </div>
            </section>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-2">四、亮点解析与多维价值</h3>
              <ul className="list-disc pl-6">
                <li>数据打通能力：实现招投标全流程数据闭环。</li>
                <li>智能问答：RAG模型结合行业知识，提升问答准确率。</li>
                <li>统计洞察：自动生成行业趋势分析报告。</li>
                <li>迁移适应性：支持高算力与低算力双模式。</li>
              </ul>
            </section>
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-2">五、细致解读与结论</h3>
              <p>原文分析+策略启发，结合AI与结构化数据，助力政务采购智能化升级。</p>
            </section>
            <section>
              <h3 className="text-xl font-bold mb-2">六、总结推荐语</h3>
              <p>本项目以数据驱动创新，兼顾技术深度与实际应用，具备良好的推广价值和社会效益。</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Helmet>
        <title>{caseData.title} - 优秀案例详情</title>
      </Helmet>

      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">首页</a>
            <span>/</span>
            <a href="/#previous-competitions" className="hover:text-blue-600">往届优秀案例</a>
            <span>/</span>
            <span className="text-gray-900">{caseData.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 项目基本信息 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-[#FFC107]/10 text-[#FFC107] text-sm font-medium px-3 py-1 rounded-full">
                {caseData.year}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">{caseData.title}</h1>
            <p className="text-gray-600 text-lg">{caseData.description}</p>
          </CardContent>
        </Card>

        {/* 项目亮点 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">项目亮点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseData.achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-check text-[#1E88E5] text-sm"></i>
                    </span>
                    <p className="text-gray-600">{achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 项目图片 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">项目展示</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseData.images.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`项目展示 ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 团队信息 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">团队信息</h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">{caseData.team.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseData.team.members.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-[#1E88E5] font-bold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                      <p className="text-gray-500 text-sm mt-1">{member.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 获奖信息 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">获奖信息</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{caseData.award}</h3>
                  <p className="text-gray-600 mt-2">
                    获奖时间：{format(new Date(caseData.date), 'yyyy年MM月dd日', { locale: zhCN })}
                  </p>
                </div>
                <div className="text-[#FFC107] text-4xl">
                  <i className="fas fa-trophy"></i>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 