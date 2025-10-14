import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const CustomDeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, onConfirm, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',backgroundColor: '#f8f9fc'  }}>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1D1F20', padding: 0 }}>
          {/* {title} */}
          Delete App Inventory Mapped
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: '#1D1F20' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ padding: '16px', backgroundColor: '#f8f9fc' }}>
        <Typography variant="body1" sx={{ color: '#1D1F20', fontSize: '0.9rem', fontWeight: 500 }}>
          {/* {title} */}
          Delete App Inventory Mapped
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '16px', justifyContent: 'space-between',backgroundColor: '#f8f9fc'  }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#1D1F20',
            borderColor: '#ccc',
            padding: '8px 16px',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            width: '45%',
            '&:hover': {
              backgroundColor: '#155ab0',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '8px 16px',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            width: '45%',
            '&:hover': {
              backgroundColor: '#FF0000',
            },
          }}
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDeleteDialog;
