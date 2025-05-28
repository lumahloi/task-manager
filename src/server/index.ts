import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { todo } from "node:test";

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
        let todoDate = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
        
        const todo = { 
          id: nextId++, 
          title: input.title, 
          description: input.description, 
          creationDate: todoDate, 
          completed: false 
        };

        todos.push(todo);
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

    changeTodo: publicProcedure
      .input(
        z.object({ id: z.number(), title: z.string(), description: z.string(), creationDate: z.string(), completed: z.boolean() })
      )
      .mutation(
        ({input}) => {
          const newTodo = { 
            id: input.id, 
            title: input.title, 
            description: input.description, 
            creationDate: input.creationDate, 
            completed: input.completed 
          };

          todos = todos.map(todo =>
            todo.id === input.id ? newTodo : todo
          )
          
          return true;
        }
      )
    
});

export type AppRouter = typeof appRouter;
