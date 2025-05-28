"use client";
import { useState } from "react";

import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2, Pencil, Check } from "lucide-react";

export default function Todo({
  todo,
}: {
  todo: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>[number];
}) {
  const getTodos = trpc.getTodos.useQuery(undefined, {
    // initialData: todo,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const deleteTodo = trpc.deleteTodo.useMutation({
    onSuccess: () => {
      getTodos.refetch();
      toast.success("Successfully deleted task.");
    },
    onError: (error) => {
      toast.error("Error in task deletion: " + error.message);
    },
  });

  const changeTodo = trpc.changeTodo.useMutation({
    onSuccess: () => {
      toast.success("Successfully edited task.");
      getTodos.refetch();
    },
    onError: (error) => {
      toast.error("Error in task edition: " + error.message);
    },
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  return (
    <div className="flex items-start space-x-4 w-full" key={todo.id}>
      <div className="self-center">
        <Checkbox
          id={`check-${todo.id}`}
          checked={!!todo.completed}
          onCheckedChange={() => {
            setDone.mutate(todo.id);
          }}
        />
      </div>

      <div className="flex-1 self-center">
        <div>
          <label
            htmlFor={`check-${todo.id}`}
            className={`block font-semibold ${
              todo.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {todo.title}
          </label>
          <p
            className={`text-sm ${
              todo.completed
                ? "line-through text-gray-500"
                : "text-muted-foreground"
            }`}
          >
            {todo.description}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2 self-center">
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDialog(true)}
          >
            <Trash2 />
          </Button>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you really wish to delete this task?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  deleteTodo.mutate(todo.id);
                  setShowDialog(false);
                }}
              >
                Yes
              </AlertDialogAction>
              <AlertDialogCancel>No</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditId(todo.id);
                setEditTitle(todo.title);
                setEditDescription(todo.description);
              }}
            >
              <Pencil />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Task</AlertDialogTitle>

              <AlertDialogDescription>
                <div className="space-y-2 flex flex-row justify-between">
                  <div className="flex flex-col self-center w-full">
                    <Label htmlFor="title" className="font-semibold mb-3 mt-5">
                      Title
                    </Label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full mb-5"
                    />
                    <Label htmlFor="title" className="font-semibold mb-3">
                      Additional information
                    </Label>
                    <Input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Additional information"
                      className="w-full mb-5"
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEditId(null)}>
                Back
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (editTitle.trim() === "") {
                    setShowValidationDialog(true);
                    return;
                  }

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
                Confirm editions
                <Check />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog
          open={showValidationDialog}
          onOpenChange={setShowValidationDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Título obrigatório</AlertDialogTitle>
              <AlertDialogDescription>
                Title can't be empty. Please insert a title for your task before saving.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
                Ok
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
