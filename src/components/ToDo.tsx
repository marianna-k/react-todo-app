import {useEffect, useReducer, useRef} from 'react';
import ToDoForm from "./ToDoForm.tsx";
import TodoList from "./TodoList.tsx";
import type {TodoProps, Action} from "../types.ts";

const getInitialTodos = () => {
    const stored = localStorage.getItem ("todos");  //stored will have as value info of value in storage
    //if we have a value then show it (stored) otherwise return an empty array
    return stored ? JSON.parse(stored) : []; //opposite of stringify is JSON.parse
}

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
                    completed: false,
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

        case "COMPLETE":
                return state.map (todo =>
                todo.id === action.payload ? {...todo, completed: !todo.completed}
                : todo);

        case "CLEAR_ALL":
            return [];

                default:
                    return state;
    }
};

const ToDo = () =>{
    const [todos, dispatch] = useReducer(todoReducer, [], getInitialTodos);
    const inputRef = useRef<HTMLInputElement>(null);

    const totalTasks: number = todos.length; //takes state(todos) and counts length
    const completedTasks: number = todos.filter(t => t.completed).length;//take state and filter it. keep those which are completed
    //it created a new array keeping only those completed and counts how many are completed
    const activeTasks: number = totalTasks - completedTasks; //shows the tasks not completed

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleClearAll = () => {
        dispatch ({type: "CLEAR_ALL"});
        inputRef.current?.focus(); //when click clear button, we focus again on input box
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <div className="max-w-sm mx-auto p-6">
                <h1 className="text-center text-2xl mb-4">To-Do List</h1>
                <ToDoForm dispatch={dispatch} inputRef ={inputRef} />
                <TodoList todos={todos} dispatch={dispatch}  inputRef ={inputRef}/>


                {todos.length > 0 && (
                    //if it is true then show button, if not hide it
                    <>
                        <div className="flex justify-between border-t pt-2 mt-4 text-cf-gray">
                            <span>Total: {totalTasks} </span>
                            <span>Active: {activeTasks} </span>
                            <span>Completed: {completedTasks}</span>
                        </div>
                        <div className= "text-end mt-4">
                            <button onClick ={handleClearAll} className= "bg-cf-dark-red text-white py-2 px-4 rounded">
                                Clear All
                            </button>
                        </div>
                    </>
                )}

            </div>
        </>
    )
};

export default ToDo;