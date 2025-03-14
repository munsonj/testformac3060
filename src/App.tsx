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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { PetForm, PetFormFields } from "./PetForm";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { SxProps } from '@mui/system';
import { getUrl } from 'aws-amplify/storage';

const client = generateClient<Schema>();

const fabStyle = {
  position: 'absolute',
  top: 72,
  right: 16,
};
const fabSx = fabStyle as SxProps;

function App() {
  const [pets, setPets] = useState<Array<Schema["Pet"]["type"]>>([]);
  const [photoUrls, setPhotoUrls] = useState<(string | null)[]>([]);
  const [appUser, setAppUser] = useState<Schema["User"]["type"] | null>(null);
  const [version, setVersion] = useState(0);
  const [addPetOpen, setAddPetOpen] = useState(false);
  
  useEffect(() => {
    client.models.Pet.list().then(({ data }) => {
      if (data) {
        setPets(data);
        const urlPromises = data.map(pet => {
          return pet.photofile
          ? getUrl({path:pet.photofile})
          : null
        });
        Promise.all(urlPromises).then(urls => {
          setPhotoUrls(urls.map(url => url ? url.url.toString() : null))
        })
      }
    });
  }, [version]);

  const { user:cognitoUser, signOut } = useAuthenticator();

  useEffect(() => {
    // look up user, and create if they don't exist in my database
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
      if (data.name && data.filename) {
        client.models.Pet.create({ name: data.name, photofile: data.filename, userId: appUser.id })
        .then(() => setVersion(version + 1));
        setAddPetOpen(false);
      } else {
        alert("You must supply a name and photo file")
      }
    } else {
      setAddPetOpen(false);
    }
  }

  const checkedemail = appUser && appUser.email ? appUser.email : "";

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
        <Grid container spacing={2} sx={{m:2}}>
          {pets.map((pet , i) => {
            return (
              <Grid key={pet.id} size={2}>
                <Card>
                  {photoUrls[i]
                  ? <CardMedia
                      sx={{ height: 140 }}
                      image={photoUrls[i]}
                      title={pet.name ? pet.name : "pet name"}
                    />
                  : null}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {pet.name}
                    </Typography>
                  </CardContent>
                </Card>
                
              </Grid>
            )
          })}
          
        </Grid>

      </Box>
      <PetForm open={addPetOpen} handleClose={handleAddPetClose} userId={checkedemail}/>
      <Fab color="secondary" aria-label="add" sx={fabSx} onClick={() => setAddPetOpen(true)}>
        <AddIcon />
      </Fab>
    </>
  );
}

export default App;
