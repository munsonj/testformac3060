import { useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const client = generateClient<Schema>();

console.log(client);

function App() {
  // const [pets, setPets] = useState<Array<Schema["Pet"]["type"]>>([]);
  // const [appUser, setAppUser] = useState<Schema["User"]["type"] | null>(null);
  // const [version, setVersion] = useState(0);
  
  // useEffect(() => {
  //   client.models.Pet.list().then(({ data }) => {
  //     data ? setPets(data) : null;
  //   });
  // }, [version]);

  const { user:cognitoUser, signOut } = useAuthenticator();

  useEffect(() => {
    console.log(cognitoUser);
    // look up user, or create if not exist
    client.models.User.get({ id: cognitoUser.userId })
    .then(({ data:appUser, errors}) => {
      console.log(appUser, errors);
      if (appUser === null) {
        console.log('creating user')
        // client.models.User.create({id: cognitoUser.userId, givenName: "John", surname: "Doe"})
        // .then(({data:newUser, errors}) => {
        //   console.log(newUser);
        //   setAppUser(newUser);
        //   console.log(errors);
        // });
      } else {
        // setAppUser(appUser);
      }
    });
  }, [cognitoUser])

  // function createPet() {
  //   if (appUser) {
  //     const name = window.prompt("Pet name");
  //     client.models.Pet.create({ name: name, userId: appUser.id })
  //     .then(() => setVersion(version + 1));
  //   }
  // }

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pets
            </Typography>
            <Button color="inherit" onClick={signOut}>Logout</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </Container>
  );
}

export default App;
