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
//   Checkbox,
//   ListItemText,
//   ListSubheader,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CustomButton from "./CustomButton";
// import {
//   fetchCorecapability,
//   fetchDomain,
//   fetchSubdomain,
//   fetchE2EBusinessProcess,
//   // getMappedApplications,
//   getCountrys,
//   getRegions,
//   getStatuses,
// } from "apis";
// import {
//   Capability,
//   E2EBusinessProcess,
//   Domain,
//   SubDomain,
// } from "apis/interfaces";

// interface CustomEditDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: any;
//   sort: string;
//   data: any;
//   onChange: (field: string, value: string) => void;
// }

// const CustomEditDialog: React.FC<CustomEditDialogProps> = ({
//   open,
//   onClose,
//   onSave,
//   data,
//   onChange,
// }) => {
//   const [capabilities, setCapabilities] = React.useState<Capability[]>([]);
//   const [selectedCapabilities, setSelectedCapabilities] = React.useState<any[]>(
//     data.businessCapabilityName ? [data.businessCapabilityName] : []
//   );
//   const [E2EBusinessProcess, setE2EBusinessProcess] = React.useState<
//     E2EBusinessProcess[]
//   >([]);

//   const [selectedE2EBusinessProcess, setSelectedE2EBusinessProcess] =
//     React.useState<any>(data.e2e_id || "");

//   console.log("---------------data in CustomEditDialog:", data);
//   const [selectedDomain, setSelectedDomain] = React.useState<any[]>(
//     data.domain ? [data.domain] : []
//   );
//   const [selectedSubdomain, setSelectedSubdomain] = React.useState<any[]>(
//     data.subDomain ? [data.subDomain] : []
//   );
//   const [domains, setDomains] = React.useState<any[]>([]);
//   const [subDomains, setSubDomains] = React.useState<SubDomain[]>([]);
//   const [selectedValues, setSelectedValues] = React.useState<any>({});
//   //
//   const [regions, setRegions] = React.useState<any[]>([]);
//   const [countries, setCountries] = React.useState<any[]>([]);
//   const [statuses, setStatuses] = React.useState<any[]>([]);
//   const [selectedRegions, setSelectedRegions] = React.useState<string[]>(
//     data.region ? [data.region] : []
//   );
//   const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
//     data.country ? [data.country] : []
//   );
//   const [selectedApplication, setSelectedApplication] = React.useState<any>(
//     data.applicationName
//   );
//   const [selectedStatus, setSelectedStatus] = React.useState<any>(data.status);

//   const [filteredDomains, setFilteredDomains] = React.useState<Domain[]>([]);
//   const [filteredSubDomains, setFilteredSubDomains] = React.useState<
//     SubDomain[]
//   >([]);

//   const handleChange = (event: SelectChangeEvent<any>) => {
//     const {
//       target: { value },
//     } = event;
//     console.log("value:", value);
//     setSelectedCapabilities(
//       typeof value === "string" ? value.split(",") : value
//     );
//   };

//   const handleChangeE2E = (event: SelectChangeEvent<any>) => {
//     setSelectedE2EBusinessProcess(event.target.value);
//   };

//   const handleChangeDomain = (event: SelectChangeEvent<any>) => {
//     const {
//       target: { value },
//     } = event;
//     setSelectedDomain(typeof value === "string" ? value.split(",") : value);
//   };

//   const handleChangeSubDomain = (event: SelectChangeEvent<any>) => {
//     const {
//       target: { value },
//     } = event;
//     setSelectedSubdomain(typeof value === "string" ? value.split(",") : value);
//   };

//   useEffect(() => {
//     const fetchCapabilities = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const result = await fetchCorecapability(sort);
//         // const sortedCapabilities = result.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
//         setCapabilities(result);
//       } catch (error) {
//         console.error("Error fetching capabilities:", error);
//       }
//     };
//     const fetchE2EBusinessProcesses = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const result = await fetchE2EBusinessProcess(sort);

//         // Check if the current data's E2E business process exists in the fetched result
//         let currentE2EExists = false;
//         let selectedValue = data.e2e_id;

//         if (data.e2e_id) {
//           // Check if e2e_id exists in the result (by ID)
//           currentE2EExists = result.some(
//             (e2e: E2EBusinessProcess) => e2e.id === data.e2e_id
//           );
//         }

//         // If it doesn't exist, add it to the list
//         if (data.e2e_id && !currentE2EExists) {
//           const newE2EItem = {
//             id: data.e2e_id,
//             name:
//               data.E2EBusinessName ||
//               data.E2EBusinessProcess ||
//               data.e2eBusinessName ||
//               "Unknown E2E Process",
//           };
//           result.push(newE2EItem);
//         }

//         if (
//           !data.e2e_id &&
//           (data.E2EBusinessName ||
//             data.E2EBusinessProcess ||
//             data.e2eBusinessName)
//         ) {
//           const nameToFind =
//             data.E2EBusinessName ||
//             data.E2EBusinessProcess ||
//             data.e2eBusinessName;
//           const existingE2E = result.find(
//             (e2e: E2EBusinessProcess) => e2e.name === nameToFind
//           );

//           if (existingE2E) {
//             selectedValue = existingE2E.id;
//           } else {
//             const newId = `temp_${Date.now()}`;
//             const newE2EItem = {
//               id: newId,
//               name: nameToFind,
//             };
//             result.push(newE2EItem);
//             selectedValue = newId;
//           }
//         }

//         setE2EBusinessProcess(result);

//         // Set the selected value
//         if (selectedValue) {
//           setSelectedE2EBusinessProcess(selectedValue);
//         }
//       } catch (error) {
//         console.error("Error fetching E2eBusinessProcess:", error);
//       }
//     };
//     const fetchDomains = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const domainResult = await fetchDomain(sort);
//         // const sortedDomains = domainResult.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
//         setDomains(domainResult);
//       } catch (error) {
//         console.error("Error fetching domains:", error);
//       }
//     };

//     const fetchSubDomains = async () => {
//       try {
//         const sort = JSON.stringify({ name: "ASC" });
//         const subDomainResult = await fetchSubdomain(sort);
//         // const sortedSubDomains = subDomainResult.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name));
//         setSubDomains(subDomainResult);
//       } catch (error) {
//         console.error("Error fetching subdomains:", error);
//       }
//     };

//     const fetchRegions = async () => {
//       try {
//         const RegionResult = await getRegions();
//         setRegions(RegionResult);
//       } catch (error) {
//         console.error("Error fetching regions:", error);
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
//     //
//     fetchRegions();
//     fetchCountries();
//     fetchStatus();
//   }, []);

//   useEffect(() => {
//     if (E2EBusinessProcess.length > 0) {
//       let valueToSet = "";

//       if (data.e2e_id) {
//         const existsById = E2EBusinessProcess.find(
//           (e2e) => e2e.id === data.e2e_id
//         );
//         if (existsById) {
//           valueToSet = data.e2e_id;
//         }
//       } else if (
//         data.E2EBusinessName ||
//         data.E2EBusinessProcess ||
//         data.e2eBusinessName
//       ) {
//         const nameToFind =
//           data.E2EBusinessName ||
//           data.E2EBusinessProcess ||
//           data.e2eBusinessName;
//         const existsByName = E2EBusinessProcess.find(
//           (e2e) => e2e.name === nameToFind
//         );
//         if (existsByName) {
//           valueToSet = existsByName.id;
//         }
//       }

//       if (valueToSet && valueToSet !== selectedE2EBusinessProcess) {
//         setSelectedE2EBusinessProcess(valueToSet);
//       }
//     }
//   }, [
//     data.e2e_id,
//     data.E2EBusinessName,
//     data.E2EBusinessProcess,
//     data.e2eBusinessName,
//     E2EBusinessProcess,
//   ]);

//   useEffect(() => {
//     console.log("E2E Debug Info:", {
//       "data.e2e_id": data.e2e_id,
//       "data.E2EBusinessName": data.E2EBusinessName,
//       "data.E2EBusinessProcess": data.E2EBusinessProcess,
//       "data.e2eBusinessName": data.e2eBusinessName,
//       selectedE2EBusinessProcess: selectedE2EBusinessProcess,
//       "E2EBusinessProcess length": E2EBusinessProcess.length,
//       E2EBusinessProcess: E2EBusinessProcess,
//     });
//   }, [data, selectedE2EBusinessProcess, E2EBusinessProcess]);

//   useEffect(() => {
//     const capabilityId = data.core_id;
//     setFilteredDomains(
//       domains.filter((domain) => domain.core_id === capabilityId)
//     );

//     // setFilteredDomains(filtered.sort((a, b) => a.name.localeCompare(b.name)));
//   }, [data.core_id, domains]);

//   useEffect(() => {
//     const domainId = data.domain_id;
//     // const filtered = subDomains.filter((subDomain) => subDomain.domain_id === domainId);
//     setFilteredSubDomains(
//       subDomains.filter((subDomain) => subDomain.domain_id === domainId)
//     );
//   }, [data.domain_id, subDomains]);

//   const handleCheckboxToggleCap = (domainName: any) => {
//     setSelectedCapabilities((prevSelected) => {
//       if (prevSelected.includes(domainName)) {
//         return prevSelected.filter((item) => item !== domainName);
//       }
//       return [...prevSelected, domainName];
//     });
//   };

//   const handleCheckboxToggle = (domainName: any) => {
//     if (domainName && domainName.startsWith("-")) {
//       return;
//     }

//     setSelectedDomain((prevSelected) => {
//       console.log("----->prevSelected:", prevSelected);
//       if (prevSelected.includes(domainName)) {
//         return prevSelected.filter((item) => item !== domainName);
//       }
//       return [...prevSelected, domainName];
//     });
//   };

//   const handleCheckboxToggleSub = (domainName: any) => {
//     if (domainName && domainName.startsWith("-")) {
//       return;
//     }

//     setSelectedSubdomain((prevSelected) => {
//       if (prevSelected.includes(domainName)) {
//         return prevSelected.filter((item) => item !== domainName);
//       }
//       return [...prevSelected, domainName];
//     });
//   };

//   // Handle checkbox toggle for Regions
//   const handleCheckboxToggleRegion = (regionName: string) => {
//     setSelectedRegions((prevSelected) => {
//       if (prevSelected.includes(regionName)) {
//         return prevSelected.filter((item) => item !== regionName);
//       }
//       return [...prevSelected, regionName];
//     });
//   };

//   // Handle checkbox toggle for Countries
//   const handleCheckboxToggleCountry = (countryName: string) => {
//     setSelectedCountries((prevSelected) => {
//       if (prevSelected.includes(countryName)) {
//         return prevSelected.filter((item) => item !== countryName);
//       }
//       return [...prevSelected, countryName];
//     });
//   };

//   const formatAndSave = () => {
//     console.log(
//       selectedCapabilities,
//       selectedDomain,
//       selectedSubdomain,
//       selectedApplication,
//       selectedRegions,
//       selectedCountries,
//       selectedStatus,
//       selectedE2EBusinessProcess
//     );
//     const formattedData: any[] = [];

//     const filteredCap = capabilities.filter((x) =>
//       selectedCapabilities.includes(x.name)
//     );

//     filteredCap.forEach((cap) => {
//       const filteredDomain = domains.filter(
//         (x) => selectedDomain.includes(x.name) && x.core_id === cap.id
//       );
//       if (filteredDomain.length > 0) {
//         filteredDomain.forEach((domainId) => {
//           const filteredSubDomain = subDomains.filter(
//             (x) =>
//               selectedSubdomain.includes(x.name) && x.domain_id === domainId.id
//           );
//           if (filteredSubDomain.length > 0) {
//             filteredSubDomain.forEach((subdomainId) => {
//               selectedRegions.forEach((region) => {
//                 selectedCountries.forEach((country) => {
//                   formattedData.push({
//                     core_id: cap.id,
//                     domain_id: domainId.id,
//                     subdomain_id: subdomainId.id,
//                     name: selectedApplication,
//                     region: region,
//                     country: country,
//                     status: selectedStatus,
//                     e2e_id: selectedE2EBusinessProcess,
//                   });
//                 });
//               });
//             });
//           } else {
//             selectedRegions.forEach((region) => {
//               selectedCountries.forEach((country) => {
//                 formattedData.push({
//                   core_id: cap.id,
//                   domain_id: domainId.id,
//                   subdomain_id: null,
//                   name: selectedApplication,
//                   region: region,
//                   country: country,
//                   status: selectedStatus,
//                   e2e_id: selectedE2EBusinessProcess,
//                 });
//               });
//             });
//           }
//         });
//       } else {
//         selectedRegions.forEach((region) => {
//           selectedCountries.forEach((country) => {
//             formattedData.push({
//               core_id: cap.id,
//               domain_id: null,
//               subdomain_id: null,
//               name: selectedApplication,
//               region: region,
//               country: country,
//               status: selectedStatus,
//               e2e_id: selectedE2EBusinessProcess,
//             });
//           });
//         });
//       }
//     });
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
//           Change Mapping
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
//             Select Business Capability Name
//             <span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedCapabilities}
//             multiple
//             onChange={handleChange}
//             input={<OutlinedInput label="Tag" />}
//             renderValue={(selected) => selected.filter(Boolean).join(",")}
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
//             {/* Default "Select Business Capability" message when no selection */}
//             {!data.businessCapabilityName && (
//               <MenuItem value="" disabled>
//                 Select Business Capability
//               </MenuItem>
//             )}

//             {/* Render each capability directly without any grouping */}
//             {capabilities.map((capability) => (
//               <MenuItem
//                 key={capability.id}
//                 value={capability.name}
//                 onClick={() => handleCheckboxToggleCap(capability.name)}
//               >
//                 <Checkbox
//                   checked={selectedCapabilities.indexOf(capability.name) > -1}
//                   tabIndex={-1}
//                   disableRipple
//                 />
//                 {capability.name}
//               </MenuItem>
//             ))}
//           </Select>

//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Select Domain Name<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedDomain}
//             onChange={handleChangeDomain}
//             multiple
//             input={<OutlinedInput label="Tag" />}
//             renderValue={(selected) => {
//               const filteredSelected = selected.filter(
//                 (value) =>
//                   value && typeof value === "string" && !value.startsWith("-")
//               );
//               return filteredSelected.length > 0
//                 ? filteredSelected.join(",")
//                 : "Select Domain";
//             }}
//             disabled={!data.domain}
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
//             {!data.domain && (
//               <MenuItem value="" disabled>
//                 Select Domain
//               </MenuItem>
//             )}

//             {selectedCapabilities.map((cap) => (
//               <div key={cap}>
//                 <ListSubheader
//                   sx={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
//                 >
//                   {cap}
//                 </ListSubheader>
//                 {domains
//                   .filter(
//                     (dmn) =>
//                       dmn.core_id ===
//                       capabilities.find((x) => x.name === cap)?.id
//                   )
//                   .filter(
//                     (filtDmn) => filtDmn.name && !filtDmn.name.startsWith("-")
//                   )
//                   .map((filtDmn) => (
//                     <MenuItem
//                       key={filtDmn.id}
//                       value={filtDmn.name}
//                       onClick={(e) => {
//                         handleCheckboxToggle(filtDmn.name);
//                       }}
//                     >
//                       <Checkbox
//                         checked={selectedDomain.indexOf(filtDmn.name) > -1}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           handleCheckboxToggle(filtDmn.name);
//                         }}
//                       />
//                       <ListItemText primary={filtDmn.name} />
//                     </MenuItem>
//                   ))}
//               </div>
//             ))}
//           </Select>

//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Select Sub-domain Name<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedSubdomain}
//             onChange={handleChangeSubDomain}
//             multiple
//             input={<OutlinedInput label="Tag" />}
//             renderValue={(selected) => {
//               const filteredSelected = selected.filter(
//                 (value) =>
//                   value && typeof value === "string" && !value.startsWith("-")
//               );
//               return filteredSelected.length > 0
//                 ? filteredSelected.join(",")
//                 : "Select Sub-Domain";
//             }}
//             disabled={!data.subDomain}
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
//             {!data.subDomain && (
//               <MenuItem value="" disabled>
//                 Select Sub-Domain
//               </MenuItem>
//             )}

//             {selectedDomain.map((cap) => (
//               <div key={cap}>
//                 <ListSubheader
//                   sx={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
//                 >
//                   {cap}
//                 </ListSubheader>
//                 {subDomains
//                   .filter(
//                     (dmn) =>
//                       dmn.domain_id ===
//                         domains.find((x) => x.name === cap)?.id &&
//                       dmn.name !== "-"
//                   )
//                   .map((filtDmn) => (
//                     <MenuItem key={filtDmn.id} value={filtDmn.name}>
//                       <Checkbox
//                         checked={selectedSubdomain.indexOf(filtDmn.name) > -1}
//                         onChange={() => handleCheckboxToggleSub(filtDmn.name)}
//                       />
//                       <ListItemText primary={filtDmn.name} />
//                     </MenuItem>
//                   ))}
//               </div>
//             ))}
//           </Select>

//           {/* Application Text Field */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Edit Application Name<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <TextField
//             fullWidth
//             value={selectedApplication || ""}
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
//             Select Region<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedRegions}
//             onChange={(e) =>
//               setSelectedRegions(
//                 typeof e.target.value === "string"
//                   ? e.target.value.split(",")
//                   : e.target.value
//               )
//             }
//             multiple
//             input={<OutlinedInput label="Tag" />}
//             renderValue={(selected) => selected.filter(Boolean).join(",")}
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
//             {regions.map((region) => (
//               <MenuItem
//                 key={region.id}
//                 value={region.name}
//                 onClick={(e) => {
//                   handleCheckboxToggleRegion(region.name);
//                 }}
//               >
//                 <Checkbox
//                   checked={selectedRegions.indexOf(region.name) > -1}
//                   onChange={(e) => {
//                     e.stopPropagation();
//                     handleCheckboxToggleRegion(region.name);
//                   }}
//                 />
//                 {region.name}
//               </MenuItem>
//             ))}
//           </Select>

//           {/* Country Select */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Select Country<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedCountries}
//             onChange={(e) =>
//               setSelectedCountries(
//                 typeof e.target.value === "string"
//                   ? e.target.value.split(",")
//                   : e.target.value
//               )
//             }
//             multiple
//             input={<OutlinedInput label="Tag" />}
//             renderValue={(selected) => selected.filter(Boolean).join(",")}
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
//             {countries.map((country) => (
//               <MenuItem
//                 key={country.id}
//                 value={country.name}
//                 onClick={(e) => {
//                   handleCheckboxToggleCountry(country.name);
//                 }}
//               >
//                 <Checkbox
//                   checked={selectedCountries.indexOf(country.name) > -1}
//                   onChange={(e) => {
//                     e.stopPropagation();
//                     handleCheckboxToggleCountry(country.name);
//                   }}
//                 />
//                 {country.name}
//               </MenuItem>
//             ))}
//           </Select>

//           {/* Status Text Field */}
//           <Typography
//             variant="body2"
//             sx={{ fontWeight: "bold", color: "black" }}
//           >
//             Select Application Status<span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedStatus}
//             onChange={(e) => {
//               setSelectedStatus(e.target.value);
//               onChange("status", e.target.value);
//             }}
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
//           >
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
//             Select E2E Business Process
//             <span style={{ color: "red" }}>*</span>
//           </Typography>
//           <Select
//             fullWidth
//             value={selectedE2EBusinessProcess}
//             onChange={(e) => {
//               setSelectedE2EBusinessProcess(e.target.value);
//               onChange("e2e_id", e.target.value);
//             }}
//             displayEmpty
//             renderValue={(selected) => {
//               if (!selected) {
//                 return "Select E2E Business Process";
//               }
//               const selectedObj = E2EBusinessProcess.find(
//                 (e2e) => e2e.id === selected
//               );
//               return selectedObj
//                 ? selectedObj.name
//                 : "Select E2E Business Process";
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

// export default CustomEditDialog;


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
  Checkbox,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "./CustomButton";
import {
  fetchCorecapability,
  fetchDomain,
  fetchSubdomain,
  fetchE2EBusinessProcess,
  getCountrys,
  getRegions,
  getStatuses,
} from "apis";
import {
  Capability,
  E2EBusinessProcess,
  Domain,
  SubDomain,
} from "apis/interfaces";

interface CustomEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: any;
  sort: string;
  data: any;
  onChange: (field: string, value: string) => void;
}

const CustomEditDialog: React.FC<CustomEditDialogProps> = ({
  open,
  onClose,
  onSave,
  data,
  onChange,
}) => {
  const [capabilities, setCapabilities] = React.useState<Capability[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = React.useState<any[]>(
    data.businessCapabilityName ? [data.businessCapabilityName] : []
  );
  const [E2EBusinessProcess, setE2EBusinessProcess] = React.useState<
    E2EBusinessProcess[]
  >([]);

  const [selectedE2EBusinessProcess, setSelectedE2EBusinessProcess] =
    React.useState<any>(data.e2e_id || "");

  console.log("---------------data in CustomEditDialog:", data);
  const [selectedDomain, setSelectedDomain] = React.useState<any[]>(
    data.domain ? [data.domain] : []
  );
  const [selectedSubdomain, setSelectedSubdomain] = React.useState<any[]>(
    data.subDomain ? [data.subDomain] : []
  );
  const [domains, setDomains] = React.useState<any[]>([]);
  const [subDomains, setSubDomains] = React.useState<SubDomain[]>([]);
  //
  const [regions, setRegions] = React.useState<any[]>([]);
  const [countries, setCountries] = React.useState<any[]>([]);
  const [statuses, setStatuses] = React.useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>(
    data.region ? [data.region] : []
  );
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
    data.country ? [data.country] : []
  );
  const [selectedApplication, setSelectedApplication] = React.useState<any>(
    data.applicationName
  );
  const [selectedStatus, setSelectedStatus] = React.useState<any>(data.status);

  // Remove the filtered states since we'll compute them dynamically
  // const [filteredDomains, setFilteredDomains] = React.useState<Domain[]>([]);
  // const [filteredSubDomains, setFilteredSubDomains] = React.useState<SubDomain[]>([]);

  const handleChange = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    console.log("value:", value);
    const newSelectedCapabilities =
      typeof value === "string" ? value.split(",") : value;
    setSelectedCapabilities(newSelectedCapabilities);

    // Clear domain and subdomain selections when capability changes
    setSelectedDomain([]);
    setSelectedSubdomain([]);
  };

  const handleChangeE2E = (event: SelectChangeEvent<any>) => {
    setSelectedE2EBusinessProcess(event.target.value);
  };

  const handleChangeDomain = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    const newSelectedDomains =
      typeof value === "string" ? value.split(",") : value;
    setSelectedDomain(newSelectedDomains);

    // Clear subdomain selections when domain changes
    setSelectedSubdomain([]);
  };

  const handleChangeSubDomain = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    setSelectedSubdomain(typeof value === "string" ? value.split(",") : value);
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

        // Check if the current data's E2E business process exists in the fetched result
        let currentE2EExists = false;
        let selectedValue = data.e2e_id;

        if (data.e2e_id) {
          currentE2EExists = result.some(
            (e2e: E2EBusinessProcess) => e2e.id === data.e2e_id
          );
        }

        if (data.e2e_id && !currentE2EExists) {
          const newE2EItem = {
            id: data.e2e_id,
            name:
              data.E2EBusinessName ||
              data.E2EBusinessProcess ||
              data.e2eBusinessName ||
              "Unknown E2E Process",
          };
          result.push(newE2EItem);
        }

        if (
          !data.e2e_id &&
          (data.E2EBusinessName ||
            data.E2EBusinessProcess ||
            data.e2eBusinessName)
        ) {
          const nameToFind =
            data.E2EBusinessName ||
            data.E2EBusinessProcess ||
            data.e2eBusinessName;
          const existingE2E = result.find(
            (e2e: E2EBusinessProcess) => e2e.name === nameToFind
          );

          if (existingE2E) {
            selectedValue = existingE2E.id;
          } else {
            const newId = `temp_${Date.now()}`;
            const newE2EItem = {
              id: newId,
              name: nameToFind,
            };
            result.push(newE2EItem);
            selectedValue = newId;
          }
        }

        setE2EBusinessProcess(result);

        if (selectedValue) {
          setSelectedE2EBusinessProcess(selectedValue);
        }
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
        const RegionResult = await getRegions();
        setRegions(RegionResult);
      } catch (error) {
        console.error("Error fetching regions:", error);
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
    if (E2EBusinessProcess.length > 0) {
      let valueToSet = "";

      if (data.e2e_id) {
        const existsById = E2EBusinessProcess.find(
          (e2e) => e2e.id === data.e2e_id
        );
        if (existsById) {
          valueToSet = data.e2e_id;
        }
      } else if (
        data.E2EBusinessName ||
        data.E2EBusinessProcess ||
        data.e2eBusinessName
      ) {
        const nameToFind =
          data.E2EBusinessName ||
          data.E2EBusinessProcess ||
          data.e2eBusinessName;
        const existsByName = E2EBusinessProcess.find(
          (e2e) => e2e.name === nameToFind
        );
        if (existsByName) {
          valueToSet = existsByName.id;
        }
      }

      if (valueToSet && valueToSet !== selectedE2EBusinessProcess) {
        setSelectedE2EBusinessProcess(valueToSet);
      }
    }
  }, [
    data.e2e_id,
    data.E2EBusinessName,
    data.E2EBusinessProcess,
    data.e2eBusinessName,
    E2EBusinessProcess,
  ]);

  useEffect(() => {
    console.log("E2E Debug Info:", {
      "data.e2e_id": data.e2e_id,
      "data.E2EBusinessName": data.E2EBusinessName,
      "data.E2EBusinessProcess": data.E2EBusinessProcess,
      "data.e2eBusinessName": data.e2eBusinessName,
      selectedE2EBusinessProcess: selectedE2EBusinessProcess,
      "E2EBusinessProcess length": E2EBusinessProcess.length,
      E2EBusinessProcess: E2EBusinessProcess,
    });
  }, [data, selectedE2EBusinessProcess, E2EBusinessProcess]);

  // Compute filtered domains dynamically based on selected capabilities
  const getFilteredDomains = () => {
    if (selectedCapabilities.length === 0) return [];

    const selectedCapabilityIds = selectedCapabilities
      .map((capName) => capabilities.find((cap) => cap.name === capName)?.id)
      .filter(Boolean);

    return domains.filter((domain) =>
      selectedCapabilityIds.includes(domain.core_id)
    );
  };

  // Compute filtered subdomains dynamically based on selected domains
  const getFilteredSubDomains = () => {
    if (selectedDomain.length === 0) return [];

    const selectedDomainIds = selectedDomain
      .map(
        (domainName) => domains.find((domain) => domain.name === domainName)?.id
      )
      .filter(Boolean);

    return subDomains.filter((subDomain) =>
      selectedDomainIds.includes(subDomain.domain_id)
    );
  };

  const handleCheckboxToggleCap = (domainName: any) => {
    setSelectedCapabilities((prevSelected) => {
      const newSelected = prevSelected.includes(domainName)
        ? prevSelected.filter((item) => item !== domainName)
        : [...prevSelected, domainName];

      // Clear domains and subdomains when capabilities change
      if (newSelected.length !== prevSelected.length) {
        setSelectedDomain([]);
        setSelectedSubdomain([]);
      }

      return newSelected;
    });
  };

  const handleCheckboxToggle = (domainName: any) => {
    if (domainName && domainName.startsWith("-")) {
      return;
    }

    setSelectedDomain((prevSelected) => {
      const newSelected = prevSelected.includes(domainName)
        ? prevSelected.filter((item) => item !== domainName)
        : [...prevSelected, domainName];

      // Clear subdomains when domains change
      if (newSelected.length !== prevSelected.length) {
        setSelectedSubdomain([]);
      }

      return newSelected;
    });
  };

  const handleCheckboxToggleSub = (domainName: any) => {
    if (domainName && domainName.startsWith("-")) {
      return;
    }

    setSelectedSubdomain((prevSelected) => {
      if (prevSelected.includes(domainName)) {
        return prevSelected.filter((item) => item !== domainName);
      }
      return [...prevSelected, domainName];
    });
  };

  // Handle checkbox toggle for Regions
  const handleCheckboxToggleRegion = (regionName: string) => {
    setSelectedRegions((prevSelected) => {
      if (prevSelected.includes(regionName)) {
        return prevSelected.filter((item) => item !== regionName);
      }
      return [...prevSelected, regionName];
    });
  };

  // Handle checkbox toggle for Countries
  const handleCheckboxToggleCountry = (countryName: string) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(countryName)) {
        return prevSelected.filter((item) => item !== countryName);
      }
      return [...prevSelected, countryName];
    });
  };

  const formatAndSave = () => {
    console.log(
      selectedCapabilities,
      selectedDomain,
      selectedSubdomain,
      selectedApplication,
      selectedRegions,
      selectedCountries,
      selectedStatus,
      selectedE2EBusinessProcess
    );
    const formattedData: any[] = [];

    const filteredCap = capabilities.filter((x) =>
      selectedCapabilities.includes(x.name)
    );

    filteredCap.forEach((cap) => {
      const filteredDomain = domains.filter(
        (x) => selectedDomain.includes(x.name) && x.core_id === cap.id
      );
      if (filteredDomain.length > 0) {
        filteredDomain.forEach((domainId) => {
          const filteredSubDomain = subDomains.filter(
            (x) =>
              selectedSubdomain.includes(x.name) && x.domain_id === domainId.id
          );
          if (filteredSubDomain.length > 0) {
            filteredSubDomain.forEach((subdomainId) => {
              selectedRegions.forEach((region) => {
                selectedCountries.forEach((country) => {
                  formattedData.push({
                    core_id: cap.id,
                    domain_id: domainId.id,
                    subdomain_id: subdomainId.id,
                    name: selectedApplication,
                    region: region,
                    country: country,
                    status: selectedStatus,
                    e2e_id: selectedE2EBusinessProcess,
                  });
                });
              });
            });
          } else {
            selectedRegions.forEach((region) => {
              selectedCountries.forEach((country) => {
                formattedData.push({
                  core_id: cap.id,
                  domain_id: domainId.id,
                  subdomain_id: null,
                  name: selectedApplication,
                  region: region,
                  country: country,
                  status: selectedStatus,
                  e2e_id: selectedE2EBusinessProcess,
                });
              });
            });
          }
        });
      } else {
        selectedRegions.forEach((region) => {
          selectedCountries.forEach((country) => {
            formattedData.push({
              core_id: cap.id,
              domain_id: null,
              subdomain_id: null,
              name: selectedApplication,
              region: region,
              country: country,
              status: selectedStatus,
              e2e_id: selectedE2EBusinessProcess,
            });
          });
        });
      }
    });
    onSave(formattedData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          backgroundColor: "#008C8C",
          color: "white",
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle margin={-2} sx={{ fontWeight: "bold", color: "white" }}>
          Change Mapping
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ backgroundColor: "white", color: "black" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select Business Capability Name
            <span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedCapabilities}
            multiple
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.filter(Boolean).join(",")}
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
            {!data.businessCapabilityName && (
              <MenuItem value="" disabled>
                Select Business Capability
              </MenuItem>
            )}

            {capabilities.map((capability) => (
              <MenuItem
                key={capability.id}
                value={capability.name}
                onClick={() => handleCheckboxToggleCap(capability.name)}
              >
                <Checkbox
                  checked={selectedCapabilities.indexOf(capability.name) > -1}
                  tabIndex={-1}
                  disableRipple
                />
                {capability.name}
              </MenuItem>
            ))}
          </Select>

          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select Domain Name<span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedDomain}
            onChange={handleChangeDomain}
            multiple
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => {
              const filteredSelected = selected.filter(
                (value) =>
                  value && typeof value === "string" && !value.startsWith("-")
              );
              return filteredSelected.length > 0
                ? filteredSelected.join(",")
                : "Select Domain";
            }}
            disabled={selectedCapabilities.length === 0}
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
            {selectedCapabilities.length === 0 && (
              <MenuItem value="" disabled>
                Select Domain
              </MenuItem>
            )}

            {selectedCapabilities.map((cap) => (
              <div key={cap}>
                <ListSubheader
                  sx={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
                >
                  {cap}
                </ListSubheader>
                {getFilteredDomains()
                  .filter(
                    (dmn) =>
                      dmn.core_id ===
                      capabilities.find((x) => x.name === cap)?.id
                  )
                  .filter(
                    (filtDmn) => filtDmn.name && !filtDmn.name.startsWith("-")
                  )
                  .map((filtDmn) => (
                    <MenuItem
                      key={filtDmn.id}
                      value={filtDmn.name}
                      onClick={(e) => {
                        handleCheckboxToggle(filtDmn.name);
                      }}
                    >
                      <Checkbox
                        checked={selectedDomain.indexOf(filtDmn.name) > -1}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxToggle(filtDmn.name);
                        }}
                      />
                      <ListItemText primary={filtDmn.name} />
                    </MenuItem>
                  ))}
              </div>
            ))}
          </Select>

          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select Sub-domain Name<span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedSubdomain}
            onChange={handleChangeSubDomain}
            multiple
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => {
              const filteredSelected = selected.filter(
                (value) =>
                  value && typeof value === "string" && !value.startsWith("-")
              );
              return filteredSelected.length > 0
                ? filteredSelected.join(",")
                : "Select Sub-Domain";
            }}
            disabled={selectedDomain.length === 0}
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
            {selectedDomain.length === 0 && (
              <MenuItem value="" disabled>
                Select Sub-Domain
              </MenuItem>
            )}

            {selectedDomain.map((cap) => (
              <div key={cap}>
                <ListSubheader
                  sx={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
                >
                  {cap}
                </ListSubheader>
                {getFilteredSubDomains()
                  .filter(
                    (dmn) =>
                      dmn.domain_id ===
                        domains.find((x) => x.name === cap)?.id &&
                      dmn.name !== "-"
                  )
                  .map((filtDmn) => (
                    <MenuItem key={filtDmn.id} value={filtDmn.name}>
                      <Checkbox
                        checked={selectedSubdomain.indexOf(filtDmn.name) > -1}
                        onChange={() => handleCheckboxToggleSub(filtDmn.name)}
                      />
                      <ListItemText primary={filtDmn.name} />
                    </MenuItem>
                  ))}
              </div>
            ))}
          </Select>

          {/* Application Text Field */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Edit Product Name<span style={{ color: "red" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={selectedApplication || ""}
            onChange={(e) => {
              setSelectedApplication(e.target.value);
              onChange("application", e.target.value);
            }}
            placeholder="Enter application"
            sx={{
              backgroundColor: "#f0f2f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
              },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          {/* Region Select */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select Region<span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedRegions}
            onChange={(e) =>
              setSelectedRegions(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            multiple
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.filter(Boolean).join(",")}
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
            {regions.map((region) => (
              <MenuItem
                key={region.id}
                value={region.name}
                onClick={(e) => {
                  handleCheckboxToggleRegion(region.name);
                }}
              >
                <Checkbox
                  checked={selectedRegions.indexOf(region.name) > -1}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxToggleRegion(region.name);
                  }}
                />
                {region.name}
              </MenuItem>
            ))}
          </Select>

          {/* Country Select */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select Country<span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedCountries}
            onChange={(e) =>
              setSelectedCountries(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            multiple
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.filter(Boolean).join(",")}
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
            {countries.map((country) => (
              <MenuItem
                key={country.id}
                value={country.name}
                onClick={(e) => {
                  handleCheckboxToggleCountry(country.name);
                }}
              >
                <Checkbox
                  checked={selectedCountries.indexOf(country.name) > -1}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleCheckboxToggleCountry(country.name);
                  }}
                />
                {country.name}
              </MenuItem>
            ))}
          </Select>

          {/* Status Text Field */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select Application Status<span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              onChange("status", e.target.value);
            }}
            displayEmpty
            sx={{
              backgroundColor: "#f0f2f5",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": { borderColor: "#b0bec5" },
              },
              "& .MuiInputBase-input": { color: "black" },
            }}
          >
            {statuses.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>

          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Select E2E Business Process
            <span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            fullWidth
            value={selectedE2EBusinessProcess}
            onChange={(e) => {
              setSelectedE2EBusinessProcess(e.target.value);
              onChange("e2e_id", e.target.value);
            }}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return "Select E2E Business Process";
              }
              const selectedObj = E2EBusinessProcess.find(
                (e2e) => e2e.id === selected
              );
              return selectedObj
                ? selectedObj.name
                : "Select E2E Business Process";
            }}
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
          backgroundColor: "white",
          padding: "16px",
          justifyContent: "space-between",
        }}
      >
        <CustomButton
  title="Cancel"
  backgroundColor="#F9FAFB"
  color="#1F2937"
  handleClick={onClose}
  sx={{
    color: "#1F2937",
    borderColor: "#1F2937",
    padding: "8px 16px",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "8px",
    width: "45%",
  }}
/>
<CustomButton
  title="Save"
  backgroundColor="#008C8C"
  color="white"
  handleClick={formatAndSave}
  sx={{
    backgroundColor: "#008C8C",
    color: "white",
    padding: "8px 16px",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "8px",
    width: "45%",
    "&:hover": {
      backgroundColor: "#007070",
    },
  }}
/>
      </DialogActions>
    </Dialog>
  );
};

export default CustomEditDialog;
