/* ==========================================================================
   ANTIGRAVITY UI & MOTION ENGINE - MAIN JAVASCRIPT
   GSAP 3 + ScrollTrigger + Spatial 3D + Bilingual i18n
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. STARFIELD & COSMIC PARTICLES (PERFORMANCE OPTIMIZED)
  // ==========================================================================
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width, height;
    let animationFrameId;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.3,
          speed: Math.random() * 0.25 + 0.08,
          opacity: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }
    }

    function renderStarfield(time) {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.25 + 0.75;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${star.opacity * twinkle})`;
        ctx.fill();

        star.y -= star.speed; // Floating weightless upwards
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
      });

      if (!document.hidden && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderStarfield);
      }
    }

    resizeCanvas();
    createStars(window.innerWidth < 768 ? 80 : 160);

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(renderStarfield);
    } else {
      renderStarfield(0); // Single static draw for reduced-motion
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars(window.innerWidth < 768 ? 80 : 160);
      if (prefersReducedMotion) renderStarfield(0);
    });

    document.addEventListener('visibilitychange', () => {
      if (!prefersReducedMotion) {
        if (document.hidden) {
          cancelAnimationFrame(animationFrameId);
        } else {
          animationFrameId = requestAnimationFrame(renderStarfield);
        }
      }
    });
  }

  // ==========================================================================
  // 2. CURSOR GLOW INTERACTION
  // ==========================================================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function updateCursor() {
      mouseX += (targetX - mouseX) * 0.15;
      mouseY += (targetY - mouseY) * 0.15;
      cursorGlow.style.left = `${mouseX}px`;
      cursorGlow.style.top = `${mouseY}px`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // ==========================================================================
  // 3. NAVBAR SCROLL & ACTIVE LINK STATE
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active section
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
      });
    });
  }

  // Smooth scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 85;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // ==========================================================================
  // 4. GSAP & SCROLLTRIGGER MOTION SEQUENCES (STAGGER 0.1s + PARALLAX)
  // ==========================================================================
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance staggered sequence (0.1s interval)
    const heroElements = [
      '.hero-badge',
      '.hero-title',
      '.hero-desc',
      '.hero-cta-group',
      '.hero-stats'
    ];

    gsap.set(heroElements, { willChange: 'transform, opacity' });
    gsap.from(heroElements, {
      y: 35,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(heroElements, { willChange: 'auto' });
      }
    });

    // Spatial Hero Showcase Entrance
    gsap.from('#spatialStack', {
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power3.out'
    });

    // Multi-layer Scroll Parallax on Background Grid & Elements
    const heroGrid = document.querySelector('.hero-grid-overlay');
    if (heroGrid) {
      gsap.to(heroGrid, {
        y: 140,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Hero Content gentle fade & float on scroll
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        y: 80,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // About Section Staggered Entrance
    ScrollTrigger.batch('.about-grid > *', {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.set(batch, { willChange: 'transform, opacity' });
        gsap.from(batch, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => gsap.set(batch, { willChange: 'auto' })
        });
      },
      once: true
    });

    // Video Case Studies Entrance
    ScrollTrigger.batch('.video-case-study', {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.set(batch, { willChange: 'transform, opacity' });
        gsap.from(batch, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => gsap.set(batch, { willChange: 'auto' })
        });
      },
      once: true
    });

    // Contact Section Stagger
    ScrollTrigger.batch('.contact-channel-card, .contact-socials-row, .contact-form', {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.set(batch, { willChange: 'transform, opacity' });
        gsap.from(batch, {
          y: 35,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => gsap.set(batch, { willChange: 'auto' })
        });
      },
      once: true
    });
  }

  // ==========================================================================
  // 5. STAT COUNTER ANIMATION
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          let current = 0;
          const duration = 1200;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current);
            }
          }, stepTime);

          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(n => statObserver.observe(n));
  }

  // ==========================================================================
  // 6. SPATIAL 3D CARD TILT (WITH GSAP INTERPOLATION & WILL-CHANGE HYGIENE)
  // ==========================================================================
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    tiltElements.forEach(el => {
      let isHovered = false;

      el.addEventListener('mouseenter', () => {
        isHovered = true;
        el.style.willChange = 'transform';
      });

      el.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        if (window.gsap) {
          gsap.to(el, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1200,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        if (window.gsap) {
          gsap.to(el, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              el.style.willChange = 'auto';
            }
          });
        } else {
          el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
          el.style.willChange = 'auto';
        }
      });
    });
  }

  // ==========================================================================
  // 7. CONTACT FORM WITH SNAPPY VALIDATION FEEDBACK
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span>';

      setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btn.style.boxShadow = '0 12px 25px -4px rgba(16, 185, 129, 0.4)';

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.boxShadow = '';
          contactForm.reset();
        }, 3200);
      }, 1000);
    });
  }

  // ==========================================================================
  // 9. BILINGUAL INTERNATIONALIZATION (EN / AR) WITH PERSISTENCE
  // ==========================================================================
  const languageToggle = document.getElementById('languageToggle');
  const translations = {
    en: {
      pageTitle: 'Walaa Aldine Alsaleh | Antigravity Portfolio',
      navHome: 'Home',
      navAbout: 'About',
      navProjects: 'Projects',
      navContact: 'Contact',
      languageButton: 'العربية',
      available: 'Available for opportunities',
      role: 'Computer Engineering Student',
      heroSubtitle: 'Computer Engineering student passionate about building innovative tech solutions and exploring the future of web development.',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      projects: 'Projects',
      featuredWorks: 'Featured',
      yearsExp: 'Years Exp',
      courses: 'Courses',
      about: 'About',
      me: 'Me',
      aboutDesc: 'Get to know the developer behind the code',
      hello: "Hello, I'm Walaa aldine alsaleh",
      aboutText1: "A passionate Computer Engineering student with a deep interest in software development, embedded systems, and modern web technologies. I'm constantly learning and building projects that push my understanding of how hardware and software work together.",
      aboutText2: 'My journey in computer engineering has equipped me with a strong foundation in programming, algorithms, and system design. I enjoy working on projects that combine creativity with technical problem-solving, from web applications to embedded systems.',
      nameLabel: 'Name:',
      locationLabel: 'Location:',
      syria: 'Syria',
      experienceLabel: 'Experience:',
      studentExperience: 'Student / 0 Years',
      availabilityLabel: 'Availability:',
      freeOpportunities: 'Free for opportunities',
      downloadResume: 'Download Resume',
      projectsDesc: 'From raw ideas to polished digital experiences',
      bagcoTitle: 'Turn simple handbag photos into a feature ad with the magic of <span class="gradient-iridescent">AI</span>',
      bagcoDesc: 'I transform ordinary product images into cinematic advertising concepts, shaping the visual story from the first frame through to the final video.',
      olkTitle: 'Give an everyday handbag a cinematic story with <span class="gradient-iridescent">AI</span>',
      olkDesc: 'I turn Olk handbag photography into a polished product advertisement with a clear visual rhythm from storyboard to final cut.',
      wiwuTitle: 'Build a feature ad for a modern backpack with <span class="gradient-iridescent">AI</span>',
      wiwuDesc: 'I shape WiWU backpack images into a focused product story, pairing a practical design with an energetic final video.',
      aiVideo: 'AI Video',
      creativeDirection: 'Creative Direction',
      productAds: 'Product Ads',
      featuredWork: 'Featured work',
      productImage: 'Product Image',
      storyboard: 'Storyboard',
      finalVideo: 'Final Video',
      getAiVideo: 'Get Your AI Video',
      getIn: 'Get In',
      touch: 'Touch',
      contactDesc: "Have an ambitious project or opportunity in mind? Let's connect.",
      email: 'Email',
      phone: 'WhatsApp',
      telegram: 'Telegram',
      sendMessage: 'Send Message',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      subject: 'Subject',
      yourMessage: 'Your Message',
      footerIntro: 'Engineering modern digital realities at the intersection of hardware, software, and creative motion.',
      quickLinks: 'Quick Links',
      resources: 'Resources',
      resume: 'Resume PDF',
      openSource: 'GitHub Source',
      profileAlt: 'Walaa aldine alsaleh'
    },
    ar: {
      pageTitle: 'ولاء الدين الصالح | معرض الأعمال الرقمي',
      navHome: 'الرئيسية',
      navAbout: 'نبذة عني',
      navProjects: 'المشاريع',
      navContact: 'تواصل معي',
      languageButton: 'English',
      available: 'متاح للفرص والمشاريع',
      role: 'طالب هندسة حاسوب',
      heroSubtitle: 'طالب هندسة حاسوب شغوف بابتكار الحلول التقنية المتقدمة واستكشاف مستقبل تطوير الويب والواجهات الفضائية.',
      viewProjects: 'استعراض المشاريع',
      contactMe: 'تواصل معي',
      projects: 'المشاريع',
      featuredWorks: 'أبرز',
      yearsExp: 'سنوات الخبرة',
      courses: 'الدورات التدريبية',
      about: 'نبذة',
      me: 'عني',
      aboutDesc: 'تعرّف على المهندس والمطور خلف الشيفرة',
      hello: 'مرحباً، أنا ولاء الدين الصالح',
      aboutText1: 'طالب هندسة حاسوب شغوف بتطوير البرمجيات، الأنظمة المضمنة، وأحدث تقنيات الويب التفاعلية. أواصل التعلّم وتطوير مشاريع عملية تعمّق فهمي لتقاطع العتاد مع البرمجيات.',
      aboutText2: 'أكسبتني مسيرتي في هندسة الحاسوب أساساً متيناً في هندسة الأنظمة والخوارزميات والبرمجة كائنية التوجه. أجمع بين الرؤية الإبداعية وحل المشكلات الهندسية المعقدة.',
      nameLabel: 'الاسم:',
      locationLabel: 'الموقع:',
      syria: 'سوريا',
      experienceLabel: 'المستوى:',
      studentExperience: 'طالب / 0 سنوات',
      availabilityLabel: 'الحالة:',
      freeOpportunities: 'جاهز للفرص الجديدة',
      downloadResume: 'تحميل السيرة الذاتية',
      projectsDesc: 'من المفاهيم الأولية إلى تجارب رقمية ثلاثية الأبعاد متقنة',
      bagcoTitle: 'تحويل صور حقائب بسيطة إلى إعلان سنمائي مميز بسحر <span class="gradient-iridescent">الذكاء الاصطناعي</span>',
      bagcoDesc: 'أحوّل صور المنتجات الفوتوغرافية إلى مفاهيم إعلانية سينمائية مبهرة، مع صياغة القصة البصرية من اللقطة الأولى وحتى المونتاج النهائي.',
      olkTitle: 'منح حقيبة يومية قصة إعلانية سينمائية متكاملة بالذكاء الاصطناعي',
      olkDesc: 'صياغة صور منتجات Olk في إعلان متقن يحمل إيقاعاً بصرياً انسيابياً من لوحة القصة إلى الفيديو النهائي.',
      wiwuTitle: 'إنتاج إعلان مميز لحقيبة ظهر عصرية بأحدث تقنيات الذكاء الاصطناعي',
      wiwuDesc: 'تحويل صور حقائب WiWU إلى قصة إعلانية تفاعلية تجمع بين التصميم المبتكر والإيقاع الحيوي.',
      aiVideo: 'فيديو بالذكاء الاصطناعي',
      creativeDirection: 'إخراج إبداعي',
      productAds: 'إعلانات تجارية',
      featuredWork: 'مشروع مميز',
      productImage: 'صور المنتج',
      storyboard: 'لوحة القصة',
      finalVideo: 'الفيديو النهائي',
      getAiVideo: 'اطلب الفيديو الآن',
      getIn: 'تواصل',
      touch: 'معي',
      contactDesc: 'هل لديك مشروع طموح أو فرصة مهنية ترغب في مناقشتها؟ يسعدني التواصل معك.',
      email: 'البريد الإلكتروني',
      phone: 'واتساب',
      telegram: 'تلغرام',
      sendMessage: 'إرسال الرسالة',
      yourName: 'الاسم الكامل',
      yourEmail: 'البريد الإلكتروني',
      subject: 'موضوع الرسالة',
      yourMessage: 'نص الرسالة',
      footerIntro: 'هندسة تجارب رقمية عصرية عند نقطة التقاء العتاد والبرمجيات والمؤثرات البصرية.',
      quickLinks: 'روابط سريعة',
      resources: 'المصادر',
      resume: 'ملف السيرة الذاتية',
      openSource: 'المصدر المفتوح',
      profileAlt: 'ولاء الدين الصالح'
    }
  };

  function setLanguage(lang) {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = dict.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (dict[key]) el.alt = dict[key];
    });

    const langCodeEl = document.querySelector('.language-code');
    if (langCodeEl) langCodeEl.textContent = lang === 'en' ? 'ع' : 'E';

    if (languageToggle) {
      languageToggle.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'Switch to Arabic');
    }

    localStorage.setItem('antigravity-lang', lang);
  }

  const savedLanguage = localStorage.getItem('antigravity-lang') || 'en';
  setLanguage(savedLanguage);

  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      const current = document.documentElement.lang;
      setLanguage(current === 'en' ? 'ar' : 'en');
    });
  }
});
