import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number | string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  width = 300,
}) => {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      sx={{ width }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={() => onChange('')}
              edge="end"
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default SearchBar;