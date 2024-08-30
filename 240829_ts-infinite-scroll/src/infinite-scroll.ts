{
  interface ElementRefs {
    $postsCon: HTMLUListElement;
    $loader: HTMLDivElement;
    $filter: HTMLInputElement;
  }

  interface Posts {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  const getElement = <T extends HTMLElement>(id: string): T => {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with ID ${id} is missing in the DOM`);
    }
    return element as T;
  };

  // 초기화 null 체크
  const initElements = (): ElementRefs => ({
    $postsCon: getElement<HTMLUListElement>('posts-con'),
    $loader: getElement<HTMLDivElement>('.loader'),
    $filter: getElement<HTMLInputElement>('filter'),
  });

  const wrap = document.querySelector('.wrap');
  const $loader = document.createElement('div');
  $loader.id = 'loader';
  $loader.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
  if (wrap) wrap.appendChild($loader);

  const refs = initElements();

  let limit = 5;
  let page = 1;
  let isLoading = false;
  let currentTerm = '';
  let isCheckingScroll = false;
  let noMore = false;

  const getPosts = async (searchTerm: string = ''): Promise<Posts[]> => {
    let url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`;
    if (searchTerm) url += `&q=${encodeURIComponent(searchTerm)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length === 0) noMore = true; // 데이터가 0일 때
    return data;
  };

  // 스크롤 가능한지 확인하고 필요하면 더 많은 포스트를 로드하는 함수
  const checkScrollable = () => {
    if (isCheckingScroll) return;
    isCheckingScroll = true;

    const checkAndLoad = () => {
      if (
        document.documentElement.scrollHeight <= window.innerHeight &&
        !noMore
      ) {
        newLoading(); // 새로운 포스트 로드
        setTimeout(checkAndLoad, 1500); // 로딩이 완료된 후 다시 체크
      } else isCheckingScroll = false;
    };
    checkAndLoad();
  };

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) newLoading(); // 새로운 데이터 호출
  });

  const showPosts = async () => {
    const posts = await getPosts(currentTerm);

    posts.forEach((post) => {
      const postElm = document.createElement('li');
      postElm.classList.add('post');
      postElm.innerHTML = `
            <span class="post-number">${post.id}</span>
            <div class="post-info">
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
            </div>
            `;
      refs.$postsCon.appendChild(postElm);
    });
    checkScrollable(); // 포스트를 추가한 후 스크롤 가능 여부 확인
  };

  const toggleLoader = (show: boolean) => {
    refs.$loader.classList.toggle('show', show);
  };

  const newLoading = () => {
    if (isLoading) return;
    toggleLoader(true);
    isLoading = true;

    setTimeout(async () => {
      page++;
      await showPosts();
      isLoading = false;
      toggleLoader(false);
    }, 1000);
  };

  const filterPosts = () => {
    const { $filter, $postsCon } = refs;
    const searchTerm = $filter.value.trim();
    if (searchTerm !== currentTerm) {
      currentTerm = searchTerm;
      page = 1;
      $postsCon.innerHTML = '';
      showPosts();
      noMore = true;
    }
  };

  // 입력폼에서 엔터로 마무리 했을 때 검색 함수 시작
  const startFilter = () => {
    refs.$filter.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Enter') filterPosts();
    });
  };

  startFilter();
  showPosts().then(() => {
    checkScrollable();
  });
}
