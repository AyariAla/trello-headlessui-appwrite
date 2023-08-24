'use client';

import React, { useEffect } from 'react';
import { useBoardStore } from '@/store/BoardStore';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from '@/components/Column';

const Board = () => {
  // const getBoard = useBoardStore((state) => state.getBoard);
  const [getBoard, board] = useBoardStore((state) => [
    state.getBoard,
    state.board,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handOnDragEnd = (result: DropResult) => {};
  return (
    <DragDropContext onDragEnd={handOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
