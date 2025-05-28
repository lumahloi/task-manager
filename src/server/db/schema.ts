import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from 'drizzle-orm';

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey().notNull(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao"),
  dataCriacao: text("dataCriacao").notNull().default(sql`(current_timestamp)`),
})