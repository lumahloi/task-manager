"use client";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

import { Card } from "@/components/ui/card";

import NewTodo from "./NewTodo";
import Todo from "./Todo";

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

  const sortedTodos = getTodos.data
    ? [
        ...getTodos.data.filter((todo) => !todo.completed),
        ...getTodos.data.filter((todo) => todo.completed),
      ]
    : [];

  return (
    <main className="mx-auto p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Task Manager
      </h1>

      <Card className="p-6 shadow-md lg:w-1/2 mx-auto mb-10 h-80 overflow-y-auto">
        {sortedTodos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </Card>

      <NewTodo />

      <footer>
        <p className="text-center text-xs mt-5">© 2025 Task Manager. All rights reserved. Made by <a href="https://www.github.com/lumahloi" className="font-bold">Lumah Pereira</a>.</p>
      </footer>
    </main>
  );
}
