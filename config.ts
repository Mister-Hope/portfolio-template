
import { Config } from './types';

export const configs: Record<string, Config> = {
  en: {
    name: "SHANG CHENG",
    welcome: "👋 Hi there, I am",
    titles: ["Theoretical Physics Researcher", "World Explorer", "Quantum Complexity Enthusiast"],
    avatar: "https://picsum.photos/seed/shang/600/800",
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920",
    medias: [
      { icon: "fa-solid fa-at", name: "RIKEN Email", link: "mailto:cheng.shang@riken.jp" },
      { icon: "fa-brands fa-google", name: "Gmail", link: "mailto:shangc1204@gmail.com" },
      { icon: "fa-brands fa-orcid", name: "ORCID", link: "https://orcid.org/0000-0001-8393-2329" },
      { icon: "fa-solid fa-graduation-cap", name: "Scholar", link: "https://scholar.google.com/citations?user=-k8PWr8AAAAJ" },
      { icon: "fa-solid fa-flask-vial", name: "iNSPIRE", link: "https://inspirehep.net/authors/2662928" },
      { icon: "fa-brands fa-x-twitter", name: "X", link: "https://x.com/Shangc1204" }
    ],
    navbar: {
      links: [
        { label: "Profile", anchor: "#profile" },
        { label: "Experience", anchor: "#education" },
        { label: "News", anchor: "#news" },
        { label: "Publications", anchor: "#publications" },
        { label: "Gallery", anchor: "#gallery" }
      ]
    },
    footer: "Built with ❤️ using React, TypeScript & Tailwind CSS. © 2024 Shang Cheng.",
    contents: [
      {
        type: "profile",
        id: "profile",
        title: "Profile",
        icon: "fa-user-tie",
        data: {
          affiliation: "Analytical Quantum Complexity RIKEN Hakubi Research Team",
          contact: [
            { label: "RIKEN Email", value: "cheng.shang@riken.jp" },
            { label: "Gmail", value: "shangc1204@gmail.com" },
            { label: "UTokyo Email", value: "c-shang@iis.u-tokyo.ac.jp" }
          ],
          interests: ["B-boying (Breaking)", "Gomoku", "Music", "Running"]
        }
      },
      {
        type: "experience",
        id: "education",
        title: "Education & Career",
        icon: "fa-graduation-cap",
        data: [
          { type: 'work', place: "Analytical Quantum Complexity RIKEN Hakubi Research Team", time: "Oct. 2024 - Present", title: "Postdoctoral Researcher", content: "with Dr. Tomotaka Kuwahara" },
          { type: 'work', place: "Analytical Quantum Complexity RIKEN Hakubi Research Team", time: "Apr. 2023 - Sep. 2024", title: "Junior Research Associate", content: "with Dr. Tomotaka Kuwahara" },
          { type: 'study', place: "The University of Tokyo, Japan", time: "Oct. 2021 - Sep. 2024", title: "Ph.D.", content: "with Prof. Naomichi Hatano", description: "Department of Physics" },
          { type: 'study', place: "Students to Japan, China", time: "Oct. 2020 - Aug. 2021", content: "Preparatory School for Chinese MEXT Doctoral Scholarship Candidate" },
          { type: 'study', place: "Northeast Normal University, China", time: "Sep. 2017 - June 2020", title: "Master of Science", content: "with Prof. XueXi Yi", description: "School of Physics" }
        ]
      },
      {
        type: "banner",
        id: "call-for-papers",
        title: "Call for Papers",
        icon: "fa-bullhorn",
        subtitle: "Exception Points in non-Hermitian Systems",
        data: {
          content: "**Special Collection: Discover Physics (Springer Nature)**. Submission Deadline: 21 April, 2026.",
          deadline: "21 April, 2026",
          actions: [{ label: "Submit & Learn More", link: "https://link.springer.com/collections/djheehghia", primary: true }]
        }
      },
      {
        type: "timeline",
        id: "news",
        title: "News",
        icon: "fa-newspaper",
        data: [
          { year: "2025", content: "Our work on '[Topological Quantum Batteries](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401)' was featured in **PRL Trending**.", link: "https://x.com/PhysRevLett/status/1924474721149542443" },
          { year: "2025", content: "Highlight in press releases by RIKEN and selected for RIKEN Research.", link: "https://www.riken.jp/en/news_pubs/research_news/pr/2025/20250513_2/index.html" },
          { year: "2024", content: "Joined Kuwahara team as a Postdoc on Oct 1st." },
          { year: "2024", content: "Presented posters at QIP2024, TQC2024, and Quantum Innovation 2024." },
          { year: "2024", content: "Received Ph.D. from the University of Tokyo." }
        ]
      },
      {
        type: "list",
        id: "awards",
        title: "Honors & Awards",
        icon: "fa-award",
        config: { listStyle: "check" },
        data: [
          { text: "2024 Invited Talk, 21st PHHQP-XXI Workshop, Greece." },
          { text: "2023 Best Poster Award, QPQIS-2023, Beijing." },
          { text: "2021 Japanese Government (MEXT) Doctoral Scholarship." },
          { text: "2019 Chinese National Scholarship for Postgraduates." }
        ]
      },
      {
        type: "cards",
        id: "theses",
        title: "Theses",
        icon: "fa-book-open",
        data: [
          { title: "Doctoral Dissertation", subtitle: "Suppression of Decoherence in Open Quantum Systems: Resonance and Topological Effects", link: "http://hatano-lab.iis.u-tokyo.ac.jp/thesis/dron2024/thesis_shang.pdf" },
          { title: "Master's Thesis", subtitle: "Nonreciprocal Transmission Based on Modulated Optomechanical Systems", link: "https://service.cnki.net/KCMS/detail/detail.aspx" }
        ]
      },
      {
        type: "list",
        id: "publications",
        title: "Publications",
        icon: "fa-scroll",
        config: { listType: "ol" },
        data: [
          { text: "Zhi-Guang Lu et al., *Topological Quantum Batteries*, Phys. Rev. Lett. 134, 180401 (2025)", link: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401" },
          { text: "Bo-Wang Zhang et al., *Manipulating spectral transitions*, Phys. Rev. A 111, 063702 (2025)", link: "https://journals.aps.org/pra/abstract/10.1103/PhysRevA.111.063702" },
          { text: "Cheng Shang & Hong-Chao Li, *Resonance-dominant entanglement*, Physical Review Applied 21, 044048 (2024)", link: "https://journals.aps.org/prapplied/abstract/10.1103/PhysRevApplied.21.044048" }
        ]
      },
      {
        type: "gallery",
        id: "gallery",
        title: "Gallery",
        icon: "fa-images",
        data: [
          { 
            url: "https://picsum.photos/seed/p1/1200/800", 
            title: "Ph.D. Defense", 
            location: "UTokyo, Japan", 
            date: "Sep 2024",
            description: "A momentous day defending my doctoral dissertation on the suppression of decoherence in open quantum systems. The defense was followed by an insightful discussion with the committee members about the future of topological phases. This represents the culmination of years of rigorous theoretical work and countless late nights in the lab."
          },
          { 
            url: "https://picsum.photos/seed/p2/1200/800", 
            title: "Greek Workshop", 
            location: "Chania, Greece", 
            date: "2024",
            description: "Attending the 21st PHHQP-XXI Workshop in the beautiful city of Chania. It was a great opportunity to share our latest research on non-Hermitian systems with the global physics community and enjoy the Mediterranean sunset after a day of intense scholarly exchange."
          },
          { 
            url: "https://picsum.photos/seed/p3/1200/800", 
            title: "Breaking Session", 
            location: "Tokyo Studio", 
            date: "2023",
            description: "Balance is key, both in physics and in breaking. This session was part of our weekly practice at a local studio in Tokyo where we explore movement, rhythm, and the limits of physical expression outside the academic environment."
          }
        ]
      }
    ]
  },
  zh: {
    name: "尚  程",
    welcome: "👋 你好，我是",
    titles: ["理论物理研究员", "世界探索者", "量子复杂性爱好者"],
    avatar: "https://picsum.photos/seed/shang/600/800",
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920",
    medias: [
      { icon: "fa-solid fa-at", name: "RIKEN 邮箱", link: "mailto:cheng.shang@riken.jp" },
      { icon: "fa-brands fa-google", name: "Gmail", link: "mailto:shangc1204@gmail.com" },
      { icon: "fa-brands fa-orcid", name: "ORCID", link: "https://orcid.org/0000-0001-8393-2329" },
      { icon: "fa-solid fa-graduation-cap", name: "谷歌学术", link: "https://scholar.google.com/citations?user=-k8PWr8AAAAJ&hl=zh-CN" },
      { icon: "fa-solid fa-flask-vial", name: "iNSPIRE", link: "https://inspirehep.net/authors/2662928" },
      { icon: "fa-brands fa-x-twitter", name: "X", link: "https://x.com/Shangc1204" }
    ],
    navbar: {
      links: [
        { label: "个人简介", anchor: "#profile" },
        { label: "学术经历", anchor: "#education" },
        { label: "动态", anchor: "#news" },
        { label: "研究成果", anchor: "#publications" },
        { label: "相册", anchor: "#gallery" }
      ]
    },
    footer: "用心构建。© 2024 尚程。基于 React, TypeScript 与 Tailwind CSS。",
    contents: [
      {
        type: "profile",
        id: "profile",
        title: "个人简介",
        icon: "fa-user-tie",
        data: {
          affiliation: "RIKEN Hakubi 研究团队 分析量子复杂性研究组",
          contact: [
            { label: "RIKEN 邮箱", value: "cheng.shang@riken.jp" },
            { label: "Gmail", value: "shangc1204@gmail.com" },
            { label: "东京大学邮箱", value: "c-shang@iis.u-tokyo.ac.jp" }
          ],
          interests: ["街舞 (Breaking)", "五子棋", "音乐", "跑步"]
        }
      },
      {
        type: "experience",
        id: "education",
        title: "学术经历",
        icon: "fa-graduation-cap",
        data: [
          { type: 'work', place: "分析量子复杂性 RIKEN Hakubi 研究团队", time: "2024 年 10 月 - 至今", title: "博士后研究员", content: "与 桑原知剛 博士" },
          { type: 'work', place: "分析量子复杂性 RIKEN Hakubi 研究团队", time: "2023 年 4 月 - 2024 年 9 月", title: "初级研究员", content: "与 桑原知剛 博士" },
          { type: 'study', place: "东京大学，日本", time: "2021 年 10 月 - 2024 年 9 月", title: "物理学博士", content: "指导教授：羽田野直道", description: "物理系" }
        ]
      },
      {
        type: "timeline",
        id: "news",
        title: "动态",
        icon: "fa-newspaper",
        data: [
          { year: "2025", content: "工作“**拓扑量子电池**”入选 PRL Trending。", link: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401" },
          { year: "2025", content: "理化学研究所发布新闻稿报道，并入选理化学研究所专刊。", link: "https://www.riken.jp/press/2025/20250513_2/index.html" },
          { year: "2024", content: "获得东京大学物理学博士学位。" }
        ]
      },
      {
        type: "list",
        id: "awards",
        title: "代表荣誉与奖项",
        icon: "fa-award",
        config: { listStyle: "check" },
        data: [
          { text: "2024 邀请报告，第 21 届赝厄密哈密顿量国际研讨会 (PHHQP-XXI)，希腊。" },
          { text: "2023 最佳海报奖，第 5 届 QPQIS-2023，北京。" },
          { text: "2021 日本政府 (MEXT) 博士奖学金。" }
        ]
      },
      {
        type: "list",
        id: "publications",
        title: "研究成果",
        icon: "fa-scroll",
        config: { listType: "ol" },
        data: [
          { text: "Zhi-Guang Lu 等, *拓扑量子电池*, Phys. Rev. Lett. 134, 180401 (2025)", link: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401" }
        ]
      },
      {
        type: "gallery",
        id: "gallery",
        title: "相册",
        icon: "fa-images",
        data: [
          { 
            url: "https://picsum.photos/seed/p1/1200/800", 
            title: "博士论文答辩", 
            location: "东京", 
            date: "2024 年 9 月",
            description: "这是我在东京大学完成博士论文答辩的那一天。论文探讨了开放量子系统中的退相干抑制。那一刻标志着我多年学术追求的一个重要节点，也开启了作为独立研究者的新篇章。"
          },
          { 
            url: "https://picsum.photos/seed/p2/1200/800", 
            title: "希腊学术会议", 
            location: "哈尼亚", 
            date: "2024",
            description: "在希腊哈尼亚参加 PHHQP-XXI 研讨会。在这座充满历史气息的海滨小城，与来自全球的同行共同探讨非厄密系统的奇妙现象，碰撞出许多科研灵感的火花。"
          }
        ]
      }
    ]
  }
};
