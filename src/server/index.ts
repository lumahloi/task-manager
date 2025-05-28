import { z } from "zod";
import { publicProcedure, router } from "./trpc";

let todos: { id: number, title: string; description: string; creationDate: string; completed: boolean }[] = [];
let nextId = 1;

export const appRouter = router({
  
  getTodos: publicProcedure
    .query(() => {
      return todos;
    }),

  addTodo: publicProcedure
    .input(
      z.object({ title: z.string(), description: z.string() })
    )
    .mutation(
      ({ input }) => {
        let date = new Date();
        let todoDate = date.getFullYear() + ' ' + date.getMonth() + ' ' + date.getDate()
        const todo = { id: nextId++, title: input.title, description: input.description, creationDate: todoDate, completed: false };
        return true;
    }),

  setDone: publicProcedure
    .input(
      z.number()
    )
    .mutation(({ input }) => {
      const todo = todos.find(t => t.id === input);
      if (todo) todo.completed = !todo.completed;
      return todo;
    }),

  deleteTodo: publicProcedure
    .input(
      z.number()
    )
    .mutation(
      ({input}) => {
        todos = todos.filter(t => t.id !== input);
        return { success: true };
    }),
    
});

export type AppRouter = typeof appRouter;
