// import React, { useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Select,
//   MenuItem,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
//   SelectChangeEvent,
//   OutlinedInput,
//   ListSubheader,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CustomButton from "./CustomButton";
// import {
//   fetchCorecapability,
//   fetchE2EBusinessProcess,
//   fetchDomain,
//   fetchSubdomain,
//   getCountrys,
//   getRegions,
//   getStatuses,
// } from "apis";

// interface CustomAddDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (data: any[]) => void;
//   data: {
//     businessCapabilityName: string;
//     domain: string;
//     subDomain: string;
//     applicationName: string;
//     E2EBusinessProcess: string;
//     regionName: string;
//     countryName: string;
//     status: string;
//   };
//   onChange: (field: string, value: string) => void;
//   statuses: any[];
// }

// interface Capability {
//   id: string;
//   name: string;
// }

// interface E2EBusinessProcess {
//   id: string;
//   name: string;
// }

// interface Domain {
//   id: string;
//   name: string;
//   core_id: string;
// }

// interface SubDomain {
//   id: string;
//   name: string;
//   domain_id: string;
// }

// interface Region {
//   id: string;
//   name: string;
// }

// interface Country {
//   id: string;
//   name: string;
// }

// interface Status {
//   id: string;
//   name: string;
// }

// const CustomAddDialog: React.FC<CustomAddDialogProps> = ({
//   open,
//   onClose,
//   onSave,
//   data,
//   onChange,
// }) => {
//   console.log("---------------data in CustomAddDialog:", data);
//   const [capabilities, setCapabilities] = React.useState<Capability[]>([]);
//   const [selectedCapability, setSelectedCapability] = React.useState<string>(
//     data.businessCapabilityName || ""
//   );

//   const [E2EBusinessProcess, setE2EBusinessProcess] = React.useState<
//     E2EBusinessProcess[]
//   >([]);
//   const [selectedE2EBusinessProcess, setSelectedE2EBusinessProcess] =
//     React.useState<string>(data.E2EBusinessProcess || "");

//   const [domains, setDomains] = React.useState<any[]>([]);
//   const [selectedDomain, setSelectedDomain] = React.useState<string>(
//     data.domain || ""
//   );

//   const [subDomains, setSubDomains] = React.useState<SubDomain[]>([]);
//   const [selectedSubdomain, setSelectedSubdomain] = React.useState<string>(
//     data.subDomain || ""
//   );

//   const [regions, setRegions] = React.useState<Region[]>([]);
//   const [countries, setCountries] = React.useState<any[]>([]);
//   const [statuses, setStatuses] = React.useState<any[]>([]);
//   const [selectedRegion, setSelectedRegion] = React.useState<string>(
//     data.regionName || ""
//   );
//   const [selectedCountry, setSelectedCountry] = React.useState<string>(
//     data.countryName || ""
//   );

//   const [selectedApplication, setSelectedApplication] = React.useState<string>(
//     data.applicationName || ""
//   );
//   const [selectedStatus, setSelectedStatus] = React.useState<string>(
//     data.status || ""
//   );

//   const [filteredDomains, setFilteredDomains] = React.useState<Domain[]>([]);
//   const [filteredSubDomains, setFilteredSubDomains] = React.useState<
//     SubDomain[]
//   >([]);

//   const handleCapabilityChange = (event: SelectChangeEvent<string>) => {
//     const value = event.target.value;
//     setSelectedCapability(value);
//     // Reset dependent fields when capability changes
//     setSelectedDomain("");
//     setSelectedSubdomain("");
//   };

//   const handleDomainChange = (event: SelectChangeEvent<string>) => {
//     const value = event.target.value;
//     setSelectedDomain(value);
//     // Reset subdomain when domain changes
//     setSelectedSubdomain("");
//   };

//   const handleSubDomainChange = (event: SelectChangeEvent<string>) => {
//     setSelectedSubdomain(event.target.value);
//   };

//   const handleRegionChange = (event: SelectChangeEvent<string>) => {
//     setSelectedRegion(event.target.value);
//   };

//   const handleCountryChange = (event: SelectChangeEvent<string>) => {
//     setSelectedCountry(event.target.value);
//   };

//   const handleE2EChange = (event: SelectChangeEvent<string>) => {
//     setSelectedE2EBusinessProcess(event.target.value);
//   };

//   useEffect(() => {
//     const fetchCapabilities = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const result = await fetchCorecapability(sort);
//         setCapabilities(result);
//       } catch (error) {
//         console.error("Error fetching capabilities:", error);
//       }
//     };

//     const fetchE2EBusinessProcesses = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const result = await fetchE2EBusinessProcess(sort);
//         let selectedId = data.E2EBusinessProcess;
//         if (
//           selectedId &&
//           !result.some(
//             (e2e: E2EBusinessProcess) => e2e.id === data.E2EBusinessProcess
//           )
//         ) {
//           result.push({
//             id: data.E2EBusinessProcess,
//             name: data.E2EBusinessProcess || "Unknown",
//           });
//         }
//         setE2EBusinessProcess(result);
//       } catch (error) {
//         console.error("Error fetching E2eBusinessProcess:", error);
//       }
//     };

//     const fetchDomains = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const domainResult = await fetchDomain(sort);
//         setDomains(domainResult);
//       } catch (error) {
//         console.error("Error fetching domains:", error);
//       }
//     };

//     const fetchSubDomains = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const subDomainResult = await fetchSubdomain(sort);
//         setSubDomains(subDomainResult);
//       } catch (error) {
//         console.error("Error fetching subdomains:", error);
//       }
//     };

//     const fetchRegions = async () => {
//       try {
//         const result = await getRegions();
//         setRegions(Array.isArray(result) ? result : []);
//       } catch (error) {
//         setRegions([]);
//       }
//     };

//     const fetchCountries = async () => {
//       try {
//         const countryResult = await getCountrys();
//         setCountries(countryResult);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//       }
//     };

//     const fetchStatus = async () => {
//       try {
//         const statusResult = await getStatuses();
//         if (!statusResult.includes(data.status)) {
//           statusResult.push(data.status);
//         }
//         setStatuses(statusResult);
//         console.log("status result :", statusResult);
//       } catch (error) {
//         console.error("Error fetching status:", error);
//       }
//     };

//     fetchCapabilities();
//     fetchDomains();
//     fetchSubDomains();
//     fetchE2EBusinessProcesses();
//     fetchRegions();
//     fetchCountries();
//     fetchStatus();
//   }, []);

//   useEffect(() => {
//     const selectedCap = capabilities.find(
//       (cap) => cap.id === selectedCapability
//     );
//     if (selectedCap) {
//       setFilteredDomains(
//         domains.filter((domain) => domain.core_id === selectedCap.id)
//       );
//     } else {
//       setFilteredDomains([]);
//     }
//   }, [selectedCapability, domains, capabilities]);

//   useEffect(() => {
//     const selectedDom = domains.find((dom) => dom.id === selectedDomain);
//     if (selectedDom) {
//       setFilteredSubDomains(
//         subDomains.filter((subDomain) => subDomain.domain_id === selectedDom.id)
//       );
//     } else {
//       setFilteredSubDomains([]);
//     }
//   }, [selectedDomain, subDomains, domains]);

//   const formatAndSave = () => {
//     console.log(
//       selectedCapability,
//       selectedDomain,
//       selectedSubdomain,
//       selectedApplication,
//       selectedRegion,
//       selectedCountry,
//       selectedStatus,
//       selectedE2EBusinessProcess
//     );

//     const selectedCap = capabilities.find(
//       (cap) => cap.id === selectedCapability
//     );
//     const selectedDom = domains.find((dom) => dom.id === selectedDomain);
//     const selectedSubDom = subDomains.find(
//       (sub) => sub.id === selectedSubdomain
//     );
//     const selectedReg = regions.find((reg) => reg.id === selectedRegion);
//     const selectedCoun = countries.find((coun) => coun.id === selectedCountry);
//     const selectedE2E = E2EBusinessProcess.find(
//       (e2e) => e2e.id === selectedE2EBusinessProcess
//     );

//     if (!selectedCap) {
//       console.error("No capability selected");
//       return;
//     }

//     const formattedData: any[] = [
//       {
//         core_id: selectedCapability,
//         domain_id: selectedDomain,
//         subdomain_id: selectedSubdomain,
//         name: selectedApplication,
//         region: selectedRegion,
//         country: selectedCountry,
//         status: selectedStatus,
//         e2e_id: selectedE2EBusinessProcess,
//       },
//     ];

//     onSave(formattedData);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <Box
//         sx={{
//           backgroundColor: "white",
//           color: "black",
//           padding: 2,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <DialogTitle margin={-2} sx={{ fontWeight: "bold", color: "black" }}>
//           Add New Item
//         </DialogTitle>
//         <IconButton onClick={onClose} sx={{ color: "black" }}>
//           <CloseIcon />
//         </IconButton>
//       </Box>
//       <DialogContent dividers sx={{ backgroundColor: "white", color: "black" }}>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Business Capability
//             <span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedCapability}
//             onChange={handleCapabilityChange}
//             displayEmpty
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//             MenuProps={{
//               PaperProps: {
//                 style: {
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select Business Capability
//             </MenuItem>
//             {capabilities.map((capability) => (
//               <MenuItem key={capability.id} value={capability.id}>
//                 {capability.name}
//               </MenuItem>
//             ))}
//           </Select>
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Domain<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedDomain}
//             onChange={handleDomainChange}
//             displayEmpty
//             disabled={!selectedCapability}
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//             MenuProps={{
//               PaperProps: {
//                 style: {
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select Domain
//             </MenuItem>
//             {filteredDomains.map((domain) => (
//               <MenuItem key={domain.id} value={domain.id}>
//                 {domain.name}
//               </MenuItem>
//             ))}
//           </Select>
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Sub-domain<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedSubdomain}
//             onChange={handleSubDomainChange}
//             displayEmpty
//             disabled={!selectedDomain}
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//             MenuProps={{
//               PaperProps: {
//                 style: {
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select Sub-Domain
//             </MenuItem>
//             {filteredSubDomains.map((subDomain) => (
//               <MenuItem key={subDomain.id} value={subDomain.id}>
//                 {subDomain.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {/* Application Text Field */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Application<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <TextField
//             fullWidth
//             value={selectedApplication}
//             onChange={(e) => {
//               setSelectedApplication(e.target.value);
//               onChange("application", e.target.value);
//             }}
//             placeholder="Enter application"
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//           />
//           {/* Region Select */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Region<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedRegion}
//             onChange={handleRegionChange}
//             displayEmpty
//             renderValue={(selected) => {
//               if (!selected) return "Select Region";
//               const region = regions.find((r) => r.id === selected);
//               return region ? region.name : selected;
//             }}
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//             MenuProps={{
//               PaperProps: {
//                 style: {
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select Region
//             </MenuItem>
//             {Array.isArray(regions) &&
//               regions.map((region) => (
//                 <MenuItem key={region.id} value={region.id}>
//                   {region.name}
//                 </MenuItem>
//               ))}
//           </Select>
//           {/* Country Select */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Country<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedCountry}
//             onChange={handleCountryChange}
//             displayEmpty
//             renderValue={(selected) => {
//               if (!selected) return "Select Country";
//               const country = countries.find((c) => c.id === selected);
//               return country ? country.name : selected;
//             }}
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//             MenuProps={{
//               PaperProps: {
//                 style: {
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select Country
//             </MenuItem>
//             {countries.map((country) => (
//               <MenuItem key={country.id} value={country.id}>
//                 {country.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {/* Status Select */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Status<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedStatus}
//             onChange={(e) => {
//               setSelectedStatus(e.target.value);
//               onChange("status", e.target.value);
//             }}
//             displayEmpty
//             renderValue={(selected) => {
//               return selected || "Select Status";
//             }}
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select Status
//             </MenuItem>
//             {statuses.map((status, index) => (
//               <MenuItem key={index} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </Select>
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             E2E Business Process
//             <span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedE2EBusinessProcess}
//             onChange={handleE2EChange}
//             displayEmpty
//             renderValue={(selected) => {
//               if (!selected) return "Select E2E Business Process";
//               const e2e = E2EBusinessProcess.find((e) => e.id === selected);
//               return e2e ? e2e.name : selected;
//             }}
//             sx={{
//               backgroundColor: "#f0f2f5",
//               borderRadius: 1,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "transparent" },
//                 "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
//               },
//               "& .MuiInputBase-input": { color: "black" },
//             }}
//             MenuProps={{
//               PaperProps: {
//                 style: {
//                   maxHeight: 300,
//                   overflowY: "auto",
//                 },
//               },
//             }}
//           >
//             <MenuItem value="" disabled>
//               Select E2E Business Process
//             </MenuItem>
//             {E2EBusinessProcess.map((e2e) => (
//               <MenuItem key={e2e.id} value={e2e.id}>
//                 {e2e.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </Box>
//       </DialogContent>
//       <DialogActions
//         sx={{
//           backgroundColor: "white",
//           padding: "16px",
//           justifyContent: "space-between",
//         }}
//       >
//         <CustomButton
//           title="Cancel"
//           backgroundColor="white"
//           color="black"
//           handleClick={onClose}
//           sx={{
//             color: "#1D1F20",
//             borderColor: "#ccc",
//             padding: "8px 16px",
//             fontWeight: "bold",
//             textTransform: "none",
//             borderRadius: "8px",
//             width: "45%",
//           }}
//         />
//         <CustomButton
//           title="Save"
//           backgroundColor="#1976d2"
//           color="white"
//           handleClick={formatAndSave}
//           sx={{
//             backgroundColor: "#1976d2",
//             color: "white",
//             padding: "8px 16px",
//             fontWeight: "bold",
//             textTransform: "none",
//             borderRadius: "8px",
//             width: "45%",
//             "&:hover": {
//               backgroundColor: "#155ab0",
//             },
//           }}
//         />
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CustomAddDialog;

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  TextField,
  SelectChangeEvent,
  OutlinedInput,
  ListSubheader,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "./CustomButton";
import {
  fetchCorecapability,
  fetchE2EBusinessProcess,
  fetchDomain,
  fetchSubdomain,
  getCountrys,
  getRegions,
  getStatuses,
} from "apis";

interface CustomAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any[]) => void;
  data: {
    businessCapabilityName: string;
    domain: string;
    subDomain: string;
    applicationName: string;
    E2EBusinessProcess: string;
    regionName: string;
    countryName: string;
    status: string;
  };
  onChange: (field: string, value: string) => void;
  statuses: any[];
}

interface Capability {
  id: string;
  name: string;
}

interface E2EBusinessProcess {
  id: string;
  name: string;
}

interface Domain {
  id: string;
  name: string;
  core_id: string;
}

interface SubDomain {
  id: string;
  name: string;
  domain_id: string;
}

interface Region {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

const CustomAddDialog: React.FC<CustomAddDialogProps> = ({
  open,
  onClose,
  onSave,
  data,
  onChange,
}) => {
  console.log("---------------data in CustomAddDialog:", data);
  const [capabilities, setCapabilities] = React.useState<Capability[]>([]);
  const [selectedCapability, setSelectedCapability] = React.useState<string>(
    data.businessCapabilityName || ""
  );

  const [E2EBusinessProcess, setE2EBusinessProcess] = React.useState<
    E2EBusinessProcess[]
  >([]);
  const [selectedE2EBusinessProcess, setSelectedE2EBusinessProcess] =
    React.useState<string>(data.E2EBusinessProcess || "");

  const [domains, setDomains] = React.useState<any[]>([]);
  const [selectedDomain, setSelectedDomain] = React.useState<string>(
    data.domain || ""
  );

  const [subDomains, setSubDomains] = React.useState<SubDomain[]>([]);
  const [selectedSubdomain, setSelectedSubdomain] = React.useState<string>(
    data.subDomain || ""
  );

  const [regions, setRegions] = React.useState<Region[]>([]);
  const [countries, setCountries] = React.useState<any[]>([]);
  const [statuses, setStatuses] = React.useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = React.useState<string>(
    data.regionName || ""
  );
  const [selectedCountry, setSelectedCountry] = React.useState<string>(
    data.countryName || ""
  );

  const [selectedApplication, setSelectedApplication] = React.useState<string>(
    data.applicationName || ""
  );
  const [selectedStatus, setSelectedStatus] = React.useState<string>(
    data.status || ""
  );

  const [filteredDomains, setFilteredDomains] = React.useState<Domain[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = React.useState<
    SubDomain[]
  >([]);

  const handleCapabilityChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedCapability(value);
    setSelectedDomain("");
    setSelectedSubdomain("");
  };

  const handleDomainChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedDomain(value);
    setSelectedSubdomain("");
  };

  const handleSubDomainChange = (event: SelectChangeEvent<string>) => {
    setSelectedSubdomain(event.target.value);
  };

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    setSelectedRegion(event.target.value);
  };

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCountry(event.target.value);
  };

  const handleE2EChange = (event: SelectChangeEvent<string>) => {
    setSelectedE2EBusinessProcess(event.target.value);
  };

  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const sort = JSON.stringify({ name: "ASC" });
        const result = await fetchCorecapability(sort);
        setCapabilities(result);
      } catch (error) {
        console.error("Error fetching capabilities:", error);
      }
    };

    const fetchE2EBusinessProcesses = async () => {
      try {
        const sort = JSON.stringify({ name: "ASC" });
        const result = await fetchE2EBusinessProcess(sort);
        let selectedId = data.E2EBusinessProcess;
        if (
          selectedId &&
          !result.some(
            (e2e: E2EBusinessProcess) => e2e.id === data.E2EBusinessProcess
          )
        ) {
          result.push({
            id: data.E2EBusinessProcess,
            name: data.E2EBusinessProcess || "Unknown",
          });
        }
        setE2EBusinessProcess(result);
      } catch (error) {
        console.error("Error fetching E2eBusinessProcess:", error);
      }
    };

    const fetchDomains = async () => {
      try {
        const sort = JSON.stringify({ name: "ASC" });
        const domainResult = await fetchDomain(sort);
        setDomains(domainResult);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    const fetchSubDomains = async () => {
      try {
        const sort = JSON.stringify({ name: "ASC" });
        const subDomainResult = await fetchSubdomain(sort);
        setSubDomains(subDomainResult);
      } catch (error) {
        console.error("Error fetching subdomains:", error);
      }
    };

    const fetchRegions = async () => {
      try {
        const result = await getRegions();
        setRegions(Array.isArray(result) ? result : []);
      } catch (error) {
        setRegions([]);
      }
    };

    const fetchCountries = async () => {
      try {
        const countryResult = await getCountrys();
        setCountries(countryResult);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const fetchStatus = async () => {
      try {
        const statusResult = await getStatuses();
        if (!statusResult.includes(data.status)) {
          statusResult.push(data.status);
        }
        setStatuses(statusResult);
        console.log("status result :", statusResult);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchCapabilities();
    fetchDomains();
    fetchSubDomains();
    fetchE2EBusinessProcesses();
    fetchRegions();
    fetchCountries();
    fetchStatus();
  }, []);

  useEffect(() => {
    const selectedCap = capabilities.find(
      (cap) => cap.id === selectedCapability
    );
    if (selectedCap) {
      setFilteredDomains(
        domains.filter((domain) => domain.core_id === selectedCap.id)
      );
    } else {
      setFilteredDomains([]);
    }
  }, [selectedCapability, domains, capabilities]);

  useEffect(() => {
    const selectedDom = domains.find((dom) => dom.id === selectedDomain);
    if (selectedDom) {
      setFilteredSubDomains(
        subDomains.filter((subDomain) => subDomain.domain_id === selectedDom.id)
      );
    } else {
      setFilteredSubDomains([]);
    }
  }, [selectedDomain, subDomains, domains]);

  const formatAndSave = () => {
    console.log(
      selectedCapability,
      selectedDomain,
      selectedSubdomain,
      selectedApplication,
      selectedRegion,
      selectedCountry,
      selectedStatus,
      selectedE2EBusinessProcess
    );

    const selectedCap = capabilities.find(
      (cap) => cap.id === selectedCapability
    );
    const selectedDom = domains.find((dom) => dom.id === selectedDomain);
    const selectedSubDom = subDomains.find(
      (sub) => sub.id === selectedSubdomain
    );
    const selectedReg = regions.find((reg) => reg.id === selectedRegion);
    const selectedCoun = countries.find((coun) => coun.id === selectedCountry);
    const selectedE2E = E2EBusinessProcess.find(
      (e2e) => e2e.id === selectedE2EBusinessProcess
    );

    if (!selectedCap) {
      console.error("No capability selected");
      return;
    }

    const formattedData: any[] = [
      {
        core_id: selectedCapability,
        domain_id: selectedDomain,
        subdomain_id: selectedSubdomain,
        name: selectedApplication,
        region: selectedRegion,
        country: selectedCountry,
        status: selectedStatus,
        e2e_id: selectedE2EBusinessProcess,
      },
    ];

    onSave(formattedData);
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: "-8px",
    fontSize: "0.9rem",
  };

  const selectStyle = {
    backgroundColor: "white",
    borderRadius: 2,
    border: "1px solid #e5e7eb",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "transparent" },
      "&:hover fieldset": { borderColor: "#008C8C" },
      "&.Mui-focused fieldset": { 
        borderColor: "#008C8C", 
        borderWidth: "2px" 
      },
    },
    "& .MuiInputBase-input": { color: "#1F2937" },
    "& .Mui-disabled": {
      backgroundColor: "#f3f4f6",
    },
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #008C8C 0%, #00a5a5 100%)",
          color: "white",
          padding: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid #A3E635",
        }}
      >
        <DialogTitle margin={-2} sx={{ fontWeight: "bold", color: "white", fontSize: "1.5rem" }}>
          Add New Item
        </DialogTitle>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ backgroundColor: "#F9FAFB", color: "#1F2937", padding: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" sx={labelStyle}>
            Business Capability
            <span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedCapability}
            onChange={handleCapabilityChange}
            displayEmpty
            sx={selectStyle}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Business Capability
            </MenuItem>
            {capabilities.map((capability) => (
              <MenuItem key={capability.id} value={capability.id}>
                {capability.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" sx={labelStyle}>
            Domain<span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedDomain}
            onChange={handleDomainChange}
            displayEmpty
            disabled={!selectedCapability}
            sx={selectStyle}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Domain
            </MenuItem>
            {filteredDomains.map((domain) => (
              <MenuItem key={domain.id} value={domain.id}>
                {domain.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" sx={labelStyle}>
            Sub-domain<span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedSubdomain}
            onChange={handleSubDomainChange}
            displayEmpty
            disabled={!selectedDomain}
            sx={selectStyle}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Sub-Domain
            </MenuItem>
            {filteredSubDomains.map((subDomain) => (
              <MenuItem key={subDomain.id} value={subDomain.id}>
                {subDomain.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" sx={labelStyle}>
            Application<span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={selectedApplication}
            onChange={(e) => {
              setSelectedApplication(e.target.value);
              onChange("application", e.target.value);
            }}
            placeholder="Enter application"
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#008C8C" },
                "&.Mui-focused fieldset": { 
                  borderColor: "#008C8C",
                  borderWidth: "2px"
                },
              },
              "& .MuiInputBase-input": { color: "#1F2937" },
            }}
          />

          <Typography variant="body2" sx={labelStyle}>
            Region<span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedRegion}
            onChange={handleRegionChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) return "Select Region";
              const region = regions.find((r) => r.id === selected);
              return region ? region.name : selected;
            }}
            sx={selectStyle}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Region
            </MenuItem>
            {Array.isArray(regions) &&
              regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
          </Select>

          <Typography variant="body2" sx={labelStyle}>
            Country<span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedCountry}
            onChange={handleCountryChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) return "Select Country";
              const country = countries.find((c) => c.id === selected);
              return country ? country.name : selected;
            }}
            sx={selectStyle}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select Country
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" sx={labelStyle}>
            Status<span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              onChange("status", e.target.value);
            }}
            displayEmpty
            renderValue={(selected) => {
              return selected || "Select Status";
            }}
            sx={selectStyle}
          >
            <MenuItem value="" disabled>
              Select Status
            </MenuItem>
            {statuses.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" sx={labelStyle}>
            E2E Business Process
            <span style={{ color: "#008C8C", marginLeft: "2px" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedE2EBusinessProcess}
            onChange={handleE2EChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) return "Select E2E Business Process";
              const e2e = E2EBusinessProcess.find((e) => e.id === selected);
              return e2e ? e2e.name : selected;
            }}
            sx={selectStyle}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Select E2E Business Process
            </MenuItem>
            {E2EBusinessProcess.map((e2e) => (
              <MenuItem key={e2e.id} value={e2e.id}>
                {e2e.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#F9FAFB",
          padding: "20px 24px",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <CustomButton
          title="Cancel"
          backgroundColor="white"
          color="#1F2937"
          handleClick={onClose}
          sx={{
            color: "#1F2937",
            backgroundColor: "white",
            border: "1.5px solid #e5e7eb",
            padding: "10px 24px",
            fontWeight: "600",
            textTransform: "none",
            borderRadius: "8px",
            width: "48%",
            "&:hover": {
              backgroundColor: "#f9fafb",
              borderColor: "#1F2937",
            },
          }}
        />
        <CustomButton
          title="Save"
          backgroundColor="#008C8C"
          color="white"
          handleClick={formatAndSave}
          sx={{
            background: "linear-gradient(135deg, #008C8C 0%, #00a5a5 100%)",
            color: "white",
            padding: "10px 24px",
            fontWeight: "600",
            textTransform: "none",
            borderRadius: "8px",
            width: "48%",
            border: "none",
            boxShadow: "0 4px 6px -1px rgba(0, 140, 140, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #007575 0%, #008f8f 100%)",
              boxShadow: "0 6px 8px -1px rgba(0, 140, 140, 0.4)",
            },
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default CustomAddDialog;