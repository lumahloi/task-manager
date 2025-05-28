"use client";
import { useState } from "react";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

import { SquarePlus } from "lucide-react";

export default function NewTodo({
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
    onSuccess: () => {
      toast.success("Task successfully created.");
      getTodos.refetch();
    },
    onError: (error) => {
      toast.error("Error in task creation: " + error.message);
    },
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showDialog, setShowDialog] = useState(false);

  const handleAddTodo = () => {
    if (title.trim().length === 0) {
      setShowDialog(true);
    } else {
      addTodo.mutate({ title, description });
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Card className="p-6 shadow-md lg:w-1/2 mx-auto">
      <h2 className="text-xl font-semibold">Create Task</h2>
      <div className="flex justify-between items-end space-x-4 mt-2">
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-2">
            <Label htmlFor="title" className="font-semibold">
              Title
            </Label>
            <span className="text-red-600 ml-1">*</span>
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Finish homework"
            type="text"
            id="title"
            className="w-52"
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="descricao" className="font-semibold mb-2">
            Additional information
          </Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Start on page 87"
            type="text"
            id="descricao"
            className="w-64"
          />
        </div>

        <div className="self-end">
          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <Button variant="default" onClick={handleAddTodo}>
              <SquarePlus />
              Create
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Invalid Operation</AlertDialogTitle>
                <AlertDialogDescription>
                  Add a title to your task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowDialog(false)}>
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
