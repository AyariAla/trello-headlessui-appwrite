import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};
// Id reformatting to text
const Column = ({ id, todos, index }: Props) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        //First child of draggable elemnt should be passing through props
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className=''
        >
          <Droppable droppableId={index.toString()} type='card'>
            {(provided, snapshot) => (
              <div
                className={`shadow-sm p-2 rounded-2xl ${
                  snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                }`}
                //card color change on hover
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2>{idToColumnText[id]}</h2>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
