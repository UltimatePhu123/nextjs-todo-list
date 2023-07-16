import { useSession } from "next-auth/react";
import { useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";

type Todo = RouterOutputs["todo"]["getAll"][0];

const TodoMain = () => {
  const { data: sessionData } = useSession();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [todo, setTodo] = useState<Todo | null>(null);

  const { data: todos, refetch: refetchTodo } = api.todo.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setTodo(todo ?? data[0] ?? null);
      },
    }
  );

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => void refetchTodo(),
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => void refetchTodo(),
  });

  const isCheckedData = api.todo.isCheckedBox.useMutation({
    onSuccess: () => void refetchTodo(),
  });

  return (
    <div className="pl-4 pt-4">
      <form
        className="flex gap-x-5"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            createTodo.mutate({
              title: todoTitle,
              isChecked: isChecked,
            });
            setTodoTitle("");
            setIsChecked(false);
          }
        }}
      >
        <input
          type="text"
          placeholder="New Todo"
          className="input-bordered input input-sm"
          required
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.currentTarget.value)}
        />
        <label className="flex items-center gap-x-2 font-semibold" tabIndex={1}>
          <input
            type="checkbox"
            className="checkbox-primary checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <p>Checked ?</p>
        </label>
      </form>
      <div className="divider w-80"></div>
      <div>
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id} className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="checkbox-secondary checkbox checkbox-sm"
                checked={todo.isChecked}
                onChange={() =>
                  isCheckedData.mutate({
                    id: todo.id,
                    isCheck: !todo.isChecked,
                  })
                }
              />
              <p className={`${todo.isChecked ? "line-through" : ""}`}>
                {todo.title}
              </p>
              <button
                className="btn-warning btn-sm btn"
                onClick={() => deleteTodo.mutate({ id: todo.id })}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default TodoMain;
