/* ============================================
   CYBERPUNK PORTFOLIO - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === Starfield Animation ===
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let width, height;

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
        radius: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function createShootingStar() {
    if (Math.random() < 0.005) {
      shootingStars.push({
        x: Math.random() * width,
        y: 0,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 8 + 4,
        angle: Math.PI / 4 + (Math.random() * 0.3 - 0.15),
        opacity: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15, 240, 252, ${star.opacity * twinkle})`;
      ctx.fill();

      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
    });

    createShootingStar();
    shootingStars = shootingStars.filter(s => {
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= s.decay;

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(
        s.x - Math.cos(s.angle) * s.length,
        s.y - Math.sin(s.angle) * s.length
      );
      ctx.strokeStyle = `rgba(15, 240, 252, ${s.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      return s.opacity > 0 && s.y < height + 100 && s.x > -100 && s.x < width + 100;
    });

    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  createStars(250);
  requestAnimationFrame(drawStars);
  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars(250);
  });

  // === Cursor Glow ===
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  // === Navbar Scroll Behavior ===
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);

  // === Active Nav Link ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

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

  window.addEventListener('scroll', highlightNavLink);

  // === Mobile Nav Toggle ===
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // === Scroll Reveal Animation ===
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // === Skill Bar Animation ===
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // === Stat Counter Animation ===
  const statNumbers = document.querySelectorAll('.stat-number');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => statObserver.observe(num));

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 25);
  }

  // === Project Card Tilt Effect ===
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === Contact Form Handling ===
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btn.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.3)';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.background = '';
        btn.style.boxShadow = '';
        contactForm.reset();
      }, 3000);
    }, 1500);
  });

  // === Grid Overlay Parallax on Hero ===
  const heroGrid = document.querySelector('.hero-grid-overlay');

  window.addEventListener('scroll', () => {
    if (heroGrid) {
      const scrolled = window.scrollY;
      heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // === Hero Content Parallax ===
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    if (heroContent) {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
      }
    }
  });

  // === Language Switcher ===
  const languageToggle = document.getElementById('languageToggle');
  const translations = {
    en: {
      pageTitle: 'CyberPortfolio | Developer', navHome: 'Home', navAbout: 'About', navProjects: 'Projects', navContact: 'Contact', languageButton: 'العربية', available: 'Available for opportunities', role: 'Computer Engineering Student', heroSubtitle: 'Computer Engineering student passionate about building innovative tech solutions and exploring the future of web development', viewProjects: 'View Projects', contactMe: 'Contact Me', projects: 'Projects', projectsHeading: 'My <span class="gradient-text">Projects</span>', yearsExp: 'Years Exp', courses: 'Courses', about: 'About', me: 'Me', aboutDesc: 'Get to know the developer behind the code', hello: "Hello, I'm Walaa aldine alsaleh", aboutText1: "A passionate Computer Engineering student with a deep interest in software development, embedded systems, and modern web technologies. I'm constantly learning and building projects that push my understanding of how hardware and software work together.", aboutText2: 'My journey in computer engineering has equipped me with a strong foundation in programming, algorithms, and system design. I enjoy working on projects that combine creativity with technical problem-solving, from web applications to embedded systems.', nameLabel: 'Name:', locationLabel: 'Location:', syria: 'Syria', experienceLabel: 'Experience:', studentExperience: 'Student / 0 Years', availabilityLabel: 'Availability:', freeOpportunities: 'Free for opportunities', downloadResume: 'Download Resume', projectsDesc: 'From raw ideas to polished digital experiences', bagcoTitle: 'Turn simple handbag photos into a feature ad with the magic of <span class="gradient-text">AI</span>', bagcoDesc: 'I transform ordinary product images into cinematic advertising concepts, shaping the visual story from the first frame through to the final video.', olkTitle: 'Give an everyday handbag a cinematic story with <span class="gradient-text">AI</span>', olkDesc: 'I turn Olk handbag photography into a polished product advertisement with a clear visual rhythm from storyboard to final cut.', wiwuTitle: 'Build a feature ad for a modern backpack with <span class="gradient-text">AI</span>', wiwuDesc: 'I shape WiWU backpack images into a focused product story, pairing a practical design with an energetic final video.', aiVideo: 'AI Video', creativeDirection: 'Creative Direction', productAds: 'Product Ads', featuredWork: 'Featured work', productImage: 'Product Image', storyboard: 'Storyboard', finalVideo: 'Final Video', getAiVideo: 'Get Your AI Video', getIn: 'Get In', touch: 'Touch', contactDesc: "Have a project in mind? Let's work together", email: 'Email', phone: 'Phone', telegram: 'Telegram', sendMessage: 'Send Message', yourName: 'Your Name', yourEmail: 'Your Email', subject: 'Subject', yourMessage: 'Your Message', footerIntro: 'Building the future of web, one pixel at a time.', quickLinks: 'Quick Links', resources: 'Resources', resume: 'Resume', blog: 'Blog', techStack: 'Tech Stack', openSource: 'Open Source', privacy: 'Privacy', terms: 'Terms', profileAlt: 'Walaa aldine alsaleh'
    },
    ar: {
      pageTitle: 'محفظة سايبر | مطوّر', navHome: 'الرئيسية', navAbout: 'نبذة عني', navProjects: 'المشاريع', navContact: 'تواصل معي', languageButton: 'English', available: 'متاح للفرص', role: 'طالب هندسة حاسوب', heroSubtitle: 'طالب هندسة حاسوب شغوف ببناء حلول تقنية مبتكرة واستكشاف مستقبل تطوير الويب', viewProjects: 'استعرض المشاريع', contactMe: 'تواصل معي', projects: 'المشاريع', projectsHeading: 'مشاريعي', yearsExp: 'سنوات الخبرة', courses: 'الدورات', about: 'نبذة', me: 'عني', aboutDesc: 'تعرّف على المطوّر خلف الشيفرة', hello: 'مرحباً، أنا ولاء الدين الصالح', aboutText1: 'طالب هندسة حاسوب شغوف بتطوير البرمجيات والأنظمة المضمنة وتقنيات الويب الحديثة. أواصل التعلم وبناء المشاريع التي توسّع فهمي لكيفية عمل العتاد والبرمجيات معاً.', aboutText2: 'منحتني رحلتي في هندسة الحاسوب أساساً قوياً في البرمجة والخوارزميات وتصميم الأنظمة. أستمتع بالمشاريع التي تجمع الإبداع مع حل المشكلات التقنية، من تطبيقات الويب إلى الأنظمة المضمنة.', nameLabel: 'الاسم:', locationLabel: 'الموقع:', syria: 'سوريا', experienceLabel: 'الخبرة:', studentExperience: 'طالب / 0 سنوات', availabilityLabel: 'التفرغ:', freeOpportunities: 'متاح للفرص', downloadResume: 'تحميل السيرة الذاتية', projectsDesc: 'من الأفكار الأولية إلى التجارب الرقمية المتقنة', bagcoTitle: 'تحويل صور حقيبة بسيطة إلى إعلان مميز بسحر <span class="gradient-text">الذكاء الاصطناعي</span>', bagcoDesc: 'أحوّل صور المنتجات العادية إلى أفكار إعلانية سينمائية، وأبني القصة البصرية من اللقطة الأولى حتى الفيديو النهائي.', olkTitle: 'منح حقيبة يومية قصة سينمائية باستخدام <span class="gradient-text">الذكاء الاصطناعي</span>', olkDesc: 'أحوّل صور حقائب Olk إلى إعلان منتج متكامل بإيقاع بصري واضح، من لوحة القصة إلى المونتاج النهائي.', wiwuTitle: 'بناء إعلان مميز لحقيبة ظهر عصرية باستخدام <span class="gradient-text">الذكاء الاصطناعي</span>', wiwuDesc: 'أصوغ صور حقائب WiWU في قصة منتج مركزة تجمع التصميم العملي بفيديو نهائي حيوي.', aiVideo: 'فيديو بالذكاء الاصطناعي', creativeDirection: 'إخراج إبداعي', productAds: 'إعلانات منتجات', featuredWork: 'عمل مميز', productImage: 'صورة المنتج', storyboard: 'لوحة القصة', finalVideo: 'الفيديو النهائي', getAiVideo: 'احصل على فيديو بالذكاء الاصطناعي', getIn: 'تواصل', touch: 'معي', contactDesc: 'لديك مشروع في ذهنك؟ لنعمل معاً', email: 'البريد الإلكتروني', phone: 'الهاتف', telegram: 'تلغرام', sendMessage: 'إرسال رسالة', yourName: 'اسمك', yourEmail: 'بريدك الإلكتروني', subject: 'الموضوع', yourMessage: 'رسالتك', footerIntro: 'نبني مستقبل الويب، بكسل واحد في كل مرة.', quickLinks: 'روابط سريعة', resources: 'المصادر', resume: 'السيرة الذاتية', blog: 'المدونة', techStack: 'التقنيات', openSource: 'المصادر المفتوحة', privacy: 'الخصوصية', terms: 'الشروط', profileAlt: 'ولاء الدين الصالح'
    }
  };

  function setLanguage(language) {
    const dictionary = translations[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = dictionary.pageTitle;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.innerHTML = dictionary[element.dataset.i18n];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      element.alt = dictionary[element.dataset.i18nAlt];
    });
    document.querySelectorAll('.workflow-stage-heading span:last-child').forEach(element => {
      const key = element.textContent.trim() === 'Product Image' || element.textContent.trim() === 'صورة المنتج' ? 'productImage' : element.textContent.trim() === 'Storyboard' || element.textContent.trim() === 'لوحة القصة' ? 'storyboard' : 'finalVideo';
      element.textContent = dictionary[key];
    });
    document.querySelectorAll('.workflow-cta span').forEach(element => {
      element.textContent = dictionary.getAiVideo;
    });
    document.querySelector('.language-code').textContent = language === 'en' ? 'ع' : 'E';
    languageToggle.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'Switch to Arabic');
    localStorage.setItem('portfolio-language', language);
  }

  const savedLanguage = localStorage.getItem('portfolio-language') || 'en';
  setLanguage(savedLanguage);
  languageToggle.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'ar' : 'en'));

  // === Initialize ===
  handleScroll();
  highlightNavLink();

});
