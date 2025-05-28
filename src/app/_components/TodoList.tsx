"use client";
import { useState } from "react";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
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
  });

  const changeTodo = trpc.changeTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  return (
    <div>
      <div>
        {getTodos?.data?.map((todo) => (
          <div key={todo.id}>
            <Checkbox
              id={`check-${todo.id}`}
              // type="checkbox"
              checked={!!todo.completed}
              // onChange={async () => {
              //   setDone.mutate(todo.id);
              // }}
              onCheckedChange={() => {
                setDone.mutate(todo.id);
              }}
            />
            {editId === todo.id ? (
              <>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    changeTodo.mutate({
                      id: todo.id,
                      title: editTitle,
                      description: editDescription,
                      creationDate: todo.creationDate,
                      completed: todo.completed,
                    });
                    setEditId(null);
                  }}
                >
                  Confirmar
                </Button>
                <Button variant="outline" onClick={() => setEditId(null)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <label htmlFor={`check-${todo.id}`}>
                  {todo.title} {todo.description}
                </label>
                <Button
                  variant="outline"
                  onClick={() => deleteTodo.mutate(todo.id)}
                >
                  Delete Todo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditId(todo.id);
                    setEditTitle(todo.title);
                    setEditDescription(todo.description);
                  }}
                >
                  Edit Todo
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={async () => {
            if (title.length) {
              addTodo.mutate({
                title: title,
                description: description,
              });
              setTitle("");
              setDescription("");
            }
          }}
        >
          Add Todo
        </Button>
      </div>
    </div>
  );
}
