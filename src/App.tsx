import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

console.log(client);

function App() {
  const [pets, setPets] = useState<Array<Schema["Pet"]["type"]>>([]);
  const [appUser, setAppUser] = useState<Schema["User"]["type"] | null>(null);
  const [version, setVersion] = useState(0);

  console.log(appUser);
  console.log(client.models);
  
  useEffect(() => {
    client.models.Pet.list().then(({ data }) => {
      data ? setPets(data) : null;
    });
  }, [version]);

  const { user:cognitoUser, signOut } = useAuthenticator();

  useEffect(() => {
    console.log(cognitoUser);
    // look up user, or create if not exist
    client.models.User.get({ id: cognitoUser.userId })
    .then(({ data:appUser, errors}) => {
      console.log(appUser, errors);
      if (appUser === null) {
        console.log('creating user')
        client.models.User.create({id: cognitoUser.userId, givenName: "John", surname: "Doe"})
        .then(({data:newUser, errors}) => {
          console.log(newUser);
          setAppUser(newUser);
          console.log(errors);
        });
      } else {
        setAppUser(appUser);
      }
    });
  }, [cognitoUser])

  function createPet() {
    if (appUser) {
      const name = window.prompt("Pet name");
      client.models.Pet.create({ name: name, userId: appUser.id })
      .then(() => setVersion(version + 1));
    }
  }

  return (
    <main>
      <h1>My pets</h1>
      <button onClick={createPet}>+ new</button>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name}</li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
