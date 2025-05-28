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

  return (
    <main className="mx-auto p-16">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gerenciador de Tarefas
      </h1>

      <Card 
        // className="flex items-start justify-between p-4 shadow-sm"
        className="p-6 shadow-md lg:w-1/2 mx-auto mb-10 lg:h-80 lg:max-h-80"
      >
        {getTodos?.data?.map((todo) => (
          <Todo key={todo.id} todo={todo}/>
        ))}
      </Card>

      <NewTodo />
    </main>
  );
}
