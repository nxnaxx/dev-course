const $openModalBtn = document.getElementById('open-modal-btn');
const $closeModalBtn = document.getElementById('close-modal-btn');
const $addCardBtn = document.getElementById('add-btn');
const $question = document.getElementById('question-input');
const $answer = document.getElementById('answer-input');
const $validation = document.getElementById('validation');
const $cardList = document.getElementById('card-list');
const $clearBtn = document.getElementById('clear-btn');
const $prevBtn = document.getElementById('prev-btn');
const $nextBtn = document.getElementById('next-btn');
let cards = JSON.parse(localStorage.getItem('cards')) || [];
let activeCard;
let activeIndex;

// modal 토글
const toggleModal = () => {
  const $modal = document.getElementById('modal-con');
  $modal.classList.toggle('open');

  // modal open 시 스크롤 방지
  const isOpened = $modal.className.includes('open');
  document.documentElement.style.overflow = isOpened ? 'hidden' : '';

  // 추가하기 버튼 클릭 이전에 modal 닫을 시, 입력 값 초기화
  $question.value = '';
  $answer.value = '';
};

// localStorage 저장
const saveToLocalStorage = () => {
  localStorage.setItem('cards', JSON.stringify(cards));
};

// 카드 생성
const createCard = (data, idx) => {
  const isFirst = idx === 0; // 첫 번째 카드인지 여부 확인
  const fragment = document.createDocumentFragment();
  const newCard = document.createElement('li');

  newCard.className = `card ${isFirst ? 'active' : 'next'}`;
  newCard.setAttribute('data-num', data.id);
  newCard.innerHTML = `
          <span>클릭하면 뒤집혀요</span>
          <p class="card-front"><span>${data.question}</span></p>
          <p class="card-back"><span>${data.answer}</span><i id="delete-btn" class="fa-solid fa-trash-can"></i></p>
        `;
  fragment.appendChild(newCard);
  $cardList.appendChild(fragment);
  activeCard = $cardList.querySelector('.active');
};

// pagination 생성 및 변경
const pagination = () => {
  const $pages = document.getElementById('pages');
  $pages.innerHTML = `${activeIndex + 1} / ${cards.length}`;
};

// 카드 추가
const addCard = () => {
  // 질문 또는 답변 중 하나라도 값이 입력되지 않았을 경우 error message 표출
  if (!$question.value || !$answer.value) {
    $validation.classList.add('error');
    !$question.value
      ? $question.classList.add('error')
      : $answer.classList.add('error');
    return;
  }

  const data = {
    id: Date.now(),
    question: $question.value,
    answer: $answer.value,
  };

  // 처음 카드를 등록하는 경우, init card 삭제 후 등록
  if (cards.length === 0) {
    $cardList.innerHTML = '';
    activeIndex = 0;
  }

  cards.push(data);
  createCard(data, cards.length === 1 ? 0 : -1);
  saveToLocalStorage();
  pagination();
  toggleModal();
};

// 카드 내용이 입력되면 textarea, validation error 효과 제거
const validateInput = (e) => {
  if (e.target.value) e.target.classList.remove('error');
  if ($question.value && $answer.value) $validation.classList.remove('error');
};

// 카드 모두 삭제
const clearCards = () => {
  cards = [];
  $cardList.innerHTML = `<li class="card init"><p>새로운 카드를 등록하세요.</p></li>`;
  localStorage.clear();
  activeIndex = -1;
  pagination();
};

// 개별 카드 삭제
const deleteCard = (clickedCard) => {
  const $cardItems = $cardList.querySelectorAll('.card');

  // 하나 남은 카드를 삭제할 경우
  if (activeIndex === 0 && cards.length === 1) return clearCards();

  if (activeIndex === cards.length - 1) {
    $cardItems[activeIndex - 1].className = 'card active';
    cards.pop();
    activeIndex--;
  } else {
    $cardItems[activeIndex + 1].className = 'card active';
    cards = cards.filter((card) => String(card.id) !== clickedCard.dataset.num);
  }

  clickedCard.remove();
  saveToLocalStorage();
  pagination();
};

// 카드 뒤집기 or 새로운 카드 등록
const flipCard = (e) => {
  const initCard = $cardList.querySelector('.init');
  const clickedCard = e.target.closest('.card.active');

  if (initCard) toggleModal();

  if (clickedCard) {
    const deleteButton = e.target.closest('#delete-btn');

    if (deleteButton) deleteCard(clickedCard);
    clickedCard.classList.toggle('on');
  }
};

// 카드 이동
const moveCards = (e) => {
  const $cardItems = $cardList.querySelectorAll('.card');
  const direction = e.currentTarget.id;

  if (direction === 'prev-btn' && activeIndex > 0) {
    $cardItems[activeIndex].className = 'card next';
    $cardItems[activeIndex - 1].className = 'card active';
    activeIndex--;
  }

  if (direction === 'next-btn' && activeIndex < cards.length - 1) {
    $cardItems[activeIndex].className = 'card prev';
    $cardItems[activeIndex + 1].className = 'card active';
    activeIndex++;
  }

  pagination();
};

// 로드 시 카드 표출
const loadCards = () => {
  if (cards.length !== 0) {
    $cardList.innerHTML = '';
    cards.forEach((item, i) => createCard(item, i));
  }
  activeCard = $cardList.querySelector('.active');
  activeIndex = cards.findIndex(
    (card) => String(card.id) === activeCard?.dataset.num,
  );
  pagination();
};

$openModalBtn.addEventListener('click', toggleModal);
$closeModalBtn.addEventListener('click', toggleModal);
$addCardBtn.addEventListener('click', addCard);
$question.addEventListener('input', validateInput);
$answer.addEventListener('input', validateInput);
$cardList.addEventListener('click', flipCard);
$clearBtn.addEventListener('click', clearCards);
$prevBtn.addEventListener('click', moveCards);
$nextBtn.addEventListener('click', moveCards);

loadCards();
