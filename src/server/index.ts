import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";

let todos: { 
  id: number,
  title: string; 
  description: string; 
  creationDate: string; 
  completed: boolean;
}[] = [];

let nextId = 1;

export const appRouter = router({
  
  getTodos: publicProcedure
    .query(() => {
      return todos;
    }),

  addTodo: publicProcedure
    .input(
      z.object({ 
        title: z.string().min(1, "Task's title is obrigatory."), 
        description: z.string() 
      })
    )
    .mutation(({ input }) => {
        const date = new Date();
        const todoDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        
        const todo = { 
          id: nextId++, 
          title: input.title, 
          description: input.description || "", 
          creationDate: todoDate, 
          completed: false 
        };

        todos.push(todo);
        return todo;
    }),

  setDone: publicProcedure
    .input(z.number())
    .mutation(({ input }) => {
      const todo = todos.find(t => t.id === input);

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Couldn't find Task with id ${input}.`,
        });
      }

      todo.completed = !todo.completed;

      return todo;
    }),

  deleteTodo: publicProcedure
    .input(z.number())
    .mutation(({ input }) => {
      const exists = todos.some(t => t.id === input);

      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Couldn't find task with id ${input}.`,
        });
      }

      todos = todos.filter(t => t.id !== input);
      return { success: true };
    }),

    changeTodo: publicProcedure
      .input(z.object({ 
        id: z.number(), 
        title: z.string().min(1, "Title is obrigatory."),
        description: z.string(), 
        creationDate: z.string(), 
        completed: z.boolean() 
      }))
      .mutation(({ input }) => {
        const index = todos.findIndex(todo => todo.id === input.id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Couldn't find task with id ${input}.`,
          });
        }

        todos[index] = {
          id: input.id,
          title: input.title,
          description: input.description,
          creationDate: input.creationDate,
          completed: input.completed,
        };

        return todos[index];
      }),
});

export type AppRouter = typeof appRouter;
