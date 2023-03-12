import React from "react";
import { Layout } from "_common/components/Layout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Text from "_common/components/Text";
import Column from "components/Column";
import { ColumnType } from "types/index.types";
import { ColumnColorSchema } from "types/schema.types";

const App = () => {
  return (
    <Layout id="App" variant="lg" header>
      <DndProvider backend={HTML5Backend}>
        <Text
          fontSize="lg"
          fontWeight={700}
          textAlign="center"
          style={{ gridArea: "heading", height: "10px" }}
        >
          나의 자소서 목록
        </Text>
        <Column
          column={ColumnType.TO_DO}
          localStorageKey="todayTodo"
          className={`KanBan__${ColumnType.TO_DO}`}
          columnColorSchema={ColumnColorSchema}
          type="localStorage"
        />
        <Column
          column={ColumnType.IN_PROGRESS}
          localStorageKey="todayTodo"
          className={`KanBan__${ColumnType.IN_PROGRESS}`}
          columnColorSchema={ColumnColorSchema}
          type="localStorage"
        />
        <Column
          column={ColumnType.BLOCKED}
          localStorageKey="todayTodo"
          className={`KanBan__${ColumnType.BLOCKED}`}
          columnColorSchema={ColumnColorSchema}
          type="localStorage"
        />
        <Column
          column={ColumnType.COMPLETED}
          localStorageKey="todayTodo"
          className={`KanBan__${ColumnType.COMPLETED}`}
          columnColorSchema={ColumnColorSchema}
          type="localStorage"
        />
      </DndProvider>
    </Layout>
  );
};

export default App;
