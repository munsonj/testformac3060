import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from '@aws-amplify/auth';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PetForm, PetFormFields } from "./PetForm";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system';

const client = generateClient<Schema>();

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};
const fabSx = fabStyle as SxProps;

function App() {
  const [pets, setPets] = useState<Array<Schema["Pet"]["type"]>>([]);
  const [appUser, setAppUser] = useState<Schema["User"]["type"] | null>(null);
  const [version, setVersion] = useState(0);
  const [addPetOpen, setAddPetOpen] = useState(false);
  
  useEffect(() => {
    client.models.Pet.list().then(({ data }) => {
      data ? setPets(data) : null;
    });
  }, [version]);

  const { user:cognitoUser, signOut } = useAuthenticator();

  useEffect(() => {
    // look up user, or create if not exist
    client.models.User.get({ id: cognitoUser.userId })
    .then(({ data:appUser }) => {
      if (appUser === null) {
        fetchUserAttributes()
        .then(userAttributes => {
          const createObj = {
            id: cognitoUser.userId, 
            email: userAttributes.email,
            givenName: userAttributes.given_name, 
            familyName: userAttributes.family_mame,
          };
          client.models.User.create(createObj)
          .then(({data:newUser}) => {
            setAppUser(newUser);
          });  
        })
      } else {
        setAppUser(appUser);
      }
    });
  }, [cognitoUser])

  function handleAddPetClose(data : PetFormFields | null) {
    if (appUser && data) {
      client.models.Pet.create({ name: data.name, photofile: data.filename, userId: appUser.id })
      .then(() => setVersion(version + 1));
    }
    setAddPetOpen(false);
  }

  const photoprefix = appUser && appUser.email ? appUser.email : "";

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pets
            </Typography>
            <Button color="inherit" onClick={signOut}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
          {pets.map(pet => {
            return (
              <Grid key={pet.id} size={2}>{pet.name}</Grid>
            )
          })}
          
        </Grid>

      </Box>
      <PetForm open={addPetOpen} handleClose={handleAddPetClose} userId={photoprefix}/>
      <Fab color="secondary" aria-label="add" sx={fabSx} onClick={() => setAddPetOpen(true)}>
        <AddIcon />
      </Fab>

    </>
  );
}

export default App;
