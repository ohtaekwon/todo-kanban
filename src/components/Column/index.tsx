import React from "react";
import * as Styled from "./index.styles";

import { LocalStorageColumnProps } from "./index.types";

import useColumnTasks from "hooks/useColumnTasks";
import useColumnDrop from "hooks/useColumnDrop";

import Text from "_common/components/Text";
import Badge from "_common/components/Badge";
import Button from "_common/components/Button";
import Box from "_common/components/Box";
import Flex from "_common/components/Flex";

import Card from "components/Card";
import { TaskModel } from "types/index.types";

const Column = ({
  /**
   *  todo에서 쓰이는 column 컴포넌트
   */
  as = "div",
  localStorageKey,
  className,
  type,
  column,
  columnColorSchema,
  children,
  ...rest
}: React.PropsWithChildren<LocalStorageColumnProps>) => {
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
                variant={columnColorSchema[column]}
                children={column}
                marginBottom={10}
                marginTop={10}
              />
            )}
          </Text>
          {type && (
            <Button
              variant="skyblue_300_fill"
              areaLabel="add-task"
              onClick={addEmptyTask}
            >
              추가하기
            </Button>
          )}
        </Flex>
        <Box
          variant="gray_200_border"
          ref={dropRef}
          width="100%"
          height="100%"
          // height={`calc(100% + 200px)`}
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
