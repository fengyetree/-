export interface CaseStudy {
  id: number;
  year: string;
  title: string;
  description: string;
  team: {
    name: string;
    members: Array<{
      name: string;
      role: string;
      school: string;
    }>;
  };
  achievements: string[];
  images: string[];
  date: string;
  award: string;
  details: string;
  customLink?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    customLink: "https://wj.zenodt.com/s/QPCwP5jQ",
    year: "2024年度",
    title: "基于招投标结构化数据的统计研究与RAG检索增强系统开发",
    description: "本项目围绕'数据要素在政务采购领域的重构与应用'，通过构建完整的数据处理链条，实现了对政府招投标信息的结构化提取、系统集成与AI增强问答服务开发。作品以实际政务公开数据为基础，以结构设计为核心，以智能问答为落点，呈现出从数据原料到智能服务产品的完整转化路径。",
    team: {
      name: "梅有导师也队",
      members: [
        { name: "梅有导师也队", role: "队员", school: "新疆大学" },
      ]
    },
    achievements: [
      "数据打通能力 —— 从横向条目到纵向要素链：项目不仅爬取数据，更解决了'五类公告分散、信息孤立'的问题，构建出'一个招投标项目从招标到合同履行的完整闭环链'。",
      "应用导向明确 —— 从结构化数据到智能问答：作品设计的RAG智能问答系统，赋予数据实际交互价值，使得用户能自然语言提问、系统准确回应。",
      "数据洞察深度 —— 结构性分析产出行业趋势：如'公开招标占比61.4%' '99.82%项目实现双盲评审'等分析，不仅展示结果，也回应了制度目标，体现了政策理解力。",
      "成本与性能并重 —— 提供双方案设计：分别针对高算力用户与资源受限场景，设计了RAG增强方案与正则匹配替代方案，具有良好的迁移适应性。"
    ],
    images: [
      "https://img.zenodt.com/2024-case1-1.png",
      "https://img.zenodt.com/2024-case1-2.png"
    ],
    date: "2024-05-01",
    award: "全国大学生创新创业大赛一等奖",
    details: `
🌟 优秀案例展示

《基于招投标结构化数据的统计研究与RAG检索增强系统开发》

【参赛团队】：梅有导师也队
【学校】：新疆大学
【专业/领域】：数据科学、数学

一、项目简介：以数据为基，构建智能服务
本项目聚焦于政务采购领域的数据要素重构与应用，致力于实现招投标信息的结构化提取、系统集成与AI增强问答服务。通过数据链条的构建，打通横向条目与纵向要素，实现数据的高效流转与智能利用。

二、项目核心结构与技术亮点
1. 全流程结构化数据链
- 数据采集：自动化爬取政务公开招投标公告。
- 数据清洗与结构化：多级字段抽取，统一格式。
- 数据存储：MySQL 8.1，支持高并发与复杂查询。
- 智能问答：基于RAG（Retrieval-Augmented Generation）模型，结合LangChain与OpenAI Embeddings，实现自然语言检索与智能应答。

2. 数据类型与统计分析
- 数据类型：涵盖招标公告、资格预审、开标记录、合同签订等多类信息。
- 统计分析：如公开招标占比61.4%，99.82%项目实现双盲评审。
- 图表展示：
  ![结构图](https://img.zenodt.com/2024-case1-1.png)
  ![统计图](https://img.zenodt.com/2024-case1-2.png)

3. 系统方案
- 技术栈：Python 3.9、MySQL 8.1、OpenAI Embeddings、Chroma、LangChain、Flask、ChatGPT接口。
- 代码示例：
~~~python
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
~~~

三、亮点解析与多维价值
- 数据打通能力：实现招投标全流程数据闭环。
- 智能问答：RAG模型结合行业知识，提升问答准确率。
- 统计洞察：自动生成行业趋势分析报告。
- 迁移适应性：支持高算力与低算力双模式。

四、细致解读与结论
- 原文分析+策略启发，结合AI与结构化数据，助力政务采购智能化升级。

五、总结推荐语
本项目以数据驱动创新，兼顾技术深度与实际应用，具备良好的推广价值和社会效益。`
  },
  {
    id: 2,
    customLink: "https://wj.zenodt.com/s/kyl3yssp",
    year: "2021年度",
    title: "基于Python神经网络模型的数据分析系统设计与实现",
    description: "本项目围绕数据分析与预测，利用Python神经网络模型，构建了高效的数据分析系统，实现了数据的自动化处理与智能预测。系统涵盖数据采集、预处理、建模、分析与可视化等核心功能，广泛应用于金融、医疗等领域。",
    team: {
      name: "数据智能团队",
      members: [
        { name: "李明", role: "队长", school: "复旦大学" },
        { name: "王强", role: "算法工程师", school: "复旦大学" },
        { name: "赵敏", role: "数据分析师", school: "复旦大学" },
      ]
    },
    achievements: [
      "系统集成：数据采集、预处理、建模、分析与可视化一体化。",
      "技术亮点：基于TensorFlow与PyTorch的深度学习模型，支持多任务并行。",
      "应用价值：提升数据分析效率，支持多行业智能决策。"
    ],
    images: [
      "https://img.zenodt.com/2021-case2-1.png",
      "https://img.zenodt.com/2021-case2-2.png"
    ],
    date: "2021-12-20",
    award: "特等奖",
    details: `
🌟 优秀案例展示

《基于Python神经网络模型的数据分析系统设计与实现》

【参赛团队】：数据智能团队
【学校】：复旦大学
【专业/领域】：人工智能、数据科学

一、项目简介：构建型的数据预测服务系统
本项目以Python为核心，集成神经网络模型，实现了数据的自动化采集、预处理、建模、预测与可视化。系统支持多种数据源，适配金融、医疗等多行业场景。

二、系统结构与核心功能亮点
| 功能模块 | 技术实现 | 核心优势 |
|---|---|---|
| 数据采集 | Python爬虫/接口 | 自动化、实时性强 |
| 数据预处理 | Pandas/NumPy | 高效清洗、特征工程 |
| 建模分析 | TensorFlow/PyTorch | 支持深度学习与传统模型 |
| 可视化 | Matplotlib/Plotly | 多维度交互式展示 |

三、亮点解析与多维价值
- 高度集成：一站式数据分析平台，提升团队协作与效率。
- 智能预测：神经网络模型提升预测准确率。
- 可扩展性：支持插件式功能拓展。

四、细节拆解与分析
- 数据清洗：自动缺失值填补、异常检测。
- 特征工程：自动特征选择与降维。
- 模型训练：支持多模型对比与自动调参。

五、总结推荐语
本项目以智能化、自动化为核心，极大提升了数据分析的效率与准确性，适合大数据场景下的行业应用。`
  },
  {
    id: 3,
    customLink: "https://wj.zenodt.com/s/lQ7TYRKe",
    year: "2020年度",
    title: "基于RF-SHTU识别的智能超市购物结算系统的研究",
    description: "本项目聚焦于智能零售，基于RFID与SHTU识别技术，开发了智能超市购物结算系统，实现了商品自动识别、结算与防损。系统集成了智能货架、结算终端、移动支付等模块，提升了购物体验与运营效率。",
    team: {
      name: "智能零售创新团队",
      members: [
        { name: "陈伟", role: "队长", school: "上海交通大学" },
        { name: "孙丽", role: "系统架构师", school: "上海交通大学" },
        { name: "周杰", role: "硬件工程师", school: "上海交通大学" },
      ]
    },
    achievements: [
      "创新应用：RFID与SHTU结合，实现商品自动识别与结算。",
      "系统集成：智能货架、结算终端、移动支付一体化。",
      "用户体验：提升购物便捷性与防损能力。"
    ],
    images: [
      "https://img.zenodt.com/2020-case3-1.png",
      "https://img.zenodt.com/2020-case3-2.png"
    ],
    date: "2020-12-10",
    award: "金奖",
    details: `
🌟 优秀案例展示

《基于RF-SHTU识别的智能超市购物结算系统的研究》

【参赛团队】：智能零售创新团队
【学校】：上海交通大学
【专业/领域】：物联网、人工智能

一、项目背景与目标
项目聚焦于智能零售场景，利用RFID与SHTU识别技术，实现商品的自动识别、结算与防损，提升超市运营效率与用户体验。

二、项目功能与亮点
- 智能货架：自动感知商品状态，实时监控库存。
- 结算终端：支持多种支付方式，自动识别商品信息。
- 防损系统：结合摄像头与传感器，提升安全性。
- 移动应用：顾客可自助扫码、结算与查询。

三、系统架构
- 前端：移动App、结算终端界面。
- 后端：商品数据库、识别算法、支付接口。
- 硬件：RFID标签、SHTU传感器、摄像头。

四、创新点与应用价值
- 技术融合：RFID与SHTU协同，提升识别准确率。
- 场景适配：适用于无人零售、便利店等多种业态。
- 数据分析：实时采集销售与库存数据，辅助运营决策。

五、总结推荐语
本项目以智能识别与系统集成为核心，推动了零售行业的数字化升级，具有广泛的推广前景。`
  },
  {
    id: 4,
    customLink: "https://wj.zenodt.com/s/pPiltu4L",
    year: "2019年度",
    title: "基于LSTM深度学习的垃圾分类预测分析与决策支持",
    description: "本项目以城市垃圾分类为切入点，基于LSTM深度学习模型，开发了垃圾分类预测与决策支持系统，实现了垃圾投放行为的智能分析与分类优化。系统支持多维数据输入，具备高准确率与良好可扩展性。",
    team: {
      name: "智慧城市团队",
      members: [
        { name: "林涛", role: "队长", school: "浙江大学" },
        { name: "张敏", role: "算法工程师", school: "浙江大学" },
        { name: "李娜", role: "数据工程师", school: "浙江大学" },
      ]
    },
    achievements: [
      "算法创新：基于LSTM的垃圾分类预测模型，提升分类准确率。",
      "系统设计：支持多维数据输入与可视化分析。",
      "社会价值：助力城市垃圾分类管理与政策优化。"
    ],
    images: [
      "https://img.zenodt.com/2019-case4-1.png",
      "https://img.zenodt.com/2019-case4-2.png"
    ],
    date: "2019-12-15",
    award: "社会效益奖",
    details: `
🌟 优秀案例展示

《基于LSTM深度学习的垃圾分类预测分析与决策支持》

【参赛团队】：智慧城市团队
【学校】：浙江大学
【专业/领域】：数据科学、城市管理

一、项目简介与目标
本项目以城市垃圾分类为切入点，利用LSTM深度学习模型，实现垃圾分类的智能预测与决策支持，提升城市管理效率。

二、系统结构与技术方案
- 数据采集：多源数据输入，包括垃圾投放记录、用户行为等。
- 模型训练：基于LSTM的时序预测模型，提升分类准确率。
- 可视化分析：多维度数据展示与趋势分析。

三、项目亮点与应用价值
- 算法创新：LSTM模型适应复杂时序数据。
- 管理优化：辅助政策制定与资源配置。
- 社会效益：推动绿色城市建设。

四、结论与展望
本项目以AI赋能城市管理，推动垃圾分类智能化，具有良好的社会效益和推广价值。`
  }
]; 