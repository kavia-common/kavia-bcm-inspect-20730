import {
  Checkbox,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

function CustomGroupMultiSelect({
  defaultData,
  list,
  parentList,
  selectedParent,
  parentId,
  selectedItem, 
  setSelectedItem
}: any) {
  const handleChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    console.log(selectedItem,value, "change", event);
    setSelectedItem(typeof value === "string" ? value.split(",") : value);
  };

  const handleCheckboxToggle = (domainName: any) => {
    console.log(domainName,"clicked")
    setSelectedItem((prevSelected:any) => {
      if (prevSelected.includes(domainName)) {
        return prevSelected.filter((item:any) => item !== domainName);
      }
      return [...prevSelected, domainName];
    });
  };
  console.log(selectedItem, "selected");
  return (
    <Select
      fullWidth
      value={selectedItem}
      onChange={handleChange}
      multiple
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => selected.filter((item:any) => item).join(",")}
      disabled={!defaultData}
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
            maxHeight: 300,
            overflowY: "auto",
          },
        },
      }}
    >
      {!defaultData && (
        <MenuItem value="" disabled>
          {parentId === "core_id" ? "Select Domain" : "Select Sub-Domain"}
        </MenuItem>
      )}

      {selectedParent.map((sp: any) => (
        <div key={sp}>
          <ListSubheader
            sx={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
          >
            {sp}
          </ListSubheader>
          {list
            .filter(
              (lis: any) =>
                lis[parentId]  === parentList.find((x: any) => x.name === sp)?.id
            )
            .map((filt: any) => (
              <MenuItem key={filt.id} value={filt.name} onClick={() => handleCheckboxToggle(filt.name)}>
                <Checkbox
                  checked={selectedItem.indexOf(filt.name) > -1}
                />
                <ListItemText primary={filt.name} />
              </MenuItem>
            ))}
        </div>
      ))}
    </Select>
  );
}

export default CustomGroupMultiSelect;
