/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorMessages } from './enums/ErrorMessages';
import { useTodoActions } from './hooks/useTodoActions';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const {
    processingTodoIds,
    deleteSingleTodo,
    deleteCompletedTodos,
    addNewTodo,
    isTodoSubmitting,
    toggleStatusSingleTodo,
    toggleStatusTodos,
    isAllTodosCompleted,
    onUpdateTodo,
    errorMessage,
    setErrorMessage,
  } = useTodoActions(setTodos, setTempTodo);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setTodosLoading(true);
        setErrorMessage(null);
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(ErrorMessages.FetchFailed);
      } finally {
        setTodosLoading(false);
      }
    };

    fetchTodos();
  }, [setErrorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          processingTodoIds={processingTodoIds}
          addNewTodo={addNewTodo}
          isTodoSubmitting={isTodoSubmitting}
          onToggleStatusTodos={toggleStatusTodos}
          isAllTodosCompleted={isAllTodosCompleted}
        />
        {!todosLoading && (
          <>
            <TodoList
              todos={todos}
              filter={filter}
              onDeleteTodo={deleteSingleTodo}
              tempTodo={tempTodo}
              processingTodoIds={processingTodoIds}
              onToggleStatusSingleTodo={toggleStatusSingleTodo}
              onUpdateTodo={onUpdateTodo}
            />

            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                onDeleteCompleted={deleteCompletedTodos}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideError={setErrorMessage}
      />
    </div>
  );
};
