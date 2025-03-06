import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

console.log(client);

function App() {
  const [todos, seTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [theUser, setTheUser] = useState<Schema["User"]["type"] | null>(null);

  console.log(theUser);
  
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => seTodos([...data.items]),
    });
  }, []);

  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    console.log(user);
    // look up user, or create if not exist
    client.models.Todo.get({ id: user.userId })
    .then(({ data:appUser, errors}) => {
      console.log(appUser, errors);
      if (appUser === null) {
        console.log('creating user')
        client.models.User.create({id: user.userId, givenName: "John", surname: "Doe"})
        .then(({data, errors}) => {
          console.log(data);
          // setTheUser(data);
          console.log(errors);
        });
      }
    });
  }, [user])

  function createTodo() {
    // client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
