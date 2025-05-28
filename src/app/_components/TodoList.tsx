"use client";
import { useState } from "react";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

export default function TodoList({
  initialTodos
}:{
  initialTodos: Awaited<ReturnType<typeof serverClient["getTodos"]>>
}) {

  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const deleteTodo = trpc.deleteTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  })

  const [content, setContent] = useState("");

  return (
    <div>
      <div>
        <label htmlFor="content">Content</label>
        {getTodos?.data?.map((todo) => (
          <div key={todo.id}>
            <input
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.completed}
              onChange={async () => {
                setDone.mutate(todo.id);
              }}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.title}</label>
            <button
              onClick={() => {
                deleteTodo.mutate(todo.id)
              }}
            >
              Delete Todo
            </button>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="Content">Content</label>
        <input 
          id="content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate({
                title: content,
                description: content
              });
              setContent("");
            }
          }}
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
