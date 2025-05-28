CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`descricao` text,
	`dataCriacao` text DEFAULT (current_timestamp) NOT NULL
);
