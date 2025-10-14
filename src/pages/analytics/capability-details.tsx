import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useCapabilities } from '../../hooks/useCapabilities';

function CapabilityDetails() {
  const { id } = useParams<{ id: string }>();
  const { useGetCapabilities } = useCapabilities();
  const { data: capabilities = [], isLoading } = useGetCapabilities();
  
  const capability = capabilities.find(cap => cap.id === id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!capability) {
    return <div>Capability not found</div>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {capability.name}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          ID: {capability.id}
        </Typography>
        <Typography variant="body1">
          Edited: {capability.is_edited ? 'Yes' : 'No'}
        </Typography>
      </Box>
    </Box>
  );
}

export default CapabilityDetails;
