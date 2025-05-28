"use client";
import { useState } from "react";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gerenciador de Tarefas
      </h1>

      <div className="space-y-4 mb-10">
        {getTodos?.data?.map((todo) => (
          <Card
            key={todo.id}
            className="flex items-start justify-between p-4 shadow-sm"
          >
            <div className="flex items-start space-x-4 w-full">
              <Checkbox
                id={`check-${todo.id}`}
                checked={!!todo.completed}
                onCheckedChange={(checked) => {
                  setDone.mutate(todo.id);
                }}
              />

              <div className="flex-1">
                {editId === todo.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Título"
                    />
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Descrição"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="default"
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
                      <Button
                        variant="secondary"
                        onClick={() => setEditId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={`check-${todo.id}`}
                      className="block font-semibold"
                    >
                      {todo.title}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {todo.description}
                    </p>
                  </div>
                )}
              </div>

              {editId !== todo.id && (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTodo.mutate(todo.id)}
                  >
                    Deletar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditId(todo.id);
                      setEditTitle(todo.title);
                      setEditDescription(todo.description);
                    }}
                  >
                    Editar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Nova Tarefa</h2>
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
          />
          <Button
            variant="default"
            onClick={() => {
              if (title.length) {
                addTodo.mutate({ title, description });
                setTitle("");
                setDescription("");
              }
            }}
          >
            Adicionar
          </Button>
        </div>
      </Card>
    </main>
  );
}
