import { useSession } from "next-auth/react"
import { useState } from "react"
import { type RouterOutputs, api } from "~/utils/api"

type Todo = RouterOutputs["todo"]["getAll"][0]

const TodoMain = () => {
    const { data: sessionData } = useSession()
    const [ isChecked, setIsChecked ] = useState<boolean>(false)
    const [ todoTitle, setTodoTitle ] = useState<string>("")
    const [ todo, setTodo ] = useState<Todo | null>(null)

    const { data: todos, refetch: refetchTodo } = api.todo.getAll.useQuery(
        undefined, 
        {
            enabled: sessionData?.user !== undefined, 
            onSuccess: (data) => {
                setTodo(todo ?? data[0] ?? null)
            },
        }
    )

    const createTodo = api.todo.create.useMutation({
        onSuccess: () => void refetchTodo()
    })

    const deleteTodo = api.todo.delete.useMutation({
        onSuccess: () => void refetchTodo()
    })

  return (
    <div className="pt-4 pl-4">
        <form onKeyDown={(e) => {
            if(e.key === "Enter") {
                e.preventDefault();
                createTodo.mutate({
                    isChecked: isChecked,
                    title: todoTitle,
                })
                setTodoTitle("")
                setIsChecked(false)
            }
        }}>
            <input 
                type="text"
                placeholder="New Todo"
                className="input input-bordered input-sm"
                required
                onChange={(e) => setTodoTitle(e.currentTarget.value)}
            />
            <label className="pl-4 font-semibold" tabIndex={0}>
                <input 
                    type="checkbox"
                    className="checkbox-primary checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                /> Checked? 
            </label>
        </form>
        <div className="divider w-80"></div>
        <div>
            <ul>
                {todos?.map((todo) => (
                    <li key={todo.id} className={`${isChecked === true ? "line-through" : ""} `}>
                        <input 
                            type="checkbox"
                            className="checkbox-secondary checkbox-sm checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        {todo.title}
                        <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => deleteTodo.mutate({ id:todo.id })}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}
export default TodoMain