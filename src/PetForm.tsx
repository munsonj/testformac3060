import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

export type PetFormFields = {
  name: string;
  filename: string;
}

type PetFormProps = {
  open: boolean;
  handleClose: (data: PetFormFields | null) => void;
  userId: string;
}

const processFile = (key: string, file: File, userId: string) => {
  console.log(key);
  return {key: userId + '-' + key, file};
};

export function PetForm({ open, handleClose, userId}: PetFormProps) {

  const [name, setName] = React.useState('');
  const [uploadFilename, setUploadFilename] = React.useState('');

  return (
    <Dialog open={open} onClose={() => handleClose(null)}>
      <DialogTitle>Add your pet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the name of your pet and choose a photo to upload
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)
          }
          sx={{mb: 2}}
        />
        <FileUploader
          acceptedFileTypes={['image/*']}
          path="pictures/"
          maxFileCount={1}
          isResumable
          processFile={({key, file}) => processFile(key, file, userId)}
          onUploadSuccess={({ key }) => key ? setUploadFilename(key): null}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(null)}>Cancel</Button>
        <Button onClick={() => handleClose({name: name, filename: uploadFilename})}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
