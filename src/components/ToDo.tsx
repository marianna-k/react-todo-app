import { useReducer } from 'react';
import ToDoForm from "./ToDoForm.tsx";
import TodoList from "./TodoList.tsx";
import type {TodoProps, Action} from "../types.ts";



const todoReducer = (state: TodoProps[], action: Action): TodoProps[] => {
    switch (action.type) {
        // case "ADD":{
        //     const newTodo: TodoProps = {
        //         id: Date.now(),
        //         text: action.payload,
        //     };
        //     return [...state, newTodo];
        // }

        case "ADD" :
            return [
                ...state,
                {
                    id: Date.now(),
                    text: action.payload,
                }
            ]
        case "DELETE":
            return state.filter(todo => todo.id !== action.payload);
        case "EDIT":
            return state.map( todo =>
                todo.id === action.payload.id
                    ? {...todo, text: action.payload.newText}
                    : todo
            );
    }
};

const ToDo = () =>{
    const [todos, dispatch] = useReducer(todoReducer, []);

    return (
        <>
            <div className="max-w-sm mx-auto p-6">
                <h1 className="text-center text-2xl mb-4">To-Do List</h1>
                <ToDoForm dispatch={dispatch} />
                <TodoList todos={todos} dispatch={dispatch} />
            </div>
        </>
    )
};

export default ToDo;