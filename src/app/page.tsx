import { serverClient } from "./_trpc/serverClient";

import TodoList from "./_components/TodoList";

export default async function Home() {
  const todos = await serverClient.getTodos();

  return <div><TodoList initialTodos={todos}/></div>;
}