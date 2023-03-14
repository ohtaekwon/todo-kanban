import React from "react";
import * as Styled from "./index.styles";
import { css } from "@emotion/css";

import { Props } from "./index.types";

import useColumnTasks from "hooks/useColumnTasks";
import useColumnDrop from "hooks/useColumnDrop";

import Text from "_common/components/Text";
import Badge from "_common/components/Badge";
import Button from "_common/components/Button";
import Box from "_common/components/Box";
import Flex from "_common/components/Flex";

import Card from "components/Card";
import { TaskModel } from "types/index.types";
import { status } from "utils/constants";

const Column = ({
  as = "div",
  localStorageKey,
  className,

  column,
  columnColorSchema,
  addBtn,
  children,

  ...rest
}: React.PropsWithChildren<Props>) => {
  const {
    tasks,
    addEmptyTask,
    updateTask,
    deleteTask,
    dropTaskFrom,
    swapTasks,
  } = useColumnTasks(localStorageKey, column);

  const { isOver, dropRef } = useColumnDrop(column, dropTaskFrom);

  const ColumnTasks = tasks.map((task: TaskModel, index: number) => (
    <Card
      key={task.id}
      task={task}
      index={index}
      onDropHover={swapTasks}
      onDelete={deleteTask}
      onUpdate={updateTask}
    />
  ));
  return (
    <>
      <Styled.Wrapper as={as} className={className} {...rest}>
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Text fontSize="md" letterSpacing="3px">
            {columnColorSchema && (
              <Badge
                className="badge"
                width="300px"
                variant={columnColorSchema[column]}
                children={status[column]}
                paddingBottom={20}
                paddingTop={20}
                marginBottom={20}
                style={{
                  fontSize: "2rem",
                  textAlign: "center",
                  borderRadius: "20px",
                }}
              />
            )}
          </Text>
          {addBtn && (
            <Button
              areaLabel="add-task"
              variant="primary"
              onClick={addEmptyTask}
              marginBottom={10}
              width={"50%"}
              height={"50px"}
              fontSize={"xl"}
            >
              추가하기
            </Button>
          )}
        </Flex>
        <Box
          variant="transparent"
          ref={dropRef}
          width="100%"
          display="flex"
          direction="column"
          justifyContent="center"
          alignItems="center"
          opacity={isOver ? 0.85 : 1}
        >
          {ColumnTasks}
        </Box>
      </Styled.Wrapper>
    </>
  );
};
export default Column;
