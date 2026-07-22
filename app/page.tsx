type Experience = {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
};

const experience: Experience[] = [
  {
    company: "北京看云控股有限公司（兼职）",
    role: "动画设计",
    period: "2026.06 - 至今",
    summary: "主导中小学教材 AI 动画化项目，从脚本、分镜到剪辑合成建立可交付的多学科动画课件流程。",
    highlights: ["人教、沪教版儿童英语 AI 动画", "单人日产动画片段 2 条"],
  },
  {
    company: "福建泽联数字服务有限公司（兼职）",
    role: "导演 / 编导",
    period: "2026.01 - 至今",
    summary: "从 0 到 1 搭建 AI 培训与动画生产管线，并为对外合作提供创意和技术可行性支持。",
    highlights: ["《我爱科学》AI 动画化", "金融消保、反诈及文旅宣传动画"],
  },
  {
    company: "杭州蔻艺文化发展有限公司",
    role: "动画设计",
    period: "2025.01 - 至今",
    summary: "负责 AI 动画制作、剧本优化和分镜设计，以自建智能体协同编剧、提示词与视觉资产生产。",
    highlights: ["《撕掉婚纱后》", "《重生十八岁我拿下了进修名额》", "《垫付两万八，我拒了亿级大单》"],
  },
  {
    company: "福建安世九鑫数字科技有限公司",
    role: "设计经理 / 主管",
    period: "2023.05 - 2026.07",
    summary: "负责核心研发设计业务与团队建设，推进新产品上线并提升企业设计技术和创新能力。",
    highlights: ["推进 10 余款产品上线", "从零搭建 3D 打印设计部门"],
  },
  {
    company: "南京蒙正智库空间技术有限公司",
    role: "设计咨询工程师",
    period: "2022.03 - 2023.04",
    summary: "统筹设计咨询、市场调研、产品系列构建与落地辅导，服务大型地产企业战略规划。",
    highlights: ["完成 2022 至 2025 设计任务战略规划", "优化设计管理流程"],
  },
  {
    company: "厦门亚上设计机构",
    role: "设计经理",
    period: "2020.05 - 2022.03",
    summary: "带领团队完成设计项目全流程管控，包括进度、质量、成本、风险和新员工培训。",
    highlights: ["项目验收交付与合同回款", "制定并开展岗位培训"],
  },
  {
    company: "杭州百安居建筑科技有限公司",
    role: "研发建筑设计师",
    period: "2018.07 - 2020.02",
    summary: "负责客户需求、设计方案与施工图深化，并承担设计师岗位技能培训。",
    highlights: ["方案、效果图与 CAD 图纸", "高品质设计理念落地"],
  },
  {
    company: "东京德丰建筑工程株式会社",
    role: "CAD 设计 / 制图",
    period: "2015.03 - 2017.03",
    summary: "配合主案设计师完成方案深化、图纸和文本制作，确保资料完整、规范且按期交付。",
    highlights: ["前期方案图纸深化", "图纸与资料管理"],
  },
];

const projects = [
  ["金属及树脂 3D 打印配件研发", "机构工程师 · 2023.07 - 2024.01", "完成 6 款金属部件轻量化与 10 余款橡胶整体产品结构优化。"],
  ["杭州新天地三期设计规划", "主案设计师 · 2020.10 - 2023.02", "负责提案、图纸、施工交接与设计管理，重要节点均提前完成。"],
  ["萧山蓝爵国际改造", "主案设计师 · 2018.03 - 2019.08", "负责工程前期对接、提案、图纸制作与施工指导。"],
  ["杭州萧山博地中心 Linkwe 共创空间", "主案设计师 · 2018.01 - 2019.01", "负责项目提案、图纸跟进、工程交接及施工指导。"],
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="页面导航">
        <a className="wordmark" href="#top">秦川 <span>/ QC</span></a>
        <div className="nav-links">
          <a href="#about">优势</a><a href="#experience">经历</a><a href="#projects">项目</a><a href="#contact">联系</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <p className="eyebrow">AI CREATIVE PRODUCTION · 2026</p>
        <div className="hero-title">
          <h1>秦<br />川</h1>
          <div className="hero-role"><span>AI 动画导演</span><span>/ 制片人</span></div>
        </div>
        <div className="hero-meta">
          <p>北京<br />11年工作经验</p>
          <p>以导演的镜头判断和制片人的管线意识，把 AI 创意稳定地交付为成片。</p>
          <a href="#contact">开始合作 <span aria-hidden="true">↘</span></a>
        </div>
      </header>

      <section id="about" className="section about" aria-labelledby="about-title">
        <p className="section-index">01 / 个人优势</p>
        <div>
          <h2 id="about-title">让 AI 的速度，<br /><em>拥有设计的骨架。</em></h2>
          <p className="lead">具备跨界设计与研发背景，熟练使用 Vibecoding（基于 Codex）搭建多智能体矩阵。从剧本孵化、分镜调度、资产生成到后期合成，建立独立闭环；同时以 Rhino、Grasshopper、CAD 与物理分析基础校正画面逻辑与空间美学。</p>
          <div className="capabilities"><span>剧本与分镜</span><span>AI 资产生成</span><span>提示词管线</span><span>成片制片管理</span></div>
        </div>
      </section>

      <section id="experience" className="section experience" aria-labelledby="experience-title">
        <div className="experience-heading"><p className="section-index">02 / 工作经历</p><h2 id="experience-title">从构思到<br />规模化生产。</h2></div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-card" key={`${item.company}-${item.role}`}>
              <div className="experience-label"><p>{item.period}</p><p>{item.role}</p></div>
              <div><h3>{item.company}</h3><p>{item.summary}</p><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section projects" aria-labelledby="projects-title">
        <p className="section-index">03 / 项目与资历</p>
        <div><h2 id="projects-title">设计，是可被<br /><em>验证的系统。</em></h2><div className="project-grid">{projects.map(([title, meta, detail]) => <article key={title}><p>{meta}</p><h3>{title}</h3><p>{detail}</p></article>)}</div></div>
        <aside className="credentials"><p>教育</p><p>千叶工业大学 · 硕士 · 工业设计 · 2014 - 2016</p><p>沈阳理工大学 · 本科 · 工业设计 · 2009 - 2013</p><p>全国 CAD 技能一级证书 · 日语 N2</p></aside>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-title">
        <p className="section-index">04 / 联系</p>
        <div className="contact-grid"><h2 id="contact-title">下一段故事，<br />从这里开始。</h2><div><a href="mailto:408217203@qq.com">408217203@qq.com</a><a href="tel:17326096652">17326096652</a><p>北京 · 可远程协作</p></div></div>
      </section>
    </main>
  );
}
