/**
 * HDA Production - Master Application JavaScript Engine
 * Handles Multi-Page Routing, Poster Carousel, Fullscreen Lightbox Modal, Dynamic Filters, Modals & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initHeroSlider();
  initPosterCarousel();
  initNavigation();
  initModelFilter();
  initDesignerFilter();
  initPortfolioFilter();
  initGalleryFilter();
  initLightbox();
  initBookingModal();
  initVideoModal();
  initBackToTop();
});

/* Header Scroll & Back to Top Controller */
function initHeaderScroll() {
  const header = document.querySelector('.hda-header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* Hero Background Slider */
function initHeroSlider() {
  const sliderSection = document.querySelector('.hero-editorial');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');

  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const INTERVAL = 5000;

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetAutoplay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(i);
      resetAutoplay();
    });
  });

  if (sliderSection) {
    let touchStartX = 0;
    let touchEndX = 0;

    sliderSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAutoplay();
      }
    }

    sliderSection.addEventListener('mouseenter', stopAutoplay);
    sliderSection.addEventListener('mouseleave', startAutoplay);
  }

  slides.forEach((slide) => {
    const styleBg = slide.style.backgroundImage;
    if (styleBg) {
      const match = styleBg.match(/url\(['"]?(.*?)['"]?\)/i);
      if (match && match[1]) {
        const img = new Image();
        img.src = match[1];
      }
    }
  });

  startAutoplay();
}

/* ==================== INDIA FACE 2026 PROMOTIONAL CAROUSEL ==================== */
function initPosterCarousel() {
  const wrapper = document.querySelector('.carousel-wrapper');
  if (!wrapper) return;

  const track = wrapper.querySelector('.carousel-track');
  if (!track) return;
  const slides = Array.from(track.children);
  const prevBtn = wrapper.querySelector('.carousel-arrow.prev');
  const nextBtn = wrapper.querySelector('.carousel-arrow.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Build Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  // Autoplay Loop
  function startAutoplay() {
    if (!autoplayTimer) {
      autoplayTimer = setInterval(nextSlide, 4000);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  wrapper.addEventListener('mouseenter', stopAutoplay);
  wrapper.addEventListener('mouseleave', startAutoplay);

  // Mobile Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;

  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  }

  startAutoplay();
}

/* Multi-Page Routing Engine */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a, .route-btn, .footer-links a');
  const pages = document.querySelectorAll('.hda-page-view');

  const mobileBtn = document.querySelector('.mobile-toggle');
  const navContainer = document.querySelector('.nav-links');
  if (mobileBtn && navContainer) {
    mobileBtn.addEventListener('click', () => {
      navContainer.classList.toggle('active-mobile');
    });
  }

  if (pages.length <= 1) {
    if (pages.length === 1) pages[0].style.display = 'block';
    return;
  }

  function showPage(hash) {
    let targetPageId = hash.replace('#', '').trim() || 'home';
    if (targetPageId === 'booking') targetPageId = 'contact';

    let matched = false;
    pages.forEach(page => {
      if (page.id === `page-${targetPageId}`) {
        page.style.display = 'block';
        matched = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        page.style.display = 'none';
      }
    });

    if (!matched) {
      const homePage = document.getElementById('page-home');
      if (homePage) homePage.style.display = 'block';
    }

    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref && linkHref.replace('#', '') === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('hashchange', () => {
    showPage(window.location.hash);
  });

  if (window.location.hash) {
    showPage(window.location.hash);
  } else {
    showPage('#home');
  }
}

/* Model Roster Filter & Search */
function initModelFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const modelCards = document.querySelectorAll('.model-card-item');
  const searchInput = document.getElementById('modelSearchInput');
  const genderFilter = document.getElementById('modelGenderSelect');

  function filterModels() {
    const activeBtn = document.querySelector('.filter-tab-btn.active');
    const category = activeBtn ? activeBtn.dataset.filter : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    const gender = genderFilter ? genderFilter.value : 'all';

    modelCards.forEach(card => {
      const cardName = (card.dataset.name || '').toLowerCase();
      const cardGender = card.dataset.gender || '';
      const cardCategory = card.dataset.category || '';

      const matchCategory = (category === 'all' || cardCategory.includes(category) || card.classList.contains(`filter-${category}`));
      const matchGender = (gender === 'all' || cardGender === gender);
      const matchSearch = (searchQuery === '' || cardName.includes(searchQuery));

      if (matchCategory && matchGender && matchSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterModels();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterModels);
  if (genderFilter) genderFilter.addEventListener('change', filterModels);
}

/* Designer Filter & Search */
function initDesignerFilter() {
  const searchInput = document.getElementById('designerSearchInput');
  const designerCards = document.querySelectorAll('.designer-card-item');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      designerCards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const brand = (card.dataset.brand || '').toLowerCase();
        if (name.includes(query) || brand.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

/* Portfolio Masonry Filter */
function initPortfolioFilter() {
  const portfolioBtns = document.querySelectorAll('.portfolio-tab-btn, .portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-masonry-item, .portfolio-item-card');

  portfolioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const cat = item.dataset.category || '';
        if (filter === 'all' || cat === filter || cat.includes(filter)) {
          item.style.display = 'flex';
          if (item.classList.contains('portfolio-masonry-item')) item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Dedicated Gallery Category Filter */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter.toLowerCase();

      galleryItems.forEach(item => {
        const itemCat = (item.dataset.category || '').toLowerCase();
        if (filterValue === 'all' || itemCat.includes(filterValue) || filterValue.includes(itemCat)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==================== ADVANCED FULLSCREEN LIGHTBOX MODAL ==================== */
let currentLightboxList = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  if (!lightboxModal) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightbox');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const counterSpan = document.getElementById('lightboxCounter');

  function updateLightboxView() {
    if (!currentLightboxList.length) return;
    const currentItem = currentLightboxList[currentLightboxIndex];

    if (lightboxImg) lightboxImg.src = currentItem.src;
    if (lightboxCaption) lightboxCaption.innerText = currentItem.alt || currentItem.title || 'HDA Production India Face 2026';

    if (counterSpan) {
      const currentNum = String(currentLightboxIndex + 1).padStart(2, '0');
      const totalNum = String(currentLightboxList.length).padStart(2, '0');
      counterSpan.innerText = `${currentNum} / ${totalNum}`;
    }
  }

  function openLightbox(list, index) {
    currentLightboxList = list;
    currentLightboxIndex = index;
    updateLightboxView();
    lightboxModal.classList.add('active');
  }

  function closeLightboxModal() {
    lightboxModal.classList.remove('active');
  }

  function showNext() {
    if (!currentLightboxList.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
    updateLightboxView();
  }

  function showPrev() {
    if (!currentLightboxList.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
    updateLightboxView();
  }

  // Click Trigger Delegate
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger, .gallery-card, .personality-card');
    if (trigger) {
      e.preventDefault();

      // Collect all currently visible triggers for navigation list
      const allTriggers = Array.from(document.querySelectorAll('.lightbox-trigger, .gallery-card, .personality-card'))
        .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);

      const itemsList = allTriggers.map(el => {
        let src = '';
        let alt = '';

        if (el.tagName === 'IMG') {
          src = el.src || el.dataset.full;
          alt = el.alt;
        } else if (el.dataset.img) {
          src = el.dataset.img;
          alt = el.dataset.title || el.querySelector('h3, .personality-name')?.innerText || '';
        } else {
          const imgInside = el.querySelector('img');
          if (imgInside) {
            src = imgInside.src || imgInside.dataset.full;
            alt = imgInside.alt || el.querySelector('h3, .personality-name')?.innerText || '';
          }
        }
        return { src, alt };
      }).filter(item => item.src);

      let targetSrc = '';
      if (trigger.tagName === 'IMG') targetSrc = trigger.src || trigger.dataset.full;
      else if (trigger.dataset.img) targetSrc = trigger.dataset.img;
      else {
        const img = trigger.querySelector('img');
        if (img) targetSrc = img.src || img.dataset.full;
      }

      let clickedIndex = itemsList.findIndex(item => item.src === targetSrc);
      if (clickedIndex === -1) clickedIndex = 0;

      openLightbox(itemsList, clickedIndex);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightboxModal);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightboxModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightboxModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Touch Swipe for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxModal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) showNext();
      else showPrev();
    }
  }, { passive: true });
}

/* Booking & Consultation Modal Suite */
function initBookingModal() {
  const bookingModal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.trigger-booking');
  const closeBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('hdaBookingForm');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceType = btn.dataset.service || 'Fashion Show Production';
      const serviceSelect = document.getElementById('bookingService');
      if (serviceSelect) serviceSelect.value = serviceType;
      if (bookingModal) bookingModal.classList.add('active');
    });
  });

  if (closeBtn && bookingModal) {
    closeBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) bookingModal.classList.remove('active');
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Guest';
      const service = document.getElementById('bookingService')?.value || 'India Face 2026 Registration';
      const phone = document.getElementById('clientPhone')?.value || '';
      const date = document.getElementById('eventDate')?.value || '';
      const notes = document.getElementById('eventNotes')?.value || '';

      const waMsg = `Hello HDA Production,%0A%0AI would like to register for Mr, Miss, Mrs & Kids India Face 2026 / Booking inquiry:%0A- *Client*: ${encodeURIComponent(name)}%0A- *Service*: ${encodeURIComponent(service)}%0A- *Phone*: ${encodeURIComponent(phone)}%0A- *Date*: ${encodeURIComponent(date)}%0A- *Details*: ${encodeURIComponent(notes)}`;

      alert(`Thank you, ${name}! Your registration enquiry for ${service} has been received. Our team will contact you shortly.`);

      if (bookingModal) bookingModal.classList.remove('active');
      bookingForm.reset();

      window.open(`https://wa.me/918830831086?text=${waMsg}`, '_blank');
    });
  }
}

/* Video Showcase Modal */
function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const openBtns = document.querySelectorAll('.trigger-video');
  const closeBtn = document.getElementById('closeVideoModal');
  const videoIframe = document.getElementById('hdaVideoIframe');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.dataset.video || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      if (videoIframe) videoIframe.src = videoSrc;
      if (videoModal) videoModal.classList.add('active');
    });
  });

  if (closeBtn && videoModal) {
    closeBtn.addEventListener('click', () => {
      if (videoIframe) videoIframe.src = '';
      videoModal.classList.remove('active');
    });
  }
}

/* Global Model Profile Detail Viewer */
function openModelProfile(name, height, measurements, experience, imgSrc) {
  const modal = document.getElementById('modelProfileModal');
  if (!modal) return;
  document.getElementById('modalModelName').innerText = name;
  document.getElementById('modalModelHeight').innerText = height;
  document.getElementById('modalModelMeasurements').innerText = measurements;
  document.getElementById('modalModelExp').innerText = experience;
  document.getElementById('modalModelImg').src = imgSrc;
  modal.classList.add('active');
}

function closeModelProfile() {
  const modal = document.getElementById('modelProfileModal');
  if (modal) modal.classList.remove('active');
}

/* Global Designer Profile Detail Viewer */
function openDesignerProfile(name, brand, spec, bio, exp, imgSrc) {
  const modal = document.getElementById('designerProfileModal');
  if (!modal) return;
  document.getElementById('modalDesignerName').innerText = name;
  document.getElementById('modalDesignerBrand').innerText = brand;
  document.getElementById('modalDesignerSpec').innerText = spec;
  document.getElementById('modalDesignerBio').innerText = bio;
  document.getElementById('modalDesignerExp').innerText = exp;
  document.getElementById('modalDesignerImg').src = imgSrc;
  modal.classList.add('active');
}

function closeDesignerProfile() {
  const modal = document.getElementById('designerProfileModal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initHeroSlider();
  initNavigation();
  initModelFilter();
  initDesignerFilter();
  initPortfolioFilter();
  initLightbox();
  initBookingModal();
  initVideoModal();
  initBackToTop();
});

/* Header Scroll & Back to Top Controller */
function initHeaderScroll() {
  const header = document.querySelector('.hda-header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* Hero Background Slider */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;
  let currentIndex = 0;

  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 5000);
}

/* Multi-Page Routing Engine */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .route-btn, .footer-links a');
  const pages = document.querySelectorAll('.hda-page-view');

  // Mobile menu toggle controller
  const mobileBtn = document.querySelector('.mobile-toggle');
  const navContainer = document.querySelector('.nav-links');
  if (mobileBtn && navContainer) {
    mobileBtn.addEventListener('click', () => {
      navContainer.classList.toggle('active-mobile');
    });
  }

  // Standalone page safety check: do not apply SPA tab hiding if only 1 main page view exists
  if (pages.length <= 1) {
    if (pages.length === 1) {
      pages[0].style.display = 'block';
    }
    return;
  }

  function showPage(hash) {
    let targetPageId = hash.replace('#', '').trim() || 'home';
    
    // Map alias routes if any
    if (targetPageId === 'booking') targetPageId = 'contact';

    let matched = false;
    pages.forEach(page => {
      if (page.id === `page-${targetPageId}`) {
        page.style.display = 'block';
        matched = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        page.style.display = 'none';
      }
    });

    if (!matched) {
      // Default fallback to home
      const homePage = document.getElementById('page-home');
      if (homePage) homePage.style.display = 'block';
    }

    // Update active class on nav links
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref && linkHref.replace('#', '') === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Handle hash changes
  window.addEventListener('hashchange', () => {
    showPage(window.location.hash);
  });

  // Initial load
  if (window.location.hash) {
    showPage(window.location.hash);
  } else {
    showPage('#home');
  }
}

/* Model Roster Filter & Search */
function initModelFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const modelCards = document.querySelectorAll('.model-card-item');
  const searchInput = document.getElementById('modelSearchInput');
  const genderFilter = document.getElementById('modelGenderSelect');

  function filterModels() {
    const activeBtn = document.querySelector('.filter-tab-btn.active');
    const category = activeBtn ? activeBtn.dataset.filter : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    const gender = genderFilter ? genderFilter.value : 'all';

    modelCards.forEach(card => {
      const cardName = (card.dataset.name || '').toLowerCase();
      const cardGender = card.dataset.gender || '';
      const cardCategory = card.dataset.category || '';

      const matchCategory = (category === 'all' || cardCategory.includes(category) || card.classList.contains(`filter-${category}`));
      const matchGender = (gender === 'all' || cardGender === gender);
      const matchSearch = (searchQuery === '' || cardName.includes(searchQuery));

      if (matchCategory && matchGender && matchSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterModels();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterModels);
  if (genderFilter) genderFilter.addEventListener('change', filterModels);
}

/* Designer Filter & Search */
function initDesignerFilter() {
  const searchInput = document.getElementById('designerSearchInput');
  const designerCards = document.querySelectorAll('.designer-card-item');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      designerCards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const brand = (card.dataset.brand || '').toLowerCase();
        if (name.includes(query) || brand.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

/* Portfolio Masonry Filter */
function initPortfolioFilter() {
  const portfolioBtns = document.querySelectorAll('.portfolio-tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-masonry-item');

  portfolioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* Image Fullscreen Lightbox */
function initLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightbox');

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-trigger')) {
      e.preventDefault();
      lightboxImg.src = e.target.src || e.target.dataset.full;
      lightboxCaption.innerText = e.target.alt || 'HDA Production Luxury Portfolio';
      lightboxModal.classList.add('active');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }
}

/* Booking & Consultation Modal Suite */
function initBookingModal() {
  const bookingModal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.trigger-booking');
  const closeBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('hdaBookingForm');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceType = btn.dataset.service || 'Fashion Show Production';
      const serviceSelect = document.getElementById('bookingService');
      if (serviceSelect) serviceSelect.value = serviceType;
      bookingModal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) bookingModal.classList.remove('active');
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value;
      const email = document.getElementById('clientEmail').value;
      const phone = document.getElementById('clientPhone').value;
      const service = document.getElementById('bookingService').value;
      const date = document.getElementById('eventDate').value;
      const notes = document.getElementById('eventNotes').value;

      const waMsg = `Hello HDA Production,%0A%0AI would like to submit a luxury booking inquiry:%0A- *Client*: ${encodeURIComponent(name)}%0A- *Service*: ${encodeURIComponent(service)}%0A- *Phone*: ${encodeURIComponent(phone)}%0A- *Date*: ${encodeURIComponent(date)}%0A- *Details*: ${encodeURIComponent(notes)}`;

      alert(`Thank you, ${name}! Your booking enquiry for ${service} has been received. Our executive producer will contact you shortly.`);

      bookingModal.classList.remove('active');
      bookingForm.reset();

      window.open(`https://wa.me/918830831086?text=${waMsg}`, '_blank');
    });
  }
}

/* Video Showcase Modal */
function initVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const openBtns = document.querySelectorAll('.trigger-video');
  const closeBtn = document.getElementById('closeVideoModal');
  const videoIframe = document.getElementById('hdaVideoIframe');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoSrc = btn.dataset.video || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      if (videoIframe) videoIframe.src = videoSrc;
      if (videoModal) videoModal.classList.add('active');
    });
  });

  if (closeBtn && videoModal) {
    closeBtn.addEventListener('click', () => {
      if (videoIframe) videoIframe.src = '';
      videoModal.classList.remove('active');
    });
  }
}

/* Global Model Profile Detail Viewer */
function openModelProfile(name, height, measurements, experience, imgSrc) {
  const modal = document.getElementById('modelProfileModal');
  if (!modal) return;
  document.getElementById('modalModelName').innerText = name;
  document.getElementById('modalModelHeight').innerText = height;
  document.getElementById('modalModelMeasurements').innerText = measurements;
  document.getElementById('modalModelExp').innerText = experience;
  document.getElementById('modalModelImg').src = imgSrc;
  modal.classList.add('active');
}

function closeModelProfile() {
  const modal = document.getElementById('modelProfileModal');
  if (modal) modal.classList.remove('active');
}

/* Global Designer Profile Detail Viewer */
function openDesignerProfile(name, brand, spec, bio, exp, imgSrc) {
  const modal = document.getElementById('designerProfileModal');
  if (!modal) return;
  document.getElementById('modalDesignerName').innerText = name;
  document.getElementById('modalDesignerBrand').innerText = brand;
  document.getElementById('modalDesignerSpec').innerText = spec;
  document.getElementById('modalDesignerBio').innerText = bio;
  document.getElementById('modalDesignerExp').innerText = exp;
  document.getElementById('modalDesignerImg').src = imgSrc;
  modal.classList.add('active');
}

function closeDesignerProfile() {
  const modal = document.getElementById('designerProfileModal');
  if (modal) modal.classList.remove('active');
}
