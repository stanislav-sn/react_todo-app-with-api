import { FC } from 'react';
import { getPreparedTodos } from '../../utils/getPreparedTodos';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  onDeleteTodo: (todoId: Todo['id']) => Promise<void>;
  tempTodo: Todo | null;
  processingTodoIds: Todo['id'][];
  onToggleStatusSingleTodo: (
    todoId: Todo['id'],
    completed: boolean,
  ) => Promise<void>;
  onUpdateTodo: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  filter,
  onDeleteTodo,
  tempTodo,
  processingTodoIds,
  onToggleStatusSingleTodo,
  onUpdateTodo,
}) => {
  const visibleTodos = getPreparedTodos<Todo>(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isLoading={processingTodoIds.includes(todo.id)}
          onToggleStatusSingleTodo={onToggleStatusSingleTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp-todo"
          todo={tempTodo}
          onDeleteTodo={() => {}}
          isLoading={true}
          onToggleStatusSingleTodo={() => Promise.resolve()}
          onUpdateTodo={() => Promise.resolve()}
        />
      )}
    </section>
  );
};
