'use client';

import React, { useEffect } from 'react';
import { useBoardStore } from '@/store/BoardStore';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from '@/components/Column';

const Board = () => {
  // const getBoard = useBoardStore((state) => state.getBoard);
  const [getBoard, board, setBoardState, updateTodoInDb] = useBoardStore(
    (state) => [
      state.getBoard,
      state.board,
      state.setBoardState,
      state.updateTodoInDb,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // Check if dropped outside board
    if (!destination) return;
    //#################################################
    // Column dragging
    //#################################################
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
    //#################################################
    // Card dragging
    //#################################################

    // Since indexes as stored as numbers instead of id's with DND library
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };
    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;

    const [todoMoved] = newTodos.splice(source.index, 1);
    // id === inprogress done todo
    if (startCol.id === finishCol.id) {
      // Same col task drag
      newTodos.splice(destination.index, 0, todoMoved);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      // Immutable pattern to avoid changing the object directly
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      // Dragging to different col
      const finishTodos = Array.from(finishCol.todos);
      //  Moving dragged item in destination
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });
      // Update DB
      updateTodoInDb(todoMoved, finishCol.id);
      setBoardState({ ...board, columns: newColumns });

      // // Deleting dragged item froms startCol
      // const startTodos = Array.from(startCol.todos);
      // finishTodos.splice(source.index, 0);
      // console.log('finishTodos', finishTodos);
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
