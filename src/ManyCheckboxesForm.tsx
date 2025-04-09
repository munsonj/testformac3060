import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type ManyCheckboxesFormProps = {
  open: boolean;
  handleClose: () => void;
}

const availInit = [
    {day: "Monday", hour: 10, avail: false, id:null},
    {day: "Monday", hour: 11, avail: true, id:"a"},
    {day: "Monday", hour: 14, avail: false, id:null},
    {day: "Friday", hour: 10, avail: true, id:"b"},
    {day: "Friday", hour: 11, avail: false, id:null},
    {day: "Friday", hour: 14, avail: false, id:null},
]

export default function ManyCheckboxesForm({ open, handleClose }: ManyCheckboxesFormProps) {

  const [avail, setAvail] = React.useState(availInit);

  const onChange = (index: number, isChecked: boolean) => {
    // make a copy of avail (useState-generated functions require new objects)
    const newAvail = avail.slice();
    newAvail[index].avail = isChecked;
    setAvail(newAvail);
  }

  const updateAvailability = () => {
    avail.forEach(avl => {
        if (avl.id != null && !avl.avail) {
            console.log("delete object with id " + avl.id);
        } else if (avl.id == null && avl.avail) {
            console.log("insert new object");
        }
    });
  }

  return (
    <Dialog
        open={open}
        onClose={handleClose}
    >
    <DialogTitle>Availability</DialogTitle>
    <DialogContent>
        <FormGroup>
        {avail.map((avl, index) => (
            <FormControlLabel key={index}
                control={<Checkbox checked={avl.avail} 
                onChange={(event) => onChange(index, event.target.checked)}/>} 
                label={avl.day + " " + avl.hour} />          
        ))}
        </FormGroup>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={updateAvailability}>Submit</Button>
    </DialogActions>
    </Dialog>
  );
}
