// ==============================================================================
// ALIMKHAN ERMEKOV: HISTORICAL & SCIENTIFIC INFOGRAPHIC WEBSITE
// Interactive React Application (Zero Build-Step, Pure Browser Native with HTM)
// ==============================================================================

(function() {
  const { useState, useEffect, useMemo } = React;
  const html = window.htm.bind(React.createElement);
  const DATA = window.ERMEKOV_DATA;

  function App() {
    // State management
    const [lang, setLang] = useState(() => {
      return localStorage.getItem('ermekov_lang') || 'kk';
    });
    const [selectedRegionId, setSelectedRegionId] = useState('caspian');
    const [selectedBookChapter, setSelectedBookChapter] = useState(1);
    const [timelineFilter, setTimelineFilter] = useState('all');
    const [termSearch, setTermSearch] = useState('');
    const [mathX, setMathX] = useState(0.8);
    const [isPresentationOpen, setIsPresentationOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timerSeconds, setTimerSeconds] = useState(240); // 4 min default
    const [timerRunning, setTimerRunning] = useState(false);
    const [isOutlineOpen, setIsOutlineOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Save language
    const changeLang = (newLang) => {
      setLang(newLang);
      localStorage.setItem('ermekov_lang', newLang);
    };

    const t = DATA.i18n[lang];

    // Scroll listener for back to top
    useEffect(() => {
      const handleScroll = () => {
        setShowBackToTop(window.scrollY > 400);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Presentation countdown timer
    useEffect(() => {
      let interval = null;
      if (isPresentationOpen && timerRunning && timerSeconds > 0) {
        interval = setInterval(() => {
          setTimerSeconds((prev) => Math.max(0, prev - 1));
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isPresentationOpen, timerRunning, timerSeconds]);

    // Keyboard navigation in presentation mode
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (!isPresentationOpen) return;
        if (e.key === 'ArrowRight' || e.key === ' ') {
          setCurrentSlide((prev) => Math.min(DATA.presentationSlides.length - 1, prev + 1));
        } else if (e.key === 'ArrowLeft') {
          setCurrentSlide((prev) => Math.max(0, prev - 1));
        } else if (e.key === 'Escape') {
          setIsPresentationOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPresentationOpen]);

    // Filtered timeline items
    const filteredTimeline = useMemo(() => {
      if (timelineFilter === 'all') return DATA.timeline;
      return DATA.timeline.filter((item) => item.category === timelineFilter);
    }, [timelineFilter]);

    // Filtered terminology list
    const filteredTerms = useMemo(() => {
      if (!termSearch.trim()) return DATA.science.terminology.terms;
      const q = termSearch.toLowerCase();
      return DATA.science.terminology.terms.filter((item) => {
        return (
          item.termKk.toLowerCase().includes(q) ||
          item.termRu.toLowerCase().includes(q) ||
          item.termEn.toLowerCase().includes(q) ||
          item.defKk.toLowerCase().includes(q) ||
          item.defRu.toLowerCase().includes(q) ||
          item.defEn.toLowerCase().includes(q)
        );
      });
    }, [termSearch]);

    // Active map region
    const activeRegion = useMemo(() => {
      return (
        DATA.mission.regions.find((r) => r.id === selectedRegionId) ||
        DATA.mission.regions[0]
      );
    }, [selectedRegionId]);

    // Format timer
    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Calculus calculations for live visualizer: f(x) = x^3 - 2x
    const calcFx = (x) => Math.pow(x, 3) - 2 * x;
    const calcDf = (x) => 3 * Math.pow(x, 2) - 2;

    const currentFx = calcFx(mathX).toFixed(3);
    const currentDf = calcDf(mathX).toFixed(3);

    // Dynamic curve points for SVG
    const curvePoints = useMemo(() => {
      return Array.from({ length: 80 }).map((_, i) => {
        const vx = -2.0 + (i / 79) * 4.0;
        const vy = calcFx(vx);
        const px = 250 + vx * 100;
        const py = 140 - vy * 50;
        return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)},${py.toFixed(1)}`;
      }).join(' ');
    }, []);

    // Dynamic area path for integral
    const integralAreaPath = useMemo(() => {
      const steps = 30;
      const a = -1.5;
      const b = mathX;
      let path = `M ${(250 + a * 100).toFixed(1)},140`;
      for (let i = 0; i <= steps; i++) {
        const vx = a + (i / steps) * (b - a);
        const vy = calcFx(vx);
        const px = 250 + vx * 100;
        const py = 140 - vy * 50;
        path += ` L ${px.toFixed(1)},${py.toFixed(1)}`;
      }
      path += ` L ${(250 + b * 100).toFixed(1)},140 Z`;
      return path;
    }, [mathX]);

    return html`
      <div className="site-root">
        <div className="archival-pattern"></div>

        
        <header className="site-nav">
          <div className="nav-container">
            <a href="#hero" className="nav-brand">
              <span className="brand-badge">NIS 1920</span>
              <div className="brand-titles">
                <span className="brand-main">${t.siteTitle}</span>
                <span className="brand-sub">${t.siteSubtitle}</span>
              </div>
            </a>

            
            <ul className=${`nav-links ${mobileNavOpen ? 'mobile-open' : ''}`}>
              <li><a href="#hero" className="nav-link" onClick=${() => setMobileNavOpen(false)}>${t.navHero}</a></li>
              <li><a href="#mission" className="nav-link" onClick=${() => setMobileNavOpen(false)}>${t.navMission}</a></li>
              <li><a href="#science" className="nav-link" onClick=${() => setMobileNavOpen(false)}>${t.navScience}</a></li>
              <li><a href="#timeline" className="nav-link" onClick=${() => setMobileNavOpen(false)}>${t.navTimeline}</a></li>
              <li><a href="#legacy" className="nav-link" onClick=${() => setMobileNavOpen(false)}>${t.navLegacy}</a></li>
              <li><a href="#sources" className="nav-link" onClick=${() => setMobileNavOpen(false)}>${t.navSources}</a></li>
            </ul>

            
            <div className="nav-actions">
              <div className="lang-switcher" role="group" aria-label="Тіл таңдау">
                <button
                  type="button"
                  className=${`lang-btn ${lang === 'kk' ? 'active' : ''}`}
                  onClick=${() => changeLang('kk')}
                  title="Қазақ тілі"
                >
                  ҚАЗ
                </button>
                <button
                  type="button"
                  className=${`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                  onClick=${() => changeLang('ru')}
                  title="Русский язык"
                >
                  РУС
                </button>
                <button
                  type="button"
                  className=${`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick=${() => changeLang('en')}
                  title="English language"
                >
                  ENG
                </button>
              </div>

              
              <button
                type="button"
                className="btn-nav-action btn-nav-pres"
                onClick=${() => {
                  setIsPresentationOpen(true);
                  setTimerRunning(true);
                }}
                title=${t.btnPresentation}
              >
                <span>🎙️</span>
                <span className="hidden sm:inline">${t.btnPresentation}</span>
              </button>

              
              <button
                type="button"
                className="btn-nav-action btn-nav-print"
                onClick=${() => window.print()}
                title=${t.btnPrint}
              >
                <span>🖨️</span>
                <span className="hidden md:inline">${t.btnPrint}</span>
              </button>

              
              <button
                type="button"
                className="btn-nav-action btn-nav-print"
                onClick=${() => setIsOutlineOpen(true)}
                title=${t.btnSpeechOutline}
              >
                <span>📋</span>
              </button>

              
              <button
                type="button"
                className="mobile-menu-btn"
                onClick=${() => setMobileNavOpen(!mobileNavOpen)}
                aria-label="Мәзірді ашу"
              >
                ☰
              </button>
            </div>
          </div>
        </header>

        
        <main className="content-wrapper">
          
          
          
          <section id="hero" className="hero-section">
            <div className="hero-text-col">
              <div className="hero-conference-tag">
                <span>✦</span>
                <span>${t.conferenceBadge}</span>
              </div>

              <h1 className="hero-title">${DATA.hero.name[lang]}</h1>
              <p className="hero-subtitle">«${t.siteSubtitle}»</p>
              <div className="hero-dates-badge">${DATA.hero.dates}</div>

              <p className="hero-lead">${DATA.hero.lead[lang]}</p>

              <div className="hero-buttons">
                <a href="#mission" className="btn-primary">
                  <span>${t.btnExplore}</span>
                  <span>↓</span>
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick=${() => {
                    setIsPresentationOpen(true);
                    setTimerRunning(true);
                  }}
                >
                  <span>🎙️</span>
                  <span>${t.btnPresentation}</span>
                </button>
              </div>
            </div>

            
            <div className="hero-portrait-wrapper">
              <div className="portrait-frame">
                <div className="portrait-inner">
                  <img
                    src="ermekov_ehistory.jpg"
                    alt=${DATA.hero.name[lang]}
                    className="portrait-img"
                    loading="eager"
                  />
                  <div className="portrait-caption">
                    <p className="portrait-caption-name">${DATA.hero.name[lang]}</p>
                    <p className="portrait-caption-meta">
                      ${lang === 'kk' && 'Мұрағаттық тарихи фотосурет (1920 жж.)'}
                      ${lang === 'ru' && 'Подлинный архивный фотопортрет (1920-е гг.)'}
                      ${lang === 'en' && 'Authentic archival historical portrait (1920s)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="hero-counters-grid">
              ${DATA.hero.stats.map(
                (stat) => html`
                  <div key=${stat.num} className="counter-card">
                    <div className="counter-number">${stat.num}</div>
                    <div className="counter-label">${stat.label[lang]}</div>
                    <p className="counter-desc">${stat.desc[lang]}</p>
                  </div>
                `
              )}
            </div>
          </section>

          
          
          
          <section id="mission">
            <div className="section-badge-wrapper">
              <span className="section-badge-text">${t.sectionMissionTag}</span>
            </div>
            <h2 className="section-title">${t.sectionMissionTitle}</h2>
            <p className="section-subtitle">${t.sectionMissionSubtitle}</p>

            
            <div className="mission-quote-banner">
              <p className="mission-quote-text">${DATA.mission.quote[lang]}</p>
              <span style=${{ fontSize: '2.5rem', opacity: 0.35 }}>🇰🇿</span>
            </div>

            
            <div className="map-interaction-container">
              
              <div className="svg-map-wrapper">
                <svg
                  viewBox="0 0 900 550"
                  className="kz-historical-map"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="caspianWater" cx="30%" cy="60%" r="70%">
                      <stop offset="0%" stopColor="#0d3056" />
                      <stop offset="100%" stopColor="#07192f" />
                    </radialGradient>
                  </defs>

                  
                  <path
                    d="M 50,280 C 80,310 90,370 70,440 C 60,490 80,530 110,540 L 40,540 L 40,280 Z"
                    fill="url(#caspianWater)"
                    opacity="0.85"
                  />
                  <text x="70" y="480" fill="#4B6B94" fontSize="13" fontStyle="italic" fontFamily="sans-serif">
                    ${lang === 'kk' ? 'Каспий теңізі' : lang === 'ru' ? 'Каспийское море' : 'Caspian Sea'}
                  </text>

                  
                  <ellipse cx="320" cy="400" rx="40" ry="60" fill="url(#caspianWater)" opacity="0.65" />
                  <text x="295" y="405" fill="#4B6B94" fontSize="11" fontStyle="italic" fontFamily="sans-serif">
                    ${lang === 'kk' ? 'Арал' : lang === 'ru' ? 'Арал' : 'Aral Sea'}
                  </text>

                  
                  
                  
                  <path
                    id="map-caspian"
                    className=${`map-region-path ${selectedRegionId === 'caspian' ? 'active' : ''}`}
                    d="M 110,240 L 190,220 L 250,260 L 260,330 L 230,420 L 160,460 L 120,440 L 100,360 L 110,280 Z"
                    onClick=${() => setSelectedRegionId('caspian')}
                  />

                  
                  <path
                    id="map-kostanay"
                    className=${`map-region-path ${selectedRegionId === 'kostanay' ? 'active' : ''}`}
                    d="M 270,160 L 370,110 L 440,150 L 430,240 L 370,280 L 290,250 Z"
                    onClick=${() => setSelectedRegionId('kostanay')}
                  />

                  
                  <path
                    id="map-akmola"
                    className=${`map-region-path ${selectedRegionId === 'akmola' ? 'active' : ''}`}
                    d="M 440,150 L 530,120 L 590,170 L 570,270 L 480,290 L 430,240 Z"
                    onClick=${() => setSelectedRegionId('akmola')}
                  />

                  
                  <path
                    id="map-semey"
                    className=${`map-region-path ${selectedRegionId === 'semey' ? 'active' : ''}`}
                    d="M 590,170 L 720,160 L 840,240 L 820,330 L 710,340 L 590,280 Z"
                    onClick=${() => setSelectedRegionId('semey')}
                  />

                  
                  <path
                    className="map-region-path"
                    d="M 280,260 L 370,280 L 480,290 L 570,270 L 590,280 L 580,390 L 460,440 L 350,420 L 270,340 Z"
                    style=${{ fill: '#132d4e' }}
                  />

                  
                  <path
                    className="map-region-path"
                    d="M 460,440 L 580,390 L 710,340 L 780,420 L 720,500 L 540,510 L 440,480 Z"
                    style=${{ fill: '#0f2642', strokeDasharray: '4 3' }}
                  />
                  <text x="590" y="460" fill="#5E789B" fontSize="12" fontFamily="sans-serif">
                    ${lang === 'kk' ? 'Түркістан АКСР (1924 ж. бірікті)' : lang === 'ru' ? 'Туркестанская АССР (воссоед. 1924)' : 'Turkestan ASSR (reunited 1924)'}
                  </text>

                  
                  <text x="145" y="340" fill="#E5C378" fontSize="13" fontWeight="bold">
                    ${lang === 'kk' ? 'Каспий / Маңғыстау' : lang === 'ru' ? 'Каспий / Мангышлак' : 'Caspian / Mangystau'}
                  </text>
                  <text x="325" y="190" fill="#E5C378" fontSize="13" fontWeight="bold">
                    ${lang === 'kk' ? 'Қостанай' : lang === 'ru' ? 'Кустанай' : 'Kostanay'}
                  </text>
                  <text x="460" y="210" fill="#E5C378" fontSize="14" fontWeight="bold">
                    ${lang === 'kk' ? 'Ақмола (Астана)' : lang === 'ru' ? 'Акмола (Астана)' : 'Akmola (Astana)'}
                  </text>
                  <text x="645" y="240" fill="#E5C378" fontSize="14" fontWeight="bold">
                    ${lang === 'kk' ? 'Семей / Алтай' : lang === 'ru' ? 'Семипалатинск / Алтай' : 'Semipalatinsk / Altai'}
                  </text>

                  
                  ${DATA.mission.regions.map(
                    (region) => html`
                      <g
                        key=${region.id}
                        className=${`map-pin ${selectedRegionId === region.id ? 'active' : ''}`}
                        transform=${`translate(${region.cx}, ${region.cy})`}
                        onClick=${() => setSelectedRegionId(region.id)}
                      >
                        <circle cx="0" cy="0" r="16" fill="rgba(212, 175, 55, 0.25)" className="animate-ping" />
                        <circle cx="0" cy="0" r="8" fill="#D4AF37" className="pin-circle" />
                        <circle cx="0" cy="0" r="3" fill="#071324" />
                      </g>
                    `
                  )}

                  
                  <g transform="translate(220, 180)">
                    <rect x="-6" y="-6" width="12" height="12" fill="#FFF" stroke="#D4AF37" strokeWidth="2" />
                    <text x="12" y="4" fill="#FFF" fontSize="11" fontWeight="bold">
                      ${lang === 'kk' ? 'Орынбор (1920-25 Астана)' : lang === 'ru' ? 'Оренбург (столица 1920-25)' : 'Orenburg (1920-25 Capital)'}
                    </text>
                  </g>
                </svg>

                
                <div className="map-legend">
                  <div className="legend-item">
                    <div className="legend-color-box" style=${{ background: '#275d9e', border: '1px solid #FFF' }}></div>
                    <span>${t.legendDefended}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color-box" style=${{ background: '#16365c' }}></div>
                    <span>${t.legendTerritory}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color-box" style=${{ background: '#0f2642', border: '1px dashed #D4AF37' }}></div>
                    <span>${t.legendReunited}</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color-box" style=${{ background: '#FFF', border: '1px solid #D4AF37' }}></div>
                    <span>${t.legendCapitals}</span>
                  </div>
                </div>
              </div>

              
              <div className="map-detail-panel">
                <div className="detail-panel-header">
                  <span className="detail-panel-tag">1920 ж. Шекара шешімі</span>
                  <h3 className="detail-panel-title">${activeRegion.title[lang]}</h3>
                  <p style=${{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                    ${activeRegion.territory[lang]}
                  </p>
                </div>

                <div className="detail-section-block">
                  <div className="detail-section-label">
                    <span>⚠️</span>
                    <span>${lang === 'kk' ? 'Тарихи шекаралық дау:' : lang === 'ru' ? 'Территориальный спор:' : 'Territorial dispute:'}</span>
                  </div>
                  <p className="detail-section-text">${activeRegion.dispute[lang]}</p>
                </div>

                <div className="detail-section-block">
                  <div className="detail-section-label">
                    <span>⚖️</span>
                    <span>${lang === 'kk' ? 'Ермековтің ғылыми дәлелдері:' : lang === 'ru' ? 'Аргументы Ермекова у Ленина:' : 'Ermekov’s scientific arguments:'}</span>
                  </div>
                  <p className="detail-section-text">${activeRegion.ermekovArgument[lang]}</p>
                </div>

                <div className="detail-section-block" style=${{ marginBottom: 0 }}>
                  <div className="detail-section-label">
                    <span>🌟</span>
                    <span>${lang === 'kk' ? 'Бүгінгі тарихи маңызы:' : lang === 'ru' ? 'Значение для современного Казахстана:' : 'Significance for modern Kazakhstan:'}</span>
                  </div>
                  <p className="detail-section-text">${activeRegion.modernImpact[lang]}</p>
                </div>
              </div>
            </div>

            
            <div className="chronicle-1920-grid">
              ${DATA.mission.events1920.map(
                (evt, idx) => html`
                  <div key=${idx} className="chronicle-card">
                    <span className="chronicle-date-badge">${evt.date}</span>
                    <h4 className="chronicle-title">${evt.title[lang]}</h4>
                    <p className="chronicle-desc">${evt.desc[lang]}</p>
                  </div>
                `
              )}
            </div>
          </section>

          
          
          
          <section id="science">
            <div className="section-badge-wrapper">
              <span className="section-badge-text">${t.sectionScienceTag}</span>
            </div>
            <h2 className="section-title">${t.sectionScienceTitle}</h2>
            <p className="section-subtitle">${t.sectionScienceSubtitle}</p>

            <div className="science-layout-grid">
              
              <div className="book-showcase-card">
                <span className="section-badge-text" style=${{ marginBottom: '1.25rem' }}>
                  ${t.bookBadge}
                </span>

                
                <div className="book-cover-3d" title="Кітап мазмұнын қарау">
                  <div className="book-spine-line"></div>
                  <div>
                    <p className="book-author-gold">${DATA.science.book.authorOriginal}</p>
                  </div>

                  <div>
                    <h3 className="book-title-gold">${DATA.science.book.titleLatin}</h3>
                    <p className="book-sub-gold">
                      1-bөlіm: Analitikalyq geometrija men differensial jəne integral esepteu negizderi
                    </p>
                  </div>

                  <div className="book-city-year">
                    <p>QYZYLORDA — 1935</p>
                    <p style=${{ fontSize: '0.65rem', opacity: 0.7 }}>QAZAQSTAN BASPASY</p>
                  </div>
                </div>

                
                <div className="book-meta-box">
                  <div className="book-tabs">
                    ${DATA.science.book.chapters.map(
                      (ch) => html`
                        <button
                          key=${ch.num}
                          type="button"
                          className=${`book-tab-btn ${selectedBookChapter === ch.num ? 'active' : ''}`}
                          onClick=${() => setSelectedBookChapter(ch.num)}
                        >
                          ${ch.num}-бөлім: ${ch.name[lang]}
                        </button>
                      `
                    )}
                  </div>

                  ${(() => {
                    const activeCh = DATA.science.book.chapters.find((c) => c.num === selectedBookChapter);
                    return html`
                      <div className="chapter-content-box">
                        <p style=${{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.55' }}>
                          ${activeCh.desc[lang]}
                        </p>
                        <div className="chapter-formula-card">
                          <code>${activeCh.formula}</code>
                        </div>
                      </div>
                    `;
                  })()}

                  <div style=${{ marginTop: '1.25rem', fontSize: '0.78rem', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Таралымы: ${DATA.science.book.printRun}</span>
                    <span>Көлемі: ${DATA.science.book.pages}</span>
                  </div>
                </div>
              </div>

              
              <div className="math-visualizer-card">
                <div className="section-badge-wrapper" style=${{ alignSelf: 'flex-start' }}>
                  <span className="section-badge-text">${t.mathSimTitle}</span>
                </div>
                <p style=${{ fontSize: '0.92rem', color: '#CBD5E1' }}>${t.mathSimDesc}</p>

                
                <div className="canvas-container">
                  <svg viewBox="0 0 500 280" style=${{ width: '100%', height: '100%' }}>
                    
                    <line x1="50" y1="140" x2="450" y2="140" stroke="#1E293B" strokeWidth="1.5" />
                    <line x1="250" y1="20" x2="250" y2="260" stroke="#1E293B" strokeWidth="1.5" />

                    
                    <path d=${integralAreaPath} fill="rgba(212, 175, 55, 0.22)" />

                    
                    <path
                      d=${curvePoints}
                      fill="none"
                      stroke="#E5C378"
                      strokeWidth="2.5"
                    />

                    
                    ${(() => {
                      const px = 250 + mathX * 100;
                      const py = 140 - calcFx(mathX) * 50;
                      const slope = calcDf(mathX);
                      const dx = 60;
                      const dy = slope * (dx / 100) * 50;
                      return html`
                        <g>
                          <line
                            x1=${px - dx}
                            y1=${py + dy}
                            x2=${px + dx}
                            y2=${py - dy}
                            stroke="#38BDF8"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                          />
                          <circle cx=${px} cy=${py} r="6" fill="#FFF" stroke="#D4AF37" strokeWidth="2.5" />
                        </g>
                      `;
                    })()}

                    
                    <text x="360" y="50" fill="#E5C378" fontSize="12" fontFamily="monospace">
                      f(x) = x³ - 2x
                    </text>
                    <text x="360" y="70" fill="#38BDF8" fontSize="11" fontFamily="monospace">
                      Жанама (Tangent)
                    </text>
                  </svg>
                </div>

                
                <div className="math-controls">
                  <div className="math-slider-row">
                    <span style=${{ color: '#E5C378', fontWeight: 600 }}>x = ${mathX.toFixed(2)}</span>
                    <input
                      type="range"
                      min="-1.5"
                      max="1.5"
                      step="0.05"
                      value=${mathX}
                      onInput=${(e) => setMathX(parseFloat(e.target.value))}
                      className="math-slider"
                    />
                  </div>

                  <div className="math-calc-display">
                    <div className="calc-stat-box">
                      <div className="calc-stat-label">
                        ${lang === 'kk' ? 'Функция мәні f(x)' : lang === 'ru' ? 'Значение f(x)' : 'Function f(x)'}
                      </div>
                      <div className="calc-stat-val">${currentFx}</div>
                    </div>
                    <div className="calc-stat-box">
                      <div className="calc-stat-label">
                        ${lang === 'kk' ? 'Туынды f\'(x) (көлбеу)' : lang === 'ru' ? 'Производная f\'(x)' : 'Derivative f\'(x)'}
                      </div>
                      <div className="calc-stat-val">${currentDf}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="terminology-section-card">
              <div className="section-badge-wrapper" style=${{ marginBottom: '0.5rem' }}>
                <span className="section-badge-text">1936 ж. Сөздік-анықтамалық</span>
              </div>
              <h3 style=${{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', color: '#FFF' }}>
                ${DATA.science.terminology.title}
              </h3>
              <p style=${{ color: '#CBD5E1', fontSize: '0.95rem', maxWidth: '850px', marginTop: '0.4rem' }}>
                ${DATA.science.terminology.desc[lang]}
              </p>

              
              <div className="term-search-bar">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder=${t.termSearchPlaceholder}
                  value=${termSearch}
                  onInput=${(e) => setTermSearch(e.target.value)}
                  className="term-search-input"
                />
              </div>

              
              <div className="terminology-grid">
                ${filteredTerms.map(
                  (item, idx) => html`
                    <div key=${idx} className="term-card">
                      <div className="term-header">
                        <h4 className="term-title-kk">${item.termKk}</h4>
                        <div className="term-langs">
                          <span>${item.termRu}</span> • <span>${item.termEn}</span>
                        </div>
                      </div>
                      <p className="term-def">
                        ${lang === 'kk' ? item.defKk : lang === 'ru' ? item.defRu : item.defEn}
                      </p>
                    </div>
                  `
                )}
              </div>
            </div>
          </section>

          
          
          
          <section id="timeline">
            <div className="section-badge-wrapper">
              <span className="section-badge-text">${t.sectionTimelineTag}</span>
            </div>
            <h2 className="section-title">${t.sectionTimelineTitle}</h2>
            <p className="section-subtitle">${t.sectionTimelineSubtitle}</p>

            
            <div className="timeline-filters">
              <button
                type="button"
                className=${`timeline-filter-btn ${timelineFilter === 'all' ? 'active' : ''}`}
                onClick=${() => setTimelineFilter('all')}
              >
                ${t.allFilter}
              </button>
              <button
                type="button"
                className=${`timeline-filter-btn ${timelineFilter === 'state' ? 'active' : ''}`}
                onClick=${() => setTimelineFilter('state')}
              >
                ${t.stateFilter}
              </button>
              <button
                type="button"
                className=${`timeline-filter-btn ${timelineFilter === 'science' ? 'active' : ''}`}
                onClick=${() => setTimelineFilter('science')}
              >
                ${t.scienceFilter}
              </button>
              <button
                type="button"
                className=${`timeline-filter-btn ${timelineFilter === 'repression' ? 'active' : ''}`}
                onClick=${() => setTimelineFilter('repression')}
              >
                ${t.repressionFilter}
              </button>
            </div>

            
            <div className="v-timeline-wrapper">
              <div className="v-timeline-track"></div>

              ${filteredTimeline.map(
                (item, idx) => html`
                  <div key=${idx} className="v-timeline-item">
                    <div className="v-timeline-node"></div>
                    <div className="v-timeline-card">
                      <div className="v-timeline-year">${item.year}</div>
                      <h4 className="v-timeline-title">${item.title[lang]}</h4>
                      <p className="v-timeline-desc">${item.desc[lang]}</p>
                    </div>
                  </div>
                `
              )}
            </div>

            
            <div className="callout-clarification">
              <div className="callout-icon">⚖️</div>
              <div>
                <h4 className="callout-title">${t.yearsClarificationTitle}</h4>
                <p className="callout-text">${t.yearsClarificationText}</p>
              </div>
            </div>
          </section>

          
          
          
          <section id="legacy">
            <div className="section-badge-wrapper">
              <span className="section-badge-text">${t.sectionLegacyTag}</span>
            </div>
            <h2 className="section-title">${t.sectionLegacyTitle}</h2>
            <p className="section-subtitle">${t.sectionLegacySubtitle}</p>

            
            <div className="legacy-formula-box">
              <h3 className="legacy-formula-title">${DATA.legacy.formula[lang]}</h3>
              <p style=${{ fontSize: '1.05rem', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto' }}>
                ${lang === 'kk' && 'Шекарасыз мемлекет болмайды, ал өз ана тіліндегі ғылымсыз ұлт еркін дами алмайды.'}
                ${lang === 'ru' && 'Без признанных границ нет государства, а без науки на родном языке нет подлинного прогресса.'}
                ${lang === 'en' && 'Without secure borders there is no state; without native science there is no true intellectual freedom.'}
              </p>

              
              <div className="legacy-nexus-grid">
                <div className="nexus-pillar-card">
                  <h4 className="nexus-pillar-title">
                    <span>🏛️</span>
                    <span>${DATA.legacy.pillars.statehood.title[lang]}</span>
                  </h4>
                  <ul className="nexus-points-list">
                    ${DATA.legacy.pillars.statehood.points.map(
                      (pt, i) => html`<li key=${i} className="nexus-point-item">${pt[lang]}</li>`
                    )}
                  </ul>
                </div>

                <div className="nexus-pillar-card">
                  <h4 className="nexus-pillar-title">
                    <span>📐</span>
                    <span>${DATA.legacy.pillars.science.title[lang]}</span>
                  </h4>
                  <ul className="nexus-points-list">
                    ${DATA.legacy.pillars.science.points.map(
                      (pt, i) => html`<li key=${i} className="nexus-point-item">${pt[lang]}</li>`
                    )}
                  </ul>
                </div>
              </div>

              
              <div className="legacy-synthesis-box">
                <h4 style=${{ color: '#E5C378', fontSize: '1.1rem', marginBottom: '0.45rem' }}>
                  ${DATA.legacy.pillars.synthesis.title[lang]}
                </h4>
                <p style=${{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: '1.6' }}>
                  ${DATA.legacy.pillars.synthesis.desc[lang]}
                </p>
              </div>

              
              <p className="legacy-quote-final">${DATA.legacy.quote[lang]}</p>
            </div>

            
            <div className="memorial-plaque-grid">
              <div className="plaque-photo-wrapper">
                <img
                  src="ermekov_memorial_plaque.jpg"
                  alt="Әлімхан Ермеков мемориалдық тақтасы"
                  className="plaque-photo-img"
                  loading="lazy"
                />
              </div>

              <div>
                <span className="section-badge-text">
                  ${lang === 'kk' ? 'Тарихи жады' : lang === 'ru' ? 'Историческая память' : 'Historical Memory'}
                </span>
                <h3 style=${{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', color: '#FFF', margin: '0.5rem 0 1rem' }}>
                  ${lang === 'kk' ? 'Қарағанды қаласындағы мемориалдық тақта' : lang === 'ru' ? 'Мемориальная доска в Караганде' : 'Memorial Plaque in Karaganda'}
                </h3>
                <p style=${{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  ${lang === 'kk' && '2020 жылы ғалым тұрған Абай көшесіндегі (бұрынғы Ленин) №58 үйге салтанатты түрде мемориалдық тақта орнатылды. Тақтада: «Бұл үйде ҚАЗАҚ мемлекеттілігінің дамуына өлшеусіз үлес қосқан, мемлекет және қоғам қайраткері, ғалым, математика профессоры ӘЛІМХАН ЕРМЕКОВ тұрған» деп қашалған.'}
                  ${lang === 'ru' && 'В 2020 году на доме № 58 по улице Абая в Караганде была открыта официальная мемориальная доска в честь выдающегося ученого и государственного деятеля, внесшего неоценимый вклад в развитие казахской государственности.'}
                  ${lang === 'en' && 'In 2020, an official memorial plaque was dedicated at 58 Abai Street in Karaganda, commemorating the mathematician and statesman who made an immeasurable contribution to Kazakh statehood.'}
                </p>
                <div style=${{ fontSize: '0.85rem', color: '#E5C378' }}>
                  📍 Қарағанды қ., Абай көшесі 58 • КарТУ бастамасымен
                </div>
              </div>
            </div>
          </section>

          
          
          
          <section id="sources">
            <div className="section-badge-wrapper">
              <span className="section-badge-text">${t.sectionSourcesTag}</span>
            </div>
            <h2 className="section-title">${t.sectionSourcesTitle}</h2>
            <p className="section-subtitle">${t.sectionSourcesSubtitle}</p>

            
            <div className="sources-grid">
              ${DATA.sources.map(
                (src) => html`
                  <div key=${src.id} className="source-card">
                    <div>
                      <span className="source-inst">${src.institution[lang]}</span>
                      <h4 className="source-title">${src.title[lang]}</h4>
                    </div>
                    <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style=${{ fontSize: '0.8rem', color: '#64748B' }}>${src.year}</span>
                      <a
                        href=${src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        <span>Түпнұсқа сілтеме</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                `
              )}
            </div>

            
            <div className="credits-table-box">
              <h4 className="credits-title">
                ${lang === 'kk' ? 'Иллюстрациялар мен құжаттар авторлығы (Image Credits):' : lang === 'ru' ? 'Права на архивные материалы и иллюстрации:' : 'Archival Material & Image Credits:'}
              </h4>
              <ul className="credits-list">
                ${DATA.imageCredits.map(
                  (c, i) => html`
                    <li key=${i}>
                      <strong style=${{ color: '#E5C378' }}>${c.item[lang]}:</strong> ${c.credit}
                    </li>
                  `
                )}
              </ul>
            </div>
          </section>
        </main>

        
        <footer className="site-footer">
          <div className="content-wrapper">
            <p className="footer-quote">«Ұлттық территория — ұлттық мемлекеттіліктің негізі»</p>
            <p className="footer-meta">
              ${t.conferenceBadge} • Әлімхан Ермеков (1891–1970) • Тәуелсіздік пен ғылым мұрасы
            </p>
          </div>
        </footer>

        
        <button
          type="button"
          className=${`btn-back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title=${t.btnBackToTop}
          aria-label=${t.btnBackToTop}
        >
          ▲
        </button>

        
        
        
        ${isPresentationOpen && html`
          <div className="presentation-modal-backdrop" onClick=${() => setIsPresentationOpen(false)}>
            <div className="presentation-stage" onClick=${(e) => e.stopPropagation()}>
              <div className="pres-header">
                <div style=${{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style=${{ color: '#D4AF37', fontWeight: 700 }}>🎙️ ${t.presModeTitle}</span>
                  <div className="pres-timer-box">
                    <span style=${{ fontSize: '0.8rem', color: '#94A3B8' }}>${t.presTimerLabel}</span>
                    <span className="pres-timer-val">${formatTime(timerSeconds)}</span>
                    <button
                      type="button"
                      className="pres-timer-btn"
                      onClick=${() => setTimerRunning(!timerRunning)}
                    >
                      ${timerRunning ? '⏸' : '▶'}
                    </button>
                    <button
                      type="button"
                      className="pres-timer-btn"
                      onClick=${() => setTimerSeconds(240)}
                    >
                      ↺
                    </button>
                  </div>
                </div>

                <div style=${{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style=${{ color: '#94A3B8', fontSize: '0.85rem' }}>
                    ${t.presSlideLabel} ${currentSlide + 1} / ${DATA.presentationSlides.length}
                  </span>
                  <button
                    type="button"
                    className="pres-timer-btn"
                    onClick=${() => setIsPresentationOpen(false)}
                    style=${{ fontSize: '1.25rem' }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              
              ${(() => {
                const slide = DATA.presentationSlides[currentSlide];
                return html`
                  <div className="pres-content-body">
                    <div className="pres-slide-tag">${slide.tag[lang]}</div>
                    <h3 className="pres-slide-title">${slide.title[lang]}</h3>

                    <ul className="pres-bullets-list">
                      ${slide.bullets.map(
                        (b, i) => html`<li key=${i} className="pres-bullet-item">${b[lang]}</li>`
                      )}
                    </ul>

                    
                    <div className="pres-notes-box">
                      <div className="pres-notes-label">${t.presNotesTitle}</div>
                      <p className="pres-notes-text">${slide.notes[lang]}</p>
                    </div>
                  </div>
                `;
              })()}

              
              <div className="pres-footer">
                <button
                  type="button"
                  className="pres-nav-btn"
                  disabled=${currentSlide === 0}
                  onClick=${() => setCurrentSlide((prev) => prev - 1)}
                >
                  ← ${t.presPrev}
                </button>

                <div style=${{ display: 'flex', gap: '0.4rem' }}>
                  ${DATA.presentationSlides.map(
                    (_, i) => html`
                      <button
                        key=${i}
                        type="button"
                        onClick=${() => setCurrentSlide(i)}
                        style=${{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          border: 'none',
                          background: currentSlide === i ? '#D4AF37' : '#334155',
                          cursor: 'pointer'
                        }}
                      />
                    `
                  )}
                </div>

                <button
                  type="button"
                  className="pres-nav-btn"
                  disabled=${currentSlide === DATA.presentationSlides.length - 1}
                  onClick=${() => setCurrentSlide((prev) => prev + 1)}
                >
                  ${t.presNext} →
                </button>
              </div>
            </div>
          </div>
        `}

        
        
        
        ${isOutlineOpen && html`
          <div className="outline-modal-backdrop" onClick=${() => setIsOutlineOpen(false)}>
            <div className="outline-modal-card" onClick=${(e) => e.stopPropagation()}>
              <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style=${{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: '#FFF' }}>
                  📋 ${t.btnSpeechOutline} (3–5 мин)
                </h3>
                <button
                  type="button"
                  onClick=${() => setIsOutlineOpen(false)}
                  style=${{ background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: '1.25rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div>
                ${DATA.presentationOutline[lang].map(
                  (step, i) => html`
                    <div key=${i} className="outline-step-card">
                      <div className="outline-step-title">${step.step}</div>
                      <p className="outline-step-text">${step.text}</p>
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }

  // Mount React Root
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(App));
  }
})();
