import { databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand';

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDb: (todo: Todo, ColumnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (newTaskInput: string) => void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);
    //  Delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });
    // Delete imagr from storage
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    //  Delete document
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      todo.$id
    );
  },

  updateTodoInDb: async (todo, ColumnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: ColumnId,
      }
    );
  },
  searchString: '',
  setSearchString: (searchString) => set({ searchString }),
  newTaskInput: '',
  setNewTaskInput: (newTaskInput) => {
    set({ newTaskInput });
  },
}));
