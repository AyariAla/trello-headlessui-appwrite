'use client';

import React, { useEffect } from 'react';
import { useBoardStore } from '@/store/BoardStore';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from '@/components/Column';

const Board = () => {
  // const getBoard = useBoardStore((state) => state.getBoard);
  const [getBoard, board, setBoardState] = useBoardStore((state) => [
    state.getBoard,
    state.board,
    state.setBoardState,
  ]);

  useEffect(() => {
    getBoard();
    // console.log(board);
  }, [getBoard]);

  const handOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // Check if dropped outside board
    if (!destination) return;
    // Handle column drag
    if (type === 'column') {
      const entries = Array.from(board.columns.entries());
      //getting the dropped element from the board
      const [removed] = entries.splice(source.index, 1);
      // replace the pushed element by the dragged element
      entries.splice(destination.index, 0, removed);
      // put the final data in a new board Map
      const rearrangedColumns = new Map(entries);

      setBoardState({ ...board, columns: rearrangedColumns });
    }
    if (type === 'card') {
    }
  };
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
