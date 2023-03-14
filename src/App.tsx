import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMediaQuery } from "react-responsive";

import { Layout } from "_common/components/Layout";
import Text from "_common/components/Text";
import Column from "components/Column";
import Grid from "_common/components/Grid";

import { ColumnType } from "types/index.types";
import { ColumnColorSchema } from "types/schema.types";

const App = () => {
  const isMobile = useMediaQuery({
    query: "(min-width:0px) and (max-width:599px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-width:900px)",
  });

  return (
    <Layout id="App" variant="xl" background>
      <Text
        fontSize="xxxl"
        fontWeight={700}
        marginTop={20}
        marginBottom={20}
        paddingTop={20}
        paddingBottom={20}
        textAlign="center"
        color="white"
        style={{ position: "relative", top: 0, width: "100%" }}
      >
        오늘의 ToDo
      </Text>
      <DndProvider backend={HTML5Backend}>
        <Grid
          backgroundColor="transparent"
          gridTemplateColumns={`repeat(${isDesktop ? 4 : 1}, 1fr)`}
          padding="1rem"
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            zIndex: 9,
            paddingBottom: "25%",
          }}
        >
          <ColumList />
        </Grid>
      </DndProvider>
    </Layout>
  );
};

export default App;

const ColumList = () => {
  return (
    <>
      <Column
        column={ColumnType.TO_DO}
        localStorageKey="todayTodo"
        className={`KanBan__${ColumnType.TO_DO}`}
        columnColorSchema={ColumnColorSchema}
        addBtn
      />
      <Column
        column={ColumnType.IN_PROGRESS}
        localStorageKey="todayTodo"
        className={`KanBan__${ColumnType.IN_PROGRESS}`}
        columnColorSchema={ColumnColorSchema}
        addBtn
      />
      <Column
        column={ColumnType.BLOCKED}
        localStorageKey="todayTodo"
        className={`KanBan__${ColumnType.BLOCKED}`}
        columnColorSchema={ColumnColorSchema}
        addBtn
      />
      <Column
        column={ColumnType.COMPLETED}
        localStorageKey="todayTodo"
        className={`KanBan__${ColumnType.COMPLETED}`}
        columnColorSchema={ColumnColorSchema}
        addBtn
      />
    </>
  );
};
