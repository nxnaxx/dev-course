var serviceSwiper = new Swiper('.service-cards', {
  initialSlide: 2,
  centeredSlides: true,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 4800,
    disableOnInteraction: false,
  },
  breakpoints: {
    360: {
      slidesPerView: 1.2,
      spaceBetween: 30,
      centeredSlides: true,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1440: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },
});

let back = document.querySelector('.back');

document.addEventListener('DOMContentLoaded', function () {
  back.classList.add('animation');
  updateSlideIndex(serviceSwiper.realIndex);
});

function updateSlideIndex(index) {
  let slideIndexElement = document.getElementById('slide-index');
  slideIndexElement.textContent = `0${index + 1}`;
}

serviceSwiper.on('slideChange', function () {
  back.classList.remove('animation');
  let offset = back.getBoundingClientRect();
  console.log(offset);
  back.classList.add('animation');
  updateSlideIndex(serviceSwiper.realIndex);
});

// About Us Video Player
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('about-video');
  const playButton = document.getElementById('play-btn');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalDurationDisplay = document.getElementById('total-duration');

  function togglePlayPause() {
    document.getElementById('about-video-container').classList.add('hidden');
    document.getElementById('about-video-control').classList.add('visible');

    if (video.paused) {
      video.play();
      playButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      playButton.classList.add('hidden');
    } else {
      video.pause();
      playButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
      playButton.classList.remove('hidden');
    }
  }

  function updateProgressBar() {
    const current = video.currentTime;
    const duration = video.duration;
    progressBar.value = (current / duration) * 100;
    currentTimeDisplay.textContent = formatTime(current);
  }

  video.addEventListener('loadedmetadata', () => {
    totalDurationDisplay.textContent = formatTime(video.duration);
  });

  progressBar.addEventListener('input', () => {
    const duration = video.duration;
    video.currentTime = (progressBar.value / 100) * duration;
  });

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  playButton.addEventListener('click', togglePlayPause);
  video.addEventListener('timeupdate', updateProgressBar);
});

// Logo Slider
var logoSwiper = new Swiper('.brand-logos', {
  loop: true,
  simulateTouch: false,
  navigation: {
    nextEl: '.logo-button-next',
    prevEl: '.logo-button-prev',
  },
  autoplay: {
    delay: 2800,
    disableOnInteraction: false,
  },
  breakpoints: {
    360: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1440: {
      slidesPerView: 5,
      spaceBetween: 54,
    },
  },
});

// Feedback Slider
var feedbackSwiper = new Swiper('.customer-feedbacks', {
  initialSlide: 2,
  centeredSlides: true,
  loop: true,
  simulateTouch: false,
  navigation: {
    nextEl: '.feedback-button-next',
    prevEl: '.feedback-button-prev',
  },
  breakpoints: {
    360: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 5,
    },
  },
});

// Toggle Side Menu
document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('side-menu-btn');
  const closeBtn = document.getElementById('close-btn');
  const sideMenu = document.getElementById('side-menu');
  const backdrop = document.getElementById('side-menu-backdrop');

  menuBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    sideMenu.classList.toggle('open');
    backdrop.classList.toggle('open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    sideMenu.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  document.addEventListener('click', function (event) {
    if (sideMenu.classList.contains('open')) {
      if (!sideMenu.contains(event.target)) {
        sideMenu.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }
  });

  sideMenu.addEventListener('click', function (event) {
    event.stopPropagation();
  });
});
