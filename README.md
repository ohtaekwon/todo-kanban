# ToDo with Kanban

[Demo페이지 보러가기](https://app.netlify.com/sites/spontaneous-kelpie-b176ff/overview)

## Tech Stack

![https://img.shields.io/badge/Laguage-Typescript-red](https://img.shields.io/badge/Laguage-Typescript-green?logo=Typescript&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-React-green?logo=React&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-ReactDnD-red?logo=ReactDnD&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-useHookTS-red?logo=ReactDnD&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-emotion/resct-yellow?logo=emotion&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-emotion/css-yellow?logo=emotion&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-emotion/styled-yellow?logo=emotion&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-emotion/css-yellow?logo=emotion&logoColor=#377549) ![](https://img.shields.io/badge/Labarary-ReactResponsive-blue?logo=ReactResponsive&logoColor=#377549)

## Custom Hooks

### useLocalStorage

로컬스토리지의 데이터를 GET/SET를 위한 기능과 컬럼들의 CRUD가 발생했을 시, 이벤트가 발생할 경우 해당 값을 동기화할 수 있도록 합니다.

```ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = React.useCallback((): T => {
    // "window is undefined" 에러 방지
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = React.useState<T>(readValue);
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setStoredValue(valueToStore);
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setStoredValue(readValue());
  }, []);

  const handleStorageChange = React.useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  useEventListener("storage", handleStorageChange);
  useEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue] as const;
}
```

### useTaskCollection

처음 페이지에 점속시 기본값의 컬럼 리스트를 저장하도록 합니다.

```ts
function useTaskCollection(key: string) {
  return useLocalStorage<{
    [key in ColumnType]: TaskModel[];
  }>(key, {
    [ColumnType.TO_DO]: [
      {
        id: uuid(),
        column: ColumnType.TO_DO,
        title: "글을 입력 해주세요",
        color: "gray_200",
      },
    ],
    [ColumnType.IN_PROGRESS]: [
      {
        id: uuid(),
        column: ColumnType.IN_PROGRESS,
        title: "글을 입력 해주세요",
        color: "blue_200",
      },
    ],
    [ColumnType.BLOCKED]: [
      {
        id: uuid(),
        column: ColumnType.BLOCKED,
        title: "글을 입력 해주세요",
        color: "red_200",
      },
    ],
    [ColumnType.COMPLETED]: [
      {
        id: uuid(),
        column: ColumnType.COMPLETED,
        title: "글을 입력 해주세요",
        color: "green_200",
      },
    ],
  });
}
```

### useColumnTasks

Todo list에 들어가는 컬럼에 대해서 useCallback을 사용하여 랜더링 최적화화를 하고, CRUD를 위한 기능과 drop과 switching의 return하도록 합니다.

```ts
function useColumnTasks<T>(key: string, column: ColumnType) {
  const [tasks, setTasks] = useTaskCollection(key);
  const columnTasks = tasks[column];

  const addEmptyTask = React.useCallback(() => {
    console.log(`Adding new Empty task to ${column} column`);

    setTasks((allTasks) => {
      const columnTasks = allTasks[column];

      if (columnTasks.length > MAX_TASK_PER_COLUMN) {
        console.log("Task가 너무 많습니다.");
        return allTasks;
      }
      const newStatus = status[column];
      const newColumnTask = {
        id: uuid(),
        title: `${newStatus} 상태의 내용을 적어주세요.`,
        color: pickRandomColor("_500"),
        column,
      };

      return {
        ...allTasks,
        [column]: [newColumnTask, ...columnTasks],
      };
    });
  }, [column, setTasks]);

  const updateTask = React.useCallback(
    (id: TaskModel["id"], updatedTask: Omit<Partial<TaskModel>, "id">) => {
      console.log(`Updating task ${id} with ${JSON.stringify(updatedTask)}`);
      setTasks((allTasks) => {
        const columnTasks = allTasks[column];

        return {
          ...allTasks,
          [column]: columnTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          ),
        };
      });
    },
    [column, setTasks]
  );

  const deleteTask = React.useCallback(
    (id: TaskModel["id"]) => {
      console.log(`Removing task ${id}...`);

      setTasks((allTasks) => {
        const columnTasks = allTasks[column];

        return {
          ...allTasks,
          [column]: columnTasks.filter((task) => task.id !== id),
        };
      });
    },
    [column, setTasks]
  );

  //   handleDrop: (fromColumn: ColumnType, taskId: TaskModel["id"]) => void

  const dropTaskFrom = React.useCallback(
    (from: ColumnType, id: TaskModel["id"]) => {
      setTasks((allTasks) => {
        const fromColumnTasks = allTasks[from];
        const toColumnTasks = allTasks[column];
        const movingTask = fromColumnTasks.find((task) => task.id === id);

        console.log(`Moving task ${movingTask?.id} from ${from} to ${column}`);

        if (!movingTask) return allTasks;

        // 원래의 열(컬럼)에서 작업을 제거하고 대상 열(컬럼)으로 복사
        return {
          ...allTasks,
          [from]: fromColumnTasks.filter((task) => task.id !== id),
          [column]: [{ ...movingTask, column }, ...toColumnTasks],
        };
      });
    },
    [column, setTasks]
  );

  const swapTasks = React.useCallback(
    (i: number, j: number) => {
      console.log(`Swapping task ${i} with ${j} in ${column} column`);

      setTasks((allTasks) => {
        const columnTasks = allTasks[column];

        return {
          ...allTasks,
          [column]: swap(columnTasks, i, j),
        };
      });
    },
    [column, setTasks]
  );
  return {
    tasks: columnTasks,
    addEmptyTask,
    updateTask,
    deleteTask,
    dropTaskFrom,
    swapTasks,
  };
}
```

### useTaskDragAndDrop

컬럼 아이템에 대하여 DnD를 관리하도록 하는 Hook입니다. 서드파티 라이브러리로 react-dnd를 설치한 후, useDrop과 useDrag를 사용하였습니다.

#### 1.useDrag 정리

- const [Collected Props, DragSource Ref, DragPreview Ref] = useDrag(spec, deps)

  1. spec : 사양 개체 또는 사양 개체를 생성하는 함수
  2. deps : 메모이제이션에 사용되는 종속성 배열이며 내장된 useMemo의 React 후크처럼 동작합니다.

- 기본값은 함수 사양의 경우 빈 배열이고 개체 사양의 경우 사양을 포함하는 배열입니다.

  3. Collected Props : 수집 기능에서 수집된 속성을 포함하는 개체로서 함수가 정의 되지 않은 경우 collect빈 객체가 반환됩니다.
  4. DragSource Ref : 드래그 소스에 대한 커넥터 기능으로 DOM의 드래그 가능한 부분에 연결되어야 합니다.
  5. DragPreview Ref: 드래그 프리뷰용 커넥터 기능으로 DOM의 미리보기 부분에 첨부될 수 있습니다.

```ts
function useTaskDragAndDrop<T extends HTMLElement>(
  {
    task,
    index,
  }: {
    task: TaskModel;
    index: number;
  },
  handleDropHover: (i: number, j: number) => void
) {
  const ref = React.useRef<T>(null);
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: ItemType.TASK,
    item: { from: task.column, id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), //isDragging 변수가 현재 드래깅중인지 아닌지를 리턴해주는 부분.
    }),
  });

  const [_, drop] = useDrop<DragItem, void, unknown>({
    accept: ItemType.TASK,
    hover: (item, monitor) => {
      if (!ref.current) return;

      const draggedItemIndex = item.index; // 드래그된 해당 아이템의 인덱스
      const hoveredItemIndex = index; // 위에 올려진 해당 아이템의 인덱스

      if (draggedItemIndex === hoveredItemIndex) return; // 이동하지 않은 경우

      const isDraggedItemAboveHovered = draggedItemIndex < hoveredItemIndex; // 위에 올려질 인덱스가 뒤에 있을 경우
      const isDraggedItemBelowHovered = !isDraggedItemAboveHovered; // 위에 올려질 인덱스가 앞에 있을 경우

      // get 마우스 좌표
      // drag 작업이 진행되는 동안 포인터가 마지막으로 기록된 클라이언트 오프셋을 반환
      // drag 항목이 없으면 null
      const { x, y: mouseY } = monitor.getClientOffset() as XYCoord;

      // get hover한 item의 사각형 경계면
      // getBoundingClientRect | 현재 뷰포트의 브라우저 엘리먼트 좌표 값 구하기
      const hoveredBoundingRect = ref.current.getBoundingClientRect();

      // get hover한 item의 사각형 경계면의 중간 높이
      // (아래값 - 위의 값) / 2 = 중간
      const hoveredMiddleHeight =
        (hoveredBoundingRect.bottom - hoveredBoundingRect.top) / 2;

      // 상대 위치
      const mouseYRelativeToHovered = mouseY - hoveredBoundingRect.top;

      const isMouseYAboveHoveredMiddleHeight =
        mouseYRelativeToHovered < hoveredMiddleHeight;

      const isMouseYBelowHoveredMiddleHeight =
        mouseYRelativeToHovered > hoveredMiddleHeight;

      // 마우스가 항목 높이의 절반을 넘은 경우에만 이동을 수행합니다.
      // 아래로 드래그할 때 커서가 50% 이하일 때만 이동
      // 위로 끌 때 커서가 50% 이상일 때만 이동

      if (isDraggedItemAboveHovered && isMouseYAboveHoveredMiddleHeight) {
        return;
      }

      if (isDraggedItemBelowHovered && isMouseYBelowHoveredMiddleHeight) {
        return;
      }

      // 다 통과되면 실제 작업 실행
      // '드래그된 해당 아이템의 인덱스'와 '위에 올려진 해당 아이템의 인덱스'를 swap
      handleDropHover(draggedItemIndex, hoveredItemIndex);

      // 참고: 여기에서 모니터 항목을 변경하고 있기 때문에
      // 일반적으로 mutation을 피하는 것이 좋지만,
      // 하지만 성능을 위해 여기가 좋다.
      // 이미 인덱스 탐색을 했었기 때문에, 다른 곳에서 할 경우 또다시 인덱스 탐색을 해야하기에
      // 무리한 인덱스 탐색을 피할 수 있다.

      // swap하고 인덱스 덮어쓰기
      item.index = hoveredItemIndex;
    },
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
  };
}
```

### useColumnDrop

Drag한 아이템을 Drop할 때, Drop위치에 따라, Drop이 되어지도록 하며, isOver과 ref를 반환하는 hook 입니다. 같은 위치라면 `!dragItem || dragItem.from === column` 위치가 변하지 않고, Drag한 아이템과 다른 위치라면 `useColumnTasks`의 `dropTaskFrom`을 실행하며,isOver은 드래그 작업이 진행 중이고 포인터가 현재 소유자 위에 있는 경우 boolean값으로 반환합니다.

#### useDrop 정리

- const [collectedProps, DropTarget Ref] = useDrop(specArg, deps?)

  1. spec : 사양 개체 또는 사양 개체를 생성하는 함수
  2. deps : 메모이제이션에 사용되는 종속성 배열이며 내장된 useMemo의 React 후크처럼 동작합니다.

- 기본값은 함수 사양의 경우 빈 배열이고 개체 사양의 경우 사양을 포함하는 배열입니다.

  3. Collected Props : 수집 기능에서 수집된 속성을 포함하는 개체로서 함수가 정의 되지 않은 경우 collect빈 객체가 반환됩니다.
  4. DropTarget Ref : 놓기 대상에 대한 커넥터 기능입니다. DOM의 놓기 대상 부분에 연결되어야 합니다.

#### 보통 사용

- const [collectedProps, drop] = useDrop(() => ({accept}))
  1. accept: 지정한 유형에 대해서 드래그 소스를 반응하도록 함.
  2. drop(item, monitor)? : 호환되는 항목이 대상에 떨어질 때 호출
  3. collect : 구성 요소에 삽입하기 위해 반환할 props의 일반 개체를 반환해야 합니다.

```ts
function useColumnDrop(
  column: ColumnType,
  handleDrop: (fromColumn: ColumnType, taskId: TaskModel["id"]) => void
) {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemType.TASK, // 어떤 소스에서만 반응할지 결정
    drop: (dragItem) => {
      // DragItem의 from과 column의 타입이 같으면
      if (!dragItem || dragItem.from === column) {
        return;
      }
      handleDrop(dragItem.from, dragItem.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return {
    isOver,
    dropRef,
  };
}
```

### useAutoHeightTextarea

Textarea의 크기를 글자가 입력시에 일정 수 이상 넘을 경우 자동으로 크기 증가와 삭제할 경우 크기가 줄어들도록 하는 Hook입니다.

```ts
function useAutoHeightTextarea() {
  // 사용자 입력 저장
  const [checkItemContent, setCheckItemContent] = React.useState("");
  // 줄바꿈 위치를 저장하는 Dictionary
  const [lineBreakIndexDict, setLineBreakIndexDict] = React.useState<any>({});
  // 줄 수 (높이)
  const [lineHeight, setLineHeight] = React.useState(0);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  // 사용자 입력 업데이트 및 줄바꿈 감지
  const checkItemChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCheckItemContent(event.target.value);

    // Scroll이 생기면 line break
    if (event.target.scrollHeight !== event.target.clientHeight) {
      setLineHeight((prev) => prev + 1); // textarea 높이 늘리고
      setLineBreakIndexDict({
        ...lineBreakIndexDict,
        [event.target.value.length - 1]: 1,
      }); // 줄바꿈 위치 저장
    } else {
      // 다시 줄바꿈 지점으로 오면 line break 취소
      if (lineBreakIndexDict[event.target.value.length]) {
        setLineHeight((prev) => prev - 1); // textarea 높이 줄이고
        setLineBreakIndexDict({
          ...lineBreakIndexDict,
          [event.target.value.length]: 0,
        }); // Dictionary에서 삭제
      }
    }
  };

  // 너비 초과로 인한 줄바꿈 말고 사용자가 엔터를 입력했을 때의 줄바꿈 처리
  const checkItemEnterHandler: (e: any) => void = (
    event: React.KeyboardEventHandler<HTMLTextAreaElement>
  ) => {
    if ((event as any).key === "Enter") {
      // textarea 높이는 checkItemChangeHandler에서 변경됨
      setLineBreakIndexDict({
        ...lineBreakIndexDict,
        [(event as any).target.value.length]: 1,
      }); // 줄바꿈 위치 저장
    }
  };

  return {
    textAreaRef,
    lineHeight,
    checkItemEnterHandler,
    checkItemChangeHandler,
  };
}
```

## 참고

- [React DnD](https://react-dnd.github.io/react-dnd/about)
- [useHooks-ts](https://usehooks-ts.com/)
