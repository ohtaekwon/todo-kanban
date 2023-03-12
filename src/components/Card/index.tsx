import React from "react";
import { useNavigate } from "react-router-dom";
import { TodoCardProps } from "./index.types";

import useAutoHeightTextarea from "hooks/useAutoHeightTextarea";
import useTaskDragAndDrop from "hooks/useTaskDragAndDrop";

import Box from "_common/components/Box";
import Button from "_common/components/Button";
import Textarea from "_common/components/Textarea";
import Text from "_common/components/Text";
import Flex from "_common/components/Flex";

const Card = ({
  index,
  task,
  onDelete: handleDelete,
  onUpdate: handleUpdate,
  onDropHover: handleDropHover,
  children,
}: React.PropsWithChildren<TodoCardProps>) => {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLElement>(
    { task, index: index },
    handleDropHover
  );

  /**
   * text area의 자동 크기 조절 기능을 담당
   */
  const {
    textAreaRef,
    lineHeight,
    checkItemChangeHandler,
    checkItemEnterHandler,
  } = useAutoHeightTextarea();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    handleUpdate(task.id, { ...task, title: newTitle });
    checkItemChangeHandler(e);
  };

  const handleDeleteClick = () => {
    handleDelete(task.id);
  };

  return (
    <Box
      ref={ref}
      as="div"
      variant="gray_200_border"
      role="group"
      position="relative"
      display="flex"
      width="300px"
      height="auto"
      marginTop={20}
      marginBottom={20}
      backgroundColor={task.color}
      cursor="grab"
      opacity={isDragging ? 0.5 : 1}
    >
      <Flex direction="column" width="100%">
        <Box>
          <Button
            aria-label="delete-task"
            variant="tdred_400_fill"
            position="absolute"
            top={0}
            right={0}
            zIndex={100}
            areaLabel="delete"
            onClick={handleDeleteClick}
          >
            {/* <RiDeleteBin6Line /> */}
          </Button>
        </Box>
        <Textarea
          width="100%"
          height={lineHeight * 27 + 150}
          margin="auto"
          textAlign="center"
          paddingBottom={10}
          paddingLeft={10}
          paddingRight={10}
          paddingTop={30}
          fontSize="xxl"
          ref={textAreaRef}
          value={task.title}
          onChange={handleChange}
          onKeyDown={checkItemEnterHandler}
        >
          {task.title}
        </Textarea>
      </Flex>
    </Box>
  );
};
export default Card;
