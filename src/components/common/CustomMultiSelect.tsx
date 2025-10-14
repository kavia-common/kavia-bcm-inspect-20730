import {
  Checkbox,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

function CustomMultiSelect({ defaultData, list }: any) {
  const [selectedItem, setSelectedItem] = React.useState<any[]>(
    defaultData ? [defaultData] : []
  );
  const handleChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    setSelectedItem(typeof value === "string" ? value.split(",") : value);
  };

  const handleCheckboxToggle = (domainName: any) => {
    setSelectedItem((prevSelected) => {
      if (prevSelected.includes(domainName)) {
        return prevSelected.filter((item) => item !== domainName);
      }
      return [...prevSelected, domainName];
    });
  };
  return (
    <Select
      fullWidth
      value={selectedItem}
      multiple
      onChange={handleChange}
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => selected.join(",")}
      sx={{
        backgroundColor: "#f0f2f5",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "transparent" },
          "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
        },
        "& .MuiInputBase-input": { color: "black" },
      }}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 400,
            overflowY: "auto",
          },
        },
      }}
    >
      {/* Default "Select Business Capability" message when no selection */}
      {!defaultData && (
        <MenuItem value="" disabled>
          Select Business Capability
        </MenuItem>
      )}

      {/* Render each capability directly without any grouping */}
      {list.map((capability: any) => (
        <MenuItem
          key={capability.id}
          value={capability.name}
          onClick={() => handleCheckboxToggle(capability.name)}
        >
          <Checkbox checked={selectedItem.indexOf(capability.name) > -1} />
          {capability.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default CustomMultiSelect;
