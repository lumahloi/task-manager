# tRPC endpoints
Below is a list of all available endpoints. All of them share the same base URL: ```http://localhost:3000/api/trpc```.

## 1. getTodos
Return all tasks created.
- Method: ```GET```

### Inputs
None

### Output
```bash
[
  {
    id: number;
    title: string;
    description: string;
    creationDate: string; // format: YYYY/MM/DD
    completed: boolean;
  },
]
```

## 2. addTodo
Create a new task.
- Method: ```POST```

### Inputs
```bash
{
  title: string;         // obrigatory
  description: string;   // optional
}
```

### Output
```bash
{
  id: number;
  title: string;
  description: string;
  creationDate: string; // formato: YYYY/MM/DD
  completed: boolean;   // false por padrão
}

```
⚠️ ```title``` should contain at least 1 character.

## 3. setDone
Toggle task's completion status.
- Method: ```POST```

### Inputs
```bash
  number // task's id
```

### Output
```bash
{
  id: number;
  title: string;
  description: string;
  creationDate: string;
  completed: boolean; // toggled status
}
```
- ```NOT_FOUND```: if task with informed ID wasn't found.

## 4. deleteTodo
Delete task.
- Method: ```POST```

### Inputs
```bash
  number // task's id
```

### Output
```bash
{
  success: true
}
```
- ```NOT_FOUND```: if task with informed ID wasn't found.

## 5. changeTodo
Change task's title and description (if informed).
- Method: ```POST```

### Inputs
```bash
{
  id: number;
  title: string;         // obrigatory
  description: string;
  creationDate: string;  // kept
  completed: boolean;
}
```

### Output
```bash
{
  id: number;
  title: string;
  description: string;
  creationDate: string;
  completed: boolean; 
}
```
- ```NOT_FOUND```: if task with informed ID wasn't found.
⚠️ ```title``` should contain at least 1 character.