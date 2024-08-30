{
  interface ElementRefs {
    $draggableList: HTMLUListElement;
    $listItmes: NodeListOf<HTMLLIElement>;
  }

  // 초기화 null 체크
  const initElements = (): ElementRefs => {
    const $draggableList = document.getElementById(
      'draggable-list',
    ) as HTMLUListElement;

    if (!$draggableList) {
      throw new Error('Required elements are missing in the DOM');
    }

    const $listItmes = $draggableList.querySelectorAll('li');
    return { $draggableList, $listItmes };
  };

  const refs = initElements();

  const handleDragStart = (e: DragEvent) => {
    const dragItem = (e.target as HTMLElement).closest('li');
    if (dragItem) dragItem.classList.add('dragging');
  };

  const handleDragEnd = () => {
    refs.$listItmes.forEach((item) => item.classList.remove('dragging'));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();

    const dragItem = refs.$draggableList.querySelector(
      'li.dragging',
    ) as HTMLLIElement;
    const otherItems = [
      ...refs.$draggableList.querySelectorAll('li:not(.dragging)'),
    ] as HTMLLIElement[];
    const insertPosition = otherItems.find(
      (item) =>
        e.clientY <= item.getBoundingClientRect().top + item.offsetHeight / 2,
    );

    insertPosition
      ? refs.$draggableList.insertBefore(dragItem, insertPosition)
      : refs.$draggableList.appendChild(dragItem); // 마지막 요소로 드래그했을 경우 처리
  };

  const handleDragEnter = (e: DragEvent) => e.preventDefault();

  refs.$draggableList.addEventListener('dragstart', handleDragStart);
  refs.$draggableList.addEventListener('dragend', handleDragEnd);
  refs.$draggableList.addEventListener('dragover', handleDragOver);
  refs.$draggableList.addEventListener('dragenter', handleDragEnter);
}
