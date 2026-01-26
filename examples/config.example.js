export default {
  locales: {
    "/": {
      lang: "zh-CN",
      langName: "EN",
      title: "Mister-Hope | Portfolio",
      description: "The personal portfolio of Mister-Hope, a front-end developer.",
      hero: {
        name: "Mister-Hope",
        welcome: "👋 Hi there, I am",
        titles: ["Open Source Contributor", "A Lifelong Learner"],
        avatar: "/avatar.avif",
        bgImage: "/bg.avif",
        medias: [
          {
            icon: "fa7-brands:blogger",
            name: "Blog",
            link: "https://mister-hope.com",
          },
          {
            icon: "fa7-brands:github",
            name: "GitHub",
            link: "https://github.com/Mister-Hope",
          },
        ],
      },
      navbar: {
        links: [
          {
            label: "Profile",
            anchor: "#profile",
          },
          {
            label: "Experience",
            anchor: "#experience",
          },
          {
            label: "Projects",
            anchor: "#projects",
          },
          {
            label: "Publications",
            anchor: "#publications",
          },
          {
            label: "Gallery",
            anchor: "#gallery",
          },
        ],
      },
      sections: [
        {
          type: "profile",
          id: "profile",
          title: "Profile",
          icon: "user-tie",
          data: {
            fields: [
              {
                title: "Name",
                icon: "user",
                value: "John Hope",
              },
              {
                title: "Interests",
                icon: "heart",
                value: ["Coding", "Gaming", "Music"],
              },
            ],
            contacts: [
              {
                label: "Email",
                value: "mister-hope@outlook.com",
                icon: "envelope",
              },
              {
                label: "Telegram",
                value: "Mister_Hope",
                icon: "fa7-brands:telegram",
                link: "https://t.me/Mister_Hope",
              },
            ],
            slogan: "Where there is light, there is hope.",
          },
        },
        {
          type: "experience",
          id: "experience",
          title: "Experience",
          icon: "graduation-cap",
          data: [
            {
              type: "work",
              place: "Northeast YuCai School, China",
              time: "Aug. 2025 - Present",
              title: "Physics Teacher, High School Department",
              content: "Teaching physics for students from class 2513.",
            },
            {
              type: "volunteer",
              place: "ChangChun, China",
              time: "Jan. 2025 - Jul. 2025",
              title: "Full-time open source contributor",
              content:
                "Building open source projects like [VuePress](https://vuejs.press/) and [markdown-it plugins](https://mdit-plugins.github.io/).",
            },
            {
              type: "study",
              place: "Northeast Normal University, School of Physics, Chain",
              time: "Sep. 2021 - Dec. 2024",
              title: "Master of Science",
              content: "study theoretical physics with Prof. [XueXi Yi](https://cqs.nenu.edu.cn/)",
            },
            {
              type: "project",
              place: "AnShan, China",
              time: "Jul. 2020 - Aug. 2020",
              title: "Part-time open source contributor",
              content:
                "Building open source projects like [VuePress Theme Hope](https://theme-hope.vuejs.press/) and [Waline](https://waline.js.org/).",
            },
            {
              type: "vacation",
              place: "AnShan, China",
              time: "Jul. 2020 - Aug. 2021",
              title: "Enjoying my gap year",
              description: "Also doing open source contributions in my spare time.",
            },
          ],
        },
        {
          type: "banner",
          id: "cfp",
          title: "Call for Papers",
          icon: "bullhorn",
          data: {
            header: "Special Collection: Exception Points in non-Hermitian Systems",
            tags: "Submit now",
            content:
              "**Journal**: Discover Physics (Springer Nature)\n\nFor inquiries, please contact: cheng.shang@riken.jp or shenhz458@nenu.edu.cn",
            footer: "Submission Deadline: 21 April, 2026",
            actions: [
              {
                label: "Submit & Learn More",
                link: "https://link.springer.com/collections/djheehghia",
                primary: true,
              },
            ],
          },
        },
        {
          type: "cards",
          id: "projects",
          title: "Open Source Projects",
          icon: "book",
          data: [
            {
              title:
                "VuePress Core ![Stars](https://img.shields.io/github/stars/vuepress/core?style=plastic&logo=github)",
              logo: "https://vuejs.press/images/hero.png",
              description: "A Vue-powered static site generator.",
              category: "Project",
              actions: [
                {
                  icon: "logos:typescript-icon",
                },
                {
                  icon: "logos:vue",
                },
                {
                  icon: "logos:webpack",
                },
                {
                  icon: "logos:vitejs",
                },
                {
                  text: "Website",
                  link: "https://vuejs.press",
                  icon: "external-link",
                },
                {
                  text: "GitHub",
                  link: "https://github.com/vuepress/core",
                  icon: "fa7-brands:github",
                },
              ],
            },
            {
              title:
                "VuePress Ecosystem ![Stars](https://img.shields.io/github/stars/vuepress/ecosystem?style=plastic&logo=github)",
              logo: "https://vuejs.press/images/hero.png",
              description: "A collection of official VuePress plugins and themes.",
              category: "Project",
              actions: [
                {
                  text: "Website",
                  link: "https://ecosystem.vuejs.press",
                  icon: "external-link",
                },
                {
                  text: "GitHub",
                  link: "https://github.com/vuepress/ecosystem",
                  icon: "fa7-brands:github",
                },
              ],
            },
          ],
        },
        {
          type: "timeline",
          id: "news",
          title: "News",
          icon: "newspaper",
          data: [
            {
              year: 2025,
              content:
                'Our work on "[Topological Quantum Batteries](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401)" was featured in [PRL Trending](https://x.com/PhysRevLett/status/1924474721149542443).',
              link: "https://x.com/PhysRevLett/status/1924474721149542443",
            },
            {
              year: 2022,
              content: "Received Ph.D. degree from the University of Tokyo on September 20.",
            },
          ],
        },
        {
          type: "list",
          id: "awards",
          title: "Honors & Awards",
          icon: "trophy",
          dot: "check",
          data: [
            "**2024** Invited Talk, [21st International Workshop on Pseudo-Hermitian Hamiltonians in Quantum Physics (PHHQP-XXI)](https://events.physics.uoc.gr/event/1/page/5-speakers), Chania, Greece.",
            "**2023** Best Poster Award, [5th International Symposium on Quantum Physics and Quantum Information Sciences (QPQIS-2023)](http://en.baqis.ac.cn/news/detail/?cid=1764), Beijing, China.",
          ],
        },
        {
          type: "list",
          id: "publications",
          title: "Publications",
          icon: "scroll",
          data: [
            {
              text: "Zhi-Guang Lu, Guo-Qing Tian, Xin-You Lü, and Cheng Shang, Topological Quantum Batteries, Phys. Rev. Lett. 134, 180401 (2025)",
              link: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401",
            },
            {
              text: "Bo-Wang Zhang, Cheng Shang, J. Y. Sun, Zhuo-Cheng Gu, and X. X. Yi, Manipulating spectral transitions and photonic transmission in a non-Hermitian optical system through nanoparticle perturbations, Phys. Rev. A 111, 063702 (2025)",
              link: "https://journals.aps.org/pra/abstract/10.1103/PhysRevA.111.063702",
            },
          ],
        },
        {
          type: "list",
          id: "preprints",
          title: "Preprints",
          icon: "clock-rotate-left",
          dot: "diamond",
          data: [
            {
              text: "Donghoon Kim, Yusuke Kimura, Hugo Mackay, Yosuke Mitsuhashi, Hideaki Nishikawa, Carla Rubiliani, Cheng Shang, Ayumi Ukai, and Tomotaka Kuwahara, Spectral Small-Incremental-Entangling: Breaking Quasi-Polynomial Complexity Barriers in Long-Range Interacting Systems, arXiv:2509.12014 (2025)",
              link: "https://arxiv.org/abs/2509.12014",
            },
            {
              text: "Cheng Shang, Zhi-Guang Lu, Hayato Kinkawa, and Tomotaka Kuwahara, Operator Spreading and Information Propagation: Equivalence and Beyond, arXiv:2505.07955 (2025)",
              link: "https://arxiv.org/abs/2505.07955",
            },
          ],
        },
        {
          type: "gallery",
          id: "gallery",
          title: "Gallery",
          icon: "images",
          data: [
            {
              url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
              title: "PHHQP-XXI Workshop",
              location: "Chania, Greece",
              date: 2024,
              description:
                "Presenting my research on open quantum systems. The discussions overlooking the Mediterranean were truly inspiring.",
            },
            {
              url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
              title: "Mountain Hiking",
              location: "Japan Alps",
              date: 2023,
              description:
                "Recharging amidst the breathtaking landscapes of the Japan Alps. Nature provides a perfect backdrop for deep reflection.",
            },
            {
              url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop",
              title: "Breaking Practice",
              location: "Tokyo",
              date: 2024,
              description:
                "Dynamics exist in movement too. Breaking (B-boying) has been my passion for years, teaching me discipline and creative expression.",
            },
            {
              url: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1000&auto=format&fit=crop",
              title: "Gomoku Strategy",
              location: "Kyoto",
              date: 2023,
              description:
                "The elegance of logic in a board game. Gomoku is a great way to train strategic thinking outside of physics.",
            },
            {
              url: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1000&auto=format&fit=crop",
              title: "Early Morning Run",
              location: "Tokyo Bay",
              date: 2024,
              description:
                "Running helps me maintain a clear mind. It is the best way to start a day of intense theoretical research.",
            },
            {
              url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop",
              title: "Physics Library",
              location: "UTokyo",
              date: 2024,
              description:
                "The sanctuary of knowledge where most of my doctoral dissertation took shape.",
            },
          ],
        },
        {
          type: "markdown",
          id: "closing",
          title: "Looking Forward",
          icon: "star",
          data: {
            content:
              "I am always looking for collaborative opportunities at the intersection of **quantum complexity** and **open quantum systems**. Feel free to reach out for research discussions or joint explorations of the fundamental structures of our universe.",
          },
        },
      ],
      footer: {
        copyright: "© 2025 Mister Hope. All rights reserved.",
        description: "Built with Love.",
      },
    },
    "/zh/": {
      lang: "zh-CN",
      langName: "中文",
      title: "Mister-Hope | 作品集",
      description: "前端开发者 Mister-Hope 的个人作品集。",
      ui: {
        themeToggle: "切换主题",
        contacts: "联系",
        details: "详情",
      },
      hero: {
        name: "Mister-Hope",
        welcome: "👋 你好，我是",
        titles: ["开源贡献者", "终身学习者"],
        avatar: "/avatar.avif",
        bgImage: "/bg.avif",
        medias: [
          {
            icon: "fa7-brands:blogger",
            name: "博客",
            link: "https://mister-hope.com",
          },
          {
            icon: "fa7-brands:github",
            name: "GitHub",
            link: "https://github.com/Mister-Hope",
          },
        ],
      },
      navbar: {
        links: [
          {
            label: "个人资料",
            anchor: "#profile",
          },
          {
            label: "经历",
            anchor: "#experience",
          },
          {
            label: "项目",
            anchor: "#projects",
          },
          {
            label: "研究成果",
            anchor: "#publications",
          },
          {
            label: "相册",
            anchor: "#gallery",
          },
        ],
      },
      sections: [
        {
          type: "profile",
          id: "profile",
          title: "个人资料",
          icon: "user-tie",
          data: {
            fields: [
              {
                title: "姓名",
                icon: "user",
                value: "约翰·霍普",
              },
              {
                title: "兴趣",
                icon: "heart",
                value: ["编程", "游戏", "音乐"],
              },
            ],
            contacts: [
              {
                label: "邮箱",
                value: "mister-hope@outlook.com",
                icon: "envelope",
              },
              {
                label: "QQ",
                value: "1178522294",
                icon: "fa7-brands:qq",
              },
            ],
            slogan: "有光的地方，就有希望。",
          },
        },
        {
          type: "experience",
          id: "experience",
          title: "经历",
          icon: "graduation-cap",
          data: [
            {
              type: "work",
              place: "东北育才学校，中国",
              time: "2025年8月 - 现在",
              title: "高中部物理教师",
              content: "为 2513 班的学生教授物理。",
            },
            {
              type: "volunteer",
              place: "长春，中国",
              time: "2025年1月 - 2025年7月",
              title: "全职开源贡献者",
              content:
                "参与构建 [VuePress](https://vuejs.press/zh/) 和 [mdit-plugins](https://mdit-plugins.github.io/zh/) 插件等开源项目。",
            },
            {
              type: "study",
              place: "东北师范大学，物理学院，中国",
              time: "2021年9月 - 2024年12月",
              title: "理学硕士",
              content: "在[衣学喜教授](https://cqs.nenu.edu.cn/)指导下研究理论物理。",
            },
            {
              type: "project",
              place: "鞍山，中国",
              time: "2020年7月 - 2020年8月",
              title: "兼职开源贡献者",
              content:
                "参与构建 [VuePress Theme Hope](https://theme-hope.vuejs.press/zh/) 和 [Waline](https://waline.js.org/zh/) 等开源项目。",
            },
            {
              type: "vacation",
              place: "鞍山，中国",
              time: "2020年7月 - 2021年8月",
              title: "享受间歇年",
            },
            {
              type: "study",
              place: "东北师范大学，物理学院，中国",
              time: "2016年9月 - 2020年6月",
              title: "理学学士",
              content: "获得校长奖学金。",
            },
          ],
        },
        {
          type: "banner",
          id: "cfp",
          title: "征稿启事",
          icon: "bullhorn",
          data: {
            header: "特刊：非厄米系统中的例外点",
            content:
              "**期刊**：Discover Physics（Springer Nature）\n\n如有疑问，请联系：cheng.shang@riken.jp 或 shenhz458@nenu.edu.cn",
            footer: "投稿截止：2026 年 4 月 21 日",
            actions: [
              {
                label: "投稿与了解更多",
                link: "https://link.springer.com/collections/djheehghia",
                primary: true,
              },
            ],
          },
        },
        {
          type: "cards",
          id: "projects",
          title: "开源项目",
          icon: "book",
          data: [
            {
              title:
                "VuePress Core ![Stars](https://img.shields.io/github/stars/vuepress/core?style=plastic&logo=github)",
              logo: "https://vuejs.press/images/hero.png",
              description: "Vue 驱动的静态网站生成器。",
              category: "项目",
              actions: [
                {
                  text: "网站",
                  link: "https://vuejs.press/zh/",
                  icon: "external-link",
                },
                {
                  text: "GitHub",
                  link: "https://github.com/vuepress/core",
                  icon: "fa7-brands:github",
                },
              ],
            },
            {
              title:
                "VuePress Ecosystem ![Stars](https://img.shields.io/github/stars/vuepress/ecosystem?style=plastic&logo=github)",
              logo: "https://vuejs.press/images/hero.png",
              description: "VuePress 官方插件与主题集合。",
              category: "项目",
              actions: [
                {
                  text: "网站",
                  link: "https://ecosystem.vuejs.press/zh/",
                  icon: "external-link",
                },
                {
                  text: "GitHub",
                  link: "https://github.com/vuepress/ecosystem",
                  icon: "fa7-brands:github",
                },
              ],
            },
          ],
        },
        {
          type: "timeline",
          id: "news",
          title: "动态",
          icon: "newspaper",
          data: [
            {
              year: 2025,
              content:
                "我们关于“[Topological Quantum Batteries](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401)”的工作被 [PRL Trending](https://x.com/PhysRevLett/status/1924474721149542443) 报道。",
              link: "https://x.com/PhysRevLett/status/1924474721149542443",
            },
            {
              year: 2022,
              content: "9 月 20 日获得东京大学博士学位。",
            },
          ],
        },
        {
          type: "list",
          id: "awards",
          title: "荣誉与奖项",
          icon: "trophy",
          dot: "check",
          data: [
            "**2024** 受邀报告，[21st International Workshop on Pseudo-Hermitian Hamiltonians in Quantum Physics (PHHQP-XXI)](https://events.physics.uoc.gr/event/1/page/5-speakers)，希腊哈尼亚。",
            "**2023** 最佳海报奖，[5th International Symposium on Quantum Physics and Quantum Information Sciences (QPQIS-2023)](http://en.baqis.ac.cn/news/detail/?cid=1764)，中国北京。",
          ],
        },
        {
          type: "list",
          id: "publications",
          title: "期刊论文",
          icon: "scroll",
          data: [
            {
              text: "Zhi-Guang Lu, Guo-Qing Tian, Xin-You Lü, and Cheng Shang, Topological Quantum Batteries, Phys. Rev. Lett. 134, 180401 (2025)",
              link: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401",
            },
            {
              text: "Bo-Wang Zhang, Cheng Shang, J. Y. Sun, Zhuo-Cheng Gu, and X. X. Yi, Manipulating spectral transitions and photonic transmission in a non-Hermitian optical system through nanoparticle perturbations, Phys. Rev. A 111, 063702 (2025)",
              link: "https://journals.aps.org/pra/abstract/10.1103/PhysRevA.111.063702",
            },
          ],
        },
        {
          type: "list",
          id: "preprints",
          title: "预印本",
          icon: "clock-rotate-left",
          dot: "diamond",
          data: [
            {
              text: "Donghoon Kim, Yusuke Kimura, Hugo Mackay, Yosuke Mitsuhashi, Hideaki Nishikawa, Carla Rubiliani, Cheng Shang, Ayumi Ukai, and Tomotaka Kuwahara, Spectral Small-Incremental-Entangling: Breaking Quasi-Polynomial Complexity Barriers in Long-Range Interacting Systems, arXiv:2509.12014 (2025)",
              link: "https://arxiv.org/abs/2509.12014",
            },
            {
              text: "Cheng Shang, Zhi-Guang Lu, Hayato Kinkawa, and Tomotaka Kuwahara, Operator Spreading and Information Propagation: Equivalence and Beyond, arXiv:2505.07955 (2025)",
              link: "https://arxiv.org/abs/2505.07955",
            },
          ],
        },
        {
          type: "gallery",
          id: "gallery",
          title: "相册",
          icon: "images",
          data: [
            {
              url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop",
              title: "PHHQP-XXI 研讨会",
              location: "希腊，哈尼亚",
              date: 2024,
              description: "在 PHHQP-XXI 展示我的开放量子系统研究。地中海的景色令人深受启发。",
            },
            {
              url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
              title: "山间徒步",
              location: "日本阿尔卑斯",
              date: 2023,
              description: "在日本阿尔卑斯的自然中重获能量与平静。",
            },
            {
              url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop",
              title: "街舞练习",
              location: "东京",
              date: 2024,
              description: "街舞（Breaking）多年训练带来纪律与创造力。",
            },
            {
              url: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1000&auto=format&fit=crop",
              title: "五子棋策略",
              location: "京都",
              date: 2023,
              description: "棋盘上的逻辑训练有助于科研思维。",
            },
            {
              url: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1000&auto=format&fit=crop",
              title: "早晨跑步",
              location: "东京湾",
              date: 2024,
              description: "跑步帮助我保持清晰思路，开启高强度研究日程。",
            },
            {
              url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop",
              title: "物理系图书馆",
              location: "东京大学",
              date: 2024,
              description: "我的博士论文大部分内容在此完成。",
            },
          ],
        },
        {
          type: "markdown",
          id: "closing",
          title: "展望未来",
          icon: "star",
          data: {
            content:
              "我始终期待在**量子复杂性**与**开放量子系统**交叉领域的合作。欢迎随时联系我进行研究讨论，或共同探索宇宙的基本结构。",
          },
        },
      ],
      footer: {
        copyright: "© 2025 Mister Hope。保留所有权利。",
        description: "用爱构建。",
      },
    },
  },
};
