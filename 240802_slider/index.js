const $slideUl = document.querySelector('.sliderUl');
const $slideItems = document.querySelectorAll('.slider');
const $prevBtn = document.querySelector('.btn.prev');
const $nextBtn = document.querySelector('.btn.next');
const $slideDots = document.querySelector('.slider-dot');

// $slideItems는 NodeList이기 때문에 pop()과 같은 배열 함수를 사용하지 못함
let slideArray = [...$slideItems];
let isAnimating = false;

for (let i = 0; i < $slideItems.length; i++) {
  $slideDots.innerHTML += `<span class='dot${i + 1}'></span>`;
}

const $dots = document.querySelectorAll('.slider-dot > span');

const appendSlides = (arr) => {
  $slideUl.innerHTML = '';
  $slideUl.append(...arr);
};

slideArray.unshift(slideArray.pop());
appendSlides(slideArray);

const activeDots = () => {
  $dots.forEach((dot, i) => {
    const regex = new RegExp(i + 1, 'i');
    dot.style.cssText = regex.test(slideArray[1].outerText)
      ? 'background-color: #060604'
      : 'background-color: #d7fc45';
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const animateSlide = async (seconds) => {
  isAnimating = true;
  await delay(seconds * 1000);
  $slideUl.style.transition = 'none';
  $slideUl.style.transform = `translateX(-33.33%)`;
  appendSlides(slideArray);

  await delay(50);
  $slideUl.style.transition = `transform ${seconds}s ease-in-out`;
  isAnimating = false;
};

const handleButtonClick = async (e) => {
  e.preventDefault();
  if (isAnimating) return;
  const direction = e.currentTarget.className;

  if (direction.includes('prev')) slideArray.unshift(slideArray.pop());
  else slideArray.push(slideArray.shift());

  $slideUl.style.transform = direction.includes('prev')
    ? `translateX(0%)`
    : `translateX(-66.66%)`;

  await animateSlide(0.5);
  activeDots();
};

const handleDotClick = async (index) => {
  if (isAnimating) return;
  const originSlideArray = [...$slideItems];
  const newSlideArray = [
    ...originSlideArray.slice(index - 1),
    ...originSlideArray.slice(0, index - 1),
  ];
  const currentSlide = parseInt(
    slideArray[1].outerText.replace('슬라이드 번호', ''),
  );
  const transSeconds = Math.abs(currentSlide - (index + 1)) === 1 ? 0.5 : 0.4;

  if (index + 1 === currentSlide) return;

  slideArray = newSlideArray;
  $slideUl.style.transform =
    currentSlide > index + 1 ? `translateX(0%)` : `translateX(-66.66%)`;

  await animateSlide(transSeconds);
  activeDots();
};

$prevBtn.addEventListener('click', handleButtonClick);
$nextBtn.addEventListener('click', handleButtonClick);

$dots.forEach((dot, i) => {
  dot.addEventListener('click', () => handleDotClick(i));
});
