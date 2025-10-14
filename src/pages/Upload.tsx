// import React, { useRef, useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Typography,
//   Divider,
//   AppBar,
//   Tabs,
//   Tab,
//   CircularProgress,
// } from "@mui/material";
// import SearchBar from "components/common/SearchBar";
// import AddIcon from "@mui/icons-material/Add";
// import ReplayIcon from "@mui/icons-material/Replay";
// import CloseIcon from "@mui/icons-material/Close";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import { CustomButton } from "components";
// import { IResourceComponentsProps } from "@refinedev/core";
// import CustomDialog from "components/common/CustomDialog";
// import CustomTable from "components/common/CustomTable";
// import CustomAddDialog from "components/common/CustomAddDialog";
// import {
//   callRemap,
//   createApplication,
//   getMappedApplications,
//   getOrphans,
//   uploadFile,
// } from "apis";
// import { TableSortLabel } from "@mui/material";

// interface ApplicationMapping {
//   core_id: string;
//   domain_id: string;
//   subdomain_id: string;
//   name: string;
//   region: string;
//   country: string;
//   status: string;
//   e2e_id: string;
// }

// interface UploadProps extends IResourceComponentsProps<any, any> {}

// const Upload: React.FC<UploadProps> = () => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [file, setFile] = React.useState<File | null>(null);
//   const [open, setOpen] = React.useState(false);
//   const [openDialog, setOpenDialog] = React.useState(false);
//   const [applications, setApplications] = React.useState([]);
//   const [mappedApplications, setMappedApplications] = React.useState([]);
//   const [orphans, setOrphans] = React.useState([]);
//   const [loading, setLoading] = React.useState(false);
//   const [showImportButton, setShowImportButton] = React.useState(true);
//   const [selectedTab, setSelectedTab] = React.useState(0);
//   const [openAddDialog, setOpenAddDialog] = React.useState(false);
//   const [mappedData, setMappedData] = React.useState([]);
//   const [orphanData, setOrphanData] = React.useState([]);
//   const location = useLocation();
//   const [data, setData] = React.useState({
//     businessCapabilityName: "",
//     domain: "",
//     subDomain: "",
//     applicationName: "",
//     core_id: "",
//     domain_id: "",
//     subdomain_id: "",
//     name: "",
//     E2EBusinessProcess: "",
//     regionName: "",
//     countryName: "",
//     status: "",
//   });
//   const [businessCapabilities, setBusinessCapabilities] = React.useState<
//     string[]
//   >([]);
//   const [E2EBusinessProcess, setE2EBusinessProcess] = React.useState<string[]>(
//     []
//   );
//   const [domains, setDomains] = React.useState<string[]>([]);
//   const [subDomains, setSubDomains] = React.useState<string[]>([]);
//   const [filteredDomains, setFilteredDomains] = React.useState<any[]>([]);
//   const [filteredSubDomains, setFilteredSubDomains] = React.useState<any[]>([]);
//   const [regions, setRegions] = React.useState<string[]>([]);
//   const [countries, setCountries] = React.useState<string[]>([]);
//   const [statuses, setStatuses] = React.useState<string[]>([]);
//   const [page, setPage] = useState(1);
//   const [orphanPage, setOrphanPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [pageSize, setPageSize] = useState(0);
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: "ASC" | "DESC" | "";
//   }>({
//     key: "",
//     direction: "",
//   });
//   const [searchTerm, setSearchTerm] = useState("");

//   const getTabIndexFromQuery = (query: string) => {
//     const params = new URLSearchParams(query);
//     const tab = params.get("tab");
//     switch (tab) {
//       case "applications-mapped":
//         return 0;
//       case "orphans":
//         return 1;
//       default:
//         return 0;
//     }
//   };

//   useEffect(() => {
//     setSelectedTab(getTabIndexFromQuery(location.search));
//   }, [location]);

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setSelectedTab(newValue);
//   };

//   useEffect(() => {
//     if (selectedTab === 0) {
//       fetchMappedApplications();
//     } else if (selectedTab === 1) {
//       fetchOrphans();
//     }
//   }, [selectedTab, page, orphanPage, pageSize, sortConfig]);

//   const keyMapping: { [key: string]: string } = {
//     businessCapabilityName: "capability",
//     domain: "domain",
//     subDomain: "subdomain",
//     applicationName: "name",
//     E2EBusinessProcess: "e2ebusiness",
//     region: "region",
//     country: "country",
//     status: "status",
//   };

//   const fetchMappedApplications = async () => {
//     setLoading(true);
//     try {
//       const mappedKey = keyMapping[sortConfig.key] || sortConfig.key;
//       const params: any = {
//         page: page,
//         limit: pageSize,
//         sortField: mappedKey,
//         sortOrder: sortConfig.direction,
//       };
//       const queryString = new URLSearchParams(params).toString();
//       const result = await getMappedApplications(queryString);
//       console.log("Result:", result);
//       const { totalCount } = result;
//       setTotalCount(totalCount);
//       const mappedData = result.response.map((item: any) => ({
//         id: item.software_id,
//         businessCapabilityName: item.capability,
//         domain: item.domain !== "-" ? item.domain : "-",
//         subDomain: item.subdomain !== "-" ? item.subdomain : "-",
//         applicationName: item.software_name,
//         region: item.region,
//         country: item.country,
//         status: item.status,
//         E2EBusinessProcess: item.e2ebusiness || "-",
//       }));
//       setMappedData(mappedData);
//     } catch (error) {
//       console.error("Error fetching mapped products:", error);
//       alert("Failed to fetch mapped products. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrphans = async () => {
//     setLoading(true);
//     try {
//       const mappedKey = keyMapping[sortConfig.key] || sortConfig.key;
//       const params: any = {
//         page: orphanPage,
//         limit: pageSize,
//         sortField: mappedKey,
//         sortOrder: sortConfig.direction,
//       };
//       const queryString = new URLSearchParams(params).toString();
//       const result = await getOrphans(queryString);
//       const { totalCount } = result;
//       setTotalCount(totalCount);
//       const orphanData = result.response.map((item: any) => ({
//         id: item.software_id,
//         businessCapabilityName: item.capability !== "-" ? item.capability : "-",
//         domain: item.domain !== "-" ? item.domain : "-",
//         subDomain: item.subdomain !== "-" ? item.subdomain : "-",
//         applicationName: item.software_name,
//         region: item.region,
//         country: item.country,
//         status: item.status,
//         E2EBusinessProcess: item.e2ebusiness || "-",
//       }));
//       setOrphanData(orphanData);
//     } catch (error) {
//       console.error("Error fetching orphans:", error);
//       alert("Failed to fetch orphans. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSort = (key: string) => {
//     setSortConfig((prevSortConfig) => {
//       let direction: "ASC" | "DESC" | "" = "ASC";
//       if (prevSortConfig.key === key) {
//         direction = prevSortConfig.direction === "ASC" ? "DESC" : "";
//       }
//       return { key, direction };
//     });
//   };

//   const handleFileAreaClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     try {
//       if (event.target.files && event.target.files.length > 0) {
//         const selectedFile = event.target.files[0];

//         if (
//           selectedFile.type === "text/csv/xls" ||
//           selectedFile.type ===
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//           selectedFile.type === "application/vnd.ms-excel"
//         ) {
//           const maxFileSize = 10 * 1024 * 1024;
//           if (selectedFile.size > maxFileSize) {
//             alert("File size exceeds the limit of 10MB.");
//             setFile(null);
//           } else {
//             setFile(selectedFile);
//             console.log("File selected:", selectedFile.name);
//           }
//         } else {
//           alert("Please upload a CSV or Excel file.");
//           setFile(null);
//         }
//       }
//     } catch (error) {
//       console.error("Error during file upload:", error);
//       alert(
//         "An error occurred during file upload. Please try again or upload a different file."
//       );
//       setFile(null);
//     }
//   };

//   const handleRemap = async () => {
//     setOpenDialog(true);
//     setLoading(true);
//     try {
//       const data = await callRemap();
//       setApplications(data.applications);
//       setMappedApplications(data.mappedAppliactions);
//       setOrphans(data.orphans);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadClick = async () => {
//     if (!file) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     setOpen(false);
//     setShowImportButton(true);
//     setOpenDialog(true);
//     setLoading(true);
//     try {
//       const data = await uploadFile(formData);
//       setFile(null);
//       setApplications(data.applications);
//       setMappedApplications(data.mappedAppliactions);
//       setOrphans(data.orphans);

//       console.log("file upload successfully:", data.fileUrl);
//     } catch (error) {
//       setShowImportButton(true);
//       setOpen(false);
//       console.error("Error during file upload:", error);
//       alert(
//         "An error occurred during file upload. Please try again or upload a different file."
//       );
//       setFile(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFile(null);
//     setOpen(false);
//     setShowImportButton(true);
//   };

//   const handleDialogClose = () => {
//     setFile(null);
//     setOpenDialog(false);
//     setSelectedTab(0);
//     console.log("Dialog closed");
//   };

//   const handleDownloadTemplate = () => {
//     const link = document.createElement("a");
//     link.href = "/example_app_inventory.xlsx";
//     link.download = "example_app_inventory.xlsx";
//     link.click();
//   };

//   const openUpload = () => {
//     setShowImportButton(false);
//     setOpen(true);
//   };

//   const handleAddNew = () => {
//     setOpenAddDialog(true);
//   };

//   const handleAddDialogClose = () => {
//     setOpenAddDialog(false);
//   };

//   const handleSave = async (items: ApplicationMapping[]) => {
//     try {
//       const validItems = items.filter(
//         (item) =>
//           item.core_id &&
//           item.domain_id &&
//           item.subdomain_id &&
//           item.name &&
//           item.region &&
//           item.country &&
//           item.status &&
//           item.e2e_id
//       );
//       if (validItems.length !== items.length) {
//         alert("Some items were incomplete and were not submitted.");
//       }
//       for (const item of validItems) {
//         const payload = {
//           core_id: item.core_id,
//           domain_id: item.domain_id,
//           subdomain_id: item.subdomain_id,
//           name: item.name,
//           status: item.status,
//           e2e_id: item.e2e_id,
//           region: item.region,
//           country: item.country,
//         };
//         await createApplication(JSON.stringify(payload));
//       }
//       setOpenAddDialog(false);
//       await fetchMappedApplications();
//     } catch (error) {
//       alert(
//         "An error occurred while adding the new item(s). Please try again."
//       );
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setData((prevData) => {
//       const updatedData = { ...prevData, [field]: value };
//       console.log("=====Updated data:", updatedData);
//       if (field === "businessCapabilityName") {
//         updatedData.core_id = value;
//       } else if (field === "domain") {
//         updatedData.domain_id = value;
//       } else if (field === "subDomain") {
//         updatedData.subdomain_id = value;
//       } else if (field === "applicationName") {
//         updatedData.name = value;
//       } else if (field === "E2EBusinessProcess") {
//         updatedData.E2EBusinessProcess = value;
//       } else if (field === "regionName") {
//         updatedData.regionName = value;
//       } else if (field === "countryName") {
//         updatedData.countryName = value;
//       } else if (field === "status") {
//         updatedData.status = value;
//       }

//       return updatedData;
//     });
//   };

//   const statusOptions = statuses.map((status) => ({
//     id: status,
//     name: status,
//   }));

//   return (
//     <Box className="container" sx={{ backgroundColor: '#F9FAFB', minHeight: '100vh', padding: 3 }}>
//       <AppBar
//         position="static"
//         color="default"
//         sx={{
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
//           backgroundColor: '#FFFFFF',
//           borderRadius: 2,
//           border: '1px solid #E5E7EB',
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: 2.5,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 3, flex: 1 }}>
//             {selectedTab !== -1 && (
//               <Tabs
//                 value={selectedTab}
//                 onChange={handleTabChange}
//                 aria-label="Upload Tabs"
//                 sx={{
//                   '& .MuiTabs-indicator': {
//                     backgroundColor: '#008C8C',
//                     height: 3,
//                     borderRadius: '3px 3px 0 0',
//                   },
//                 }}
//               >
//                 <Tab
//                   label="Mapping"
//                   sx={{
//                     fontWeight: 600,
//                     fontSize: '15px',
//                     color: '#1F2937',
//                     textTransform: 'none',
//                     minHeight: 48,
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       color: '#008C8C',
//                       backgroundColor: 'rgba(0, 140, 140, 0.04)',
//                     },
//                     '&.Mui-selected': {
//                       color: '#008C8C',
//                       fontWeight: 700,
//                     },
//                   }}
//                 />
//                 <Tab
//                   label="Orphan"
//                   sx={{
//                     fontWeight: 600,
//                     fontSize: '15px',
//                     color: '#1F2937',
//                     textTransform: 'none',
//                     minHeight: 48,
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       color: '#008C8C',
//                       backgroundColor: 'rgba(0, 140, 140, 0.04)',
//                     },
//                     '&.Mui-selected': {
//                       color: '#008C8C',
//                       fontWeight: 700,
//                     },
//                   }}
//                 />
//               </Tabs>
//             )}
//           </Box>

//           <Box sx={{ display: "flex", gap: 2, alignItems: 'center' }}>
//             {selectedTab !== -1 && (
//               <SearchBar
//                 value={searchTerm}
//                 onChange={(value) => {
//                   setSearchTerm(value);
//                   if (selectedTab === 0) {
//                     setPage(1);
//                   } else {
//                     setOrphanPage(1);
//                   }
//                 }}
//                 placeholder={`Search ${
//                   selectedTab === 0
//                     ? "mapped products by name, domain, or capability"
//                     : "orphan products by name or region"
//                 }...`}
//                 width={400}
//               />
//             )}

//             {showImportButton && selectedTab === 0 && (
//               <CustomButton
//                 title="Import File"
//                 backgroundColor="#1F2937"
//                 color="white"
//                 handleClick={() => {
//                   openUpload();
//                   setSelectedTab(-1);
//                 }}
//                 variant="contained"
//                 icon={<AddIcon />}
//                 sx={{
//                   borderRadius: '10px',
//                   margin: 0,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   paddingX: 3,
//                   paddingY: 1.2,
//                   boxShadow: '0 2px 8px rgba(31, 41, 55, 0.15)',
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     backgroundColor: '#374151',
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(31, 41, 55, 0.25)',
//                   },
//                 }}
//               />
//             )}
//             {selectedTab === 0 && (
//               <CustomButton
//                 title="Add New"
//                 backgroundColor="#008C8C"
//                 color="white"
//                 handleClick={handleAddNew}
//                 variant="contained"
//                 icon={<AddIcon />}
//                 sx={{
//                   borderRadius: '10px',
//                   margin: 0,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   paddingX: 3,
//                   paddingY: 1.2,
//                   boxShadow: '0 2px 8px rgba(0, 140, 140, 0.15)',
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     backgroundColor: '#007070',
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(0, 140, 140, 0.25)',
//                   },
//                 }}
//               />
//             )}
//             {selectedTab === 1 && (
//               <CustomButton
//                 title="Re-map"
//                 backgroundColor="#008C8C"
//                 color="white"
//                 handleClick={handleRemap}
//                 variant="contained"
//                 icon={<ReplayIcon />}
//                 sx={{
//                   borderRadius: '10px',
//                   margin: 0,
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   paddingX: 3,
//                   paddingY: 1.2,
//                   boxShadow: '0 2px 8px rgba(0, 140, 140, 0.15)',
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     backgroundColor: '#007070',
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(0, 140, 140, 0.25)',
//                   },
//                 }}
//               />
//             )}
//           </Box>
//         </Box>
//       </AppBar>

//       {selectedTab === 0 && (
//         <Box
//           sx={{
//             padding: 3,
//             mt: 3,
//             backgroundColor: '#FFFFFF',
//             overflow: 'auto',
//             color: '#1F2937',
//             borderRadius: 2,
//             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
//             border: '1px solid #E5E7EB',
//           }}
//         >
//           <CustomTable
//             data={mappedData}
//             loading={loading}
//             page={page}
//             setPage={setPage}
//             totalCount={totalCount}
//             setTotalCount={setTotalCount}
//             pageSize={pageSize}
//             setPageSize={setPageSize}
//             editCallback={fetchMappedApplications}
//             sortConfig={sortConfig}
//             handleSort={handleSort}
//             searchMode="row"
//             searchTerm={searchTerm}
//           />
//         </Box>
//       )}

//       <CustomAddDialog
//         open={openAddDialog}
//         onClose={handleAddDialogClose}
//         onSave={handleSave}
//         data={data}
//         onChange={handleInputChange}
//         statuses={statusOptions}
//       />

//       {selectedTab === 1 && (
//         <Box
//           sx={{
//             padding: 3,
//             mt: 3,
//             backgroundColor: '#FFFFFF',
//             overflow: 'auto',
//             color: '#1F2937',
//             borderRadius: 2,
//             boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
//             border: '1px solid #E5E7EB',
//           }}
//         >
//           <CustomTable
//             data={orphanData}
//             loading={loading}
//             page={orphanPage}
//             setPage={setOrphanPage}
//             totalCount={totalCount}
//             setTotalCount={setTotalCount}
//             pageSize={pageSize}
//             setPageSize={setPageSize}
//             editCallback={fetchOrphans}
//             sortConfig={sortConfig}
//             handleSort={handleSort}
//             searchMode="row"
//             searchTerm={searchTerm}
//           />
//         </Box>
//       )}

//       {open && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Box
//             sx={{
//               padding: 0,
//               width: '620px',
//               margin: 'auto',
//               backgroundColor: '#FFFFFF',
//               overflow: 'auto',
//               color: '#1F2937',
//               borderRadius: '16px',
//               boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
//               border: '1px solid #E5E7EB',
//             }}
//           >
//             <Box
//               sx={{
//                 padding: '24px 28px',
//                 backgroundColor: '#008C8C',
//                 borderRadius: '16px 16px 0 0',
//                 background: 'linear-gradient(135deg, #008C8C 0%, #007070 100%)',
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 fontWeight={700}
//                 sx={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}
//               >
//                 File Upload
//               </Typography>
//             </Box>

//             <Box sx={{ padding: '32px 28px' }}>
//               <Box
//                 onClick={handleFileAreaClick}
//                 sx={{
//                   border: file ? '2px solid #A3E635' : '2px dashed #D1D5DB',
//                   borderRadius: '12px',
//                   padding: 5,
//                   textAlign: 'center',
//                   color: '#6B7280',
//                   cursor: 'pointer',
//                   position: 'relative',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: file ? 'rgba(163, 230, 53, 0.05)' : '#F9FAFB',
//                   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                   '&:hover': {
//                     borderColor: file ? '#A3E635' : '#008C8C',
//                     backgroundColor: file ? 'rgba(163, 230, 53, 0.08)' : 'rgba(0, 140, 140, 0.04)',
//                     transform: 'translateY(-2px)',
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
//                   },
//                 }}
//               >
//                 {file ? (
//                   <>
//                     <CheckCircleOutlineIcon
//                       sx={{
//                         fontSize: 56,
//                         color: '#A3E635',
//                         marginBottom: 2,
//                         animation: 'checkmark 0.4s ease-in-out',
//                         '@keyframes checkmark': {
//                           '0%': { transform: 'scale(0.8)', opacity: 0 },
//                           '50%': { transform: 'scale(1.1)' },
//                           '100%': { transform: 'scale(1)', opacity: 1 },
//                         },
//                       }}
//                     />
//                     <Typography
//                       variant="body1"
//                       sx={{
//                         color: '#1F2937',
//                         fontWeight: 600,
//                         fontSize: '15px',
//                       }}
//                     >
//                       {file.name}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: '#A3E635',
//                         fontWeight: 600,
//                         marginTop: 0.5,
//                       }}
//                     >
//                       Uploaded successfully
//                     </Typography>
//                   </>
//                 ) : (
//                   <>
//                     <CloudUploadOutlinedIcon
//                       sx={{
//                         fontSize: 56,
//                         color: '#008C8C',
//                         marginBottom: 2,
//                       }}
//                     />
//                     <Typography
//                       variant="body1"
//                       sx={{
//                         color: '#1F2937',
//                         fontWeight: 600,
//                         marginBottom: 0.5,
//                       }}
//                     >
//                       Click or drag file to this area to upload
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: '#6B7280', fontSize: '13px' }}
//                     >
//                       Support for CSV, XLSX, or XLS files
//                     </Typography>
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   accept=".csv, .xlsx, .xls"
//                   onChange={handleFileChange}
//                   style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     width: '100%',
//                     height: '100%',
//                     opacity: 0,
//                     cursor: 'pointer',
//                   }}
//                 />
//               </Box>

//               <Box sx={{ mt: 3 }}>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: '#6B7280',
//                     marginBottom: 0.5,
//                     fontSize: '13px',
//                   }}
//                 >
//                   Formats accepted are .csv and .xlsx or .xls
//                 </Typography>

//                 <Divider sx={{ borderColor: '#E5E7EB', my: 2.5 }} />

//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: '#1F2937',
//                     marginBottom: 2,
//                     fontWeight: 500,
//                     fontSize: '14px',
//                   }}
//                 >
//                   If you do not have a file you can use the sample below:
//                 </Typography>

//                 <Button
//                   variant="contained"
//                   startIcon={
//                     <DescriptionOutlinedIcon sx={{ color: '#A3E635' }} />
//                   }
//                   onClick={handleDownloadTemplate}
//                   sx={{
//                     backgroundColor: '#F9FAFB',
//                     color: '#1F2937',
//                     boxShadow: 'none',
//                     border: '1.5px solid #E5E7EB',
//                     textTransform: 'none',
//                     fontWeight: 600,
//                     fontSize: '14px',
//                     paddingX: 2.5,
//                     paddingY: 1.2,
//                     borderRadius: '10px',
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       backgroundColor: '#FFFFFF',
//                       borderColor: '#008C8C',
//                       color: '#008C8C',
//                       transform: 'translateY(-1px)',
//                       boxShadow: '0 2px 8px rgba(0, 140, 140, 0.1)',
//                     },
//                   }}
//                 >
//                   Download Sample Template
//                 </Button>
//               </Box>
//             </Box>

//             <Box
//               sx={{
//                 padding: '20px 28px',
//                 gap: 2,
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 backgroundColor: '#F9FAFB',
//                 borderRadius: '0 0 16px 16px',
//                 borderTop: '1px solid #E5E7EB',
//               }}
//             >
//               <CustomButton
//                 variant="outlined"
//                 handleClick={() => {
//                   handleClose();
//                   setSelectedTab(0);
//                 }}
//                 title="Cancel"
//                 backgroundColor="transparent"
//                 color="#1F2937"
//                 sx={{
//                   border: '1.5px solid #D1D5DB',
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   paddingX: 3,
//                   paddingY: 1.1,
//                   borderRadius: '10px',
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     backgroundColor: '#1F2937',
//                     color: '#FFFFFF',
//                     borderColor: '#1F2937',
//                     transform: 'translateY(-1px)',
//                   },
//                 }}
//               />

//               <CustomButton
//                 handleClick={handleUploadClick}
//                 variant="contained"
//                 title="Upload"
//                 backgroundColor="#008C8C"
//                 color="white"
//                 sx={{
//                   fontWeight: 600,
//                   textTransform: 'none',
//                   paddingX: 3,
//                   paddingY: 1.1,
//                   borderRadius: '10px',
//                   boxShadow: '0 2px 8px rgba(0, 140, 140, 0.15)',
//                   transition: 'all 0.2s ease',
//                   '&:hover': {
//                     backgroundColor: '#007070',
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 4px 12px rgba(0, 140, 140, 0.25)',
//                   },
//                 }}
//               />
//             </Box>
//           </Box>
//         </div>
//       )}

//       <CustomDialog
//         open={openDialog}
//         onClose={handleDialogClose}
//         loading={loading}
//         applications={applications}
//         mappedApplications={mappedApplications}
//         orphans={orphans}
//         selectedTab={selectedTab}
//       />
//     </Box>
//   );
// };

// export default Upload;


import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Divider,
  Card,
  Stack,
  CircularProgress,
} from "@mui/material";
import SearchBar from "components/common/SearchBar";
import AddIcon from "@mui/icons-material/Add";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CustomButton } from "components";
import { IResourceComponentsProps } from "@refinedev/core";
import CustomDialog from "components/common/CustomDialog";
import CustomTable from "components/common/CustomTable";
import CustomAddDialog from "components/common/CustomAddDialog";
import {
  callRemap,
  createApplication,
  getMappedApplications,
  getOrphans,
  uploadFile,
} from "apis";

interface ApplicationMapping {
  core_id: string;
  domain_id: string;
  subdomain_id: string;
  name: string;
  region: string;
  country: string;
  status: string;
  e2e_id: string;
}

interface UploadProps extends IResourceComponentsProps<any, any> {}

const Upload: React.FC<UploadProps> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [applications, setApplications] = React.useState([]);
  const [mappedApplications, setMappedApplications] = React.useState([]);
  const [orphans, setOrphans] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showImportButton, setShowImportButton] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [mappedData, setMappedData] = React.useState([]);
  const [orphanData, setOrphanData] = React.useState([]);
  const location = useLocation();
  const [data, setData] = React.useState({
    businessCapabilityName: "",
    domain: "",
    subDomain: "",
    applicationName: "",
    core_id: "",
    domain_id: "",
    subdomain_id: "",
    name: "",
    E2EBusinessProcess: "",
    regionName: "",
    countryName: "",
    status: "",
  });
  const [businessCapabilities, setBusinessCapabilities] = React.useState<string[]>([]);
  const [E2EBusinessProcess, setE2EBusinessProcess] = React.useState<string[]>([]);
  const [domains, setDomains] = React.useState<string[]>([]);
  const [subDomains, setSubDomains] = React.useState<string[]>([]);
  const [filteredDomains, setFilteredDomains] = React.useState<any[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = React.useState<any[]>([]);
  const [regions, setRegions] = React.useState<string[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [statuses, setStatuses] = React.useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [orphanPage, setOrphanPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ASC" | "DESC" | "";
  }>({
    key: "",
    direction: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const getTabIndexFromQuery = (query: string) => {
    const params = new URLSearchParams(query);
    const tab = params.get("tab");
    switch (tab) {
      case "applications-mapped":
        return 0;
      case "orphans":
        return 1;
      default:
        return 0;
    }
  };

  useEffect(() => {
    setSelectedTab(getTabIndexFromQuery(location.search));
  }, [location]);

  const handleTabChange = (newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (selectedTab === 0) {
      fetchMappedApplications();
    } else if (selectedTab === 1) {
      fetchOrphans();
    }
  }, [selectedTab, page, orphanPage, pageSize, sortConfig]);

  const keyMapping: { [key: string]: string } = {
    businessCapabilityName: "capability",
    domain: "domain",
    subDomain: "subdomain",
    applicationName: "name",
    E2EBusinessProcess: "e2ebusiness",
    region: "region",
    country: "country",
    status: "status",
  };

  const fetchMappedApplications = async () => {
    setLoading(true);
    try {
      const mappedKey = keyMapping[sortConfig.key] || sortConfig.key;
      const params: any = {
        page: page,
        limit: pageSize,
        sortField: mappedKey,
        sortOrder: sortConfig.direction,
      };
      const queryString = new URLSearchParams(params).toString();
      const result = await getMappedApplications(queryString);
      console.log("Result:", result);
      const { totalCount } = result;
      setTotalCount(totalCount);
      const mappedData = result.response.map((item: any) => ({
        id: item.software_id,
        businessCapabilityName: item.capability,
        domain: item.domain !== "-" ? item.domain : "-",
        subDomain: item.subdomain !== "-" ? item.subdomain : "-",
        applicationName: item.software_name,
        region: item.region,
        country: item.country,
        status: item.status,
        E2EBusinessProcess: item.e2ebusiness || "-",
      }));
      setMappedData(mappedData);
    } catch (error) {
      console.error("Error fetching mapped products:", error);
      alert("Failed to fetch mapped products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrphans = async () => {
    setLoading(true);
    try {
      const mappedKey = keyMapping[sortConfig.key] || sortConfig.key;
      const params: any = {
        page: orphanPage,
        limit: pageSize,
        sortField: mappedKey,
        sortOrder: sortConfig.direction,
      };
      const queryString = new URLSearchParams(params).toString();
      const result = await getOrphans(queryString);
      const { totalCount } = result;
      setTotalCount(totalCount);
      const orphanData = result.response.map((item: any) => ({
        id: item.software_id,
        businessCapabilityName: item.capability !== "-" ? item.capability : "-",
        domain: item.domain !== "-" ? item.domain : "-",
        subDomain: item.subdomain !== "-" ? item.subdomain : "-",
        applicationName: item.software_name,
        region: item.region,
        country: item.country,
        status: item.status,
        E2EBusinessProcess: item.e2ebusiness || "-",
      }));
      setOrphanData(orphanData);
    } catch (error) {
      console.error("Error fetching orphans:", error);
      alert("Failed to fetch orphans. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prevSortConfig) => {
      let direction: "ASC" | "DESC" | "" = "ASC";
      if (prevSortConfig.key === key) {
        direction = prevSortConfig.direction === "ASC" ? "DESC" : "";
      }
      return { key, direction };
    });
  };

  const handleFileAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files && event.target.files.length > 0) {
        const selectedFile = event.target.files[0];

        if (
          selectedFile.type === "text/csv/xls" ||
          selectedFile.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          selectedFile.type === "application/vnd.ms-excel"
        ) {
          const maxFileSize = 10 * 1024 * 1024;
          if (selectedFile.size > maxFileSize) {
            alert("File size exceeds the limit of 10MB.");
            setFile(null);
          } else {
            setFile(selectedFile);
            console.log("File selected:", selectedFile.name);
          }
        } else {
          alert("Please upload a CSV or Excel file.");
          setFile(null);
        }
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      alert(
        "An error occurred during file upload. Please try again or upload a different file."
      );
      setFile(null);
    }
  };

  const handleRemap = async () => {
    setOpenDialog(true);
    setLoading(true);
    try {
      const data = await callRemap();
      setApplications(data.applications);
      setMappedApplications(data.mappedAppliactions);
      setOrphans(data.orphans);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setOpen(false);
    setShowImportButton(true);
    setOpenDialog(true);
    setLoading(true);
    try {
      const data = await uploadFile(formData);
      setFile(null);
      setApplications(data.applications);
      setMappedApplications(data.mappedAppliactions);
      setOrphans(data.orphans);

      console.log("file upload successfully:", data.fileUrl);
    } catch (error) {
      setShowImportButton(true);
      setOpen(false);
      console.error("Error during file upload:", error);
      alert(
        "An error occurred during file upload. Please try again or upload a different file."
      );
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setOpen(false);
    setShowImportButton(true);
  };

  const handleDialogClose = () => {
    setFile(null);
    setOpenDialog(false);
    setSelectedTab(0);
    console.log("Dialog closed");
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/example_app_inventory.xlsx";
    link.download = "example_app_inventory.xlsx";
    link.click();
  };

  const openUpload = () => {
    setShowImportButton(false);
    setOpen(true);
  };

  const handleAddNew = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleSave = async (items: ApplicationMapping[]) => {
    try {
      const validItems = items.filter(
        (item) =>
          item.core_id &&
          item.domain_id &&
          item.subdomain_id &&
          item.name &&
          item.region &&
          item.country &&
          item.status &&
          item.e2e_id
      );
      if (validItems.length !== items.length) {
        alert("Some items were incomplete and were not submitted.");
      }
      for (const item of validItems) {
        const payload = {
          core_id: item.core_id,
          domain_id: item.domain_id,
          subdomain_id: item.subdomain_id,
          name: item.name,
          status: item.status,
          e2e_id: item.e2e_id,
          region: item.region,
          country: item.country,
        };
        await createApplication(JSON.stringify(payload));
      }
      setOpenAddDialog(false);
      await fetchMappedApplications();
    } catch (error) {
      alert(
        "An error occurred while adding the new item(s). Please try again."
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      console.log("=====Updated data:", updatedData);
      if (field === "businessCapabilityName") {
        updatedData.core_id = value;
      } else if (field === "domain") {
        updatedData.domain_id = value;
      } else if (field === "subDomain") {
        updatedData.subdomain_id = value;
      } else if (field === "applicationName") {
        updatedData.name = value;
      } else if (field === "E2EBusinessProcess") {
        updatedData.E2EBusinessProcess = value;
      } else if (field === "regionName") {
        updatedData.regionName = value;
      } else if (field === "countryName") {
        updatedData.countryName = value;
      } else if (field === "status") {
        updatedData.status = value;
      }

      return updatedData;
    });
  };

  const statusOptions = statuses.map((status) => ({
    id: status,
    name: status,
  }));

  return (
    <Box sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Compact Header with Integrated Controls */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          overflow: "hidden"
        }}
      >
        {/* Title Bar */}
        <Box sx={{ 
          p: 3, 
          background: "linear-gradient(135deg, #008C8C 0%, #006666 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, transparent 0%, rgba(163, 230, 53, 0.15) 100%)",
            pointerEvents: "none"
          }
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ 
                width: 5, 
                height: 42, 
                backgroundColor: "#A3E635",
                borderRadius: 2,
                boxShadow: "0 0 24px rgba(163, 230, 53, 0.6)"
              }} />
              <Typography 
                fontSize={28} 
                fontWeight={700} 
                sx={{ 
                  color: "#F9FAFB",
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
                }}
              >
                {selectedTab === 0 ? "Mapped Products" : selectedTab === 1 ? "Orphan Products" : "Product Management"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              {showImportButton && selectedTab === 0 && (
                <CustomButton
                  title="Import File"
                  backgroundColor="rgba(249, 250, 251, 0.15)"
                  color="#F9FAFB"
                  handleClick={() => {
                    openUpload();
                    setSelectedTab(-1);
                  }}
                  variant="contained"
                  icon={<AddIcon />}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    paddingX: 2.5,
                    paddingY: 1,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(249, 250, 251, 0.3)",
                    height: 38,
                    "&:hover": {
                      backgroundColor: "rgba(249, 250, 251, 0.25)",
                    },
                  }}
                />
              )}
              {selectedTab === 0 && (
                <CustomButton
                  title="Add New"
                  backgroundColor="#A3E635"
                  color="#1F2937"
                  handleClick={handleAddNew}
                  variant="contained"
                  icon={<AddIcon />}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    paddingX: 2.5,
                    paddingY: 1,
                    height: 38,
                    boxShadow: "0 4px 16px rgba(163, 230, 53, 0.4)",
                    "&:hover": {
                      backgroundColor: "#92D500",
                    },
                  }}
                />
              )}
              {selectedTab === 1 && (
                <CustomButton
                  title="Re-map"
                  backgroundColor="#A3E635"
                  color="#1F2937"
                  handleClick={handleRemap}
                  variant="contained"
                  icon={<ReplayIcon />}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    paddingX: 2.5,
                    paddingY: 1,
                    height: 38,
                    boxShadow: "0 4px 16px rgba(163, 230, 53, 0.4)",
                    "&:hover": {
                      backgroundColor: "#92D500",
                    },
                  }}
                />
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Compact Controls Bar */}
        {selectedTab !== -1 && (
          <Box sx={{ 
            p: 2.5, 
            bgcolor: "#FFFFFF",
            borderTop: "3px solid #A3E635"
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* Tab Buttons */}
              <Stack direction="row" spacing={0.5}>
                <Button
                  onClick={() => handleTabChange(0)}
                  sx={{
                    minWidth: 110,
                    height: 36,
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '14px',
                    backgroundColor: selectedTab === 0 ? "#008C8C" : "transparent",
                    color: selectedTab === 0 ? "#F9FAFB" : "#1F2937",
                    border: selectedTab === 0 ? "none" : "1.5px solid #E5E7EB",
                    "&:hover": {
                      backgroundColor: selectedTab === 0 ? "#006B6B" : "rgba(0, 140, 140, 0.08)",
                    },
                  }}
                >
                  Mapping
                </Button>
                <Button
                  onClick={() => handleTabChange(1)}
                  sx={{
                    minWidth: 110,
                    height: 36,
                    borderRadius: '8px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '14px',
                    backgroundColor: selectedTab === 1 ? "#008C8C" : "transparent",
                    color: selectedTab === 1 ? "#F9FAFB" : "#1F2937",
                    border: selectedTab === 1 ? "none" : "1.5px solid #E5E7EB",
                    "&:hover": {
                      backgroundColor: selectedTab === 1 ? "#006B6B" : "rgba(0, 140, 140, 0.08)",
                    },
                  }}
                >
                  Orphan
                </Button>
              </Stack>

              {/* Search Bar */}
              <Box sx={{ flex: 1 }}>
                <SearchBar
                  value={searchTerm}
                  onChange={(value) => {
                    setSearchTerm(value);
                    if (selectedTab === 0) {
                      setPage(1);
                    } else {
                      setOrphanPage(1);
                    }
                  }}
                  placeholder={`Search ${
                    selectedTab === 0
                      ? "mapped products..."
                      : "orphan products..."
                  }`}
                  width="100%"
                />
              </Box>
            </Stack>
          </Box>
        )}
      </Card>

      {/* Table Section */}
      {selectedTab === 0 && (
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 2,
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}
        >
          <CustomTable
            data={mappedData}
            loading={loading}
            page={page}
            setPage={setPage}
            totalCount={totalCount}
            setTotalCount={setTotalCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            editCallback={fetchMappedApplications}
            sortConfig={sortConfig}
            handleSort={handleSort}
            searchMode="row"
            searchTerm={searchTerm}
          />
        </Card>
      )}

      <CustomAddDialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        onSave={handleSave}
        data={data}
        onChange={handleInputChange}
        statuses={statusOptions}
      />

      {selectedTab === 1 && (
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 2,
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}
        >
          <CustomTable
            data={orphanData}
            loading={loading}
            page={orphanPage}
            setPage={setOrphanPage}
            totalCount={totalCount}
            setTotalCount={setTotalCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            editCallback={fetchOrphans}
            sortConfig={sortConfig}
            handleSort={handleSort}
            searchMode="row"
            searchTerm={searchTerm}
          />
        </Card>
      )}

      {open && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              padding: 0,
              width: '620px',
              margin: 'auto',
              backgroundColor: '#FFFFFF',
              overflow: 'auto',
              color: '#1F2937',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid #E5E7EB',
            }}
          >
            <Box
              sx={{
                padding: '24px 28px',
                backgroundColor: '#008C8C',
                borderRadius: '16px 16px 0 0',
                background: 'linear-gradient(135deg, #008C8C 0%, #007070 100%)',
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}
              >
                File Upload
              </Typography>
            </Box>

            <Box sx={{ padding: '32px 28px' }}>
              <Box
                onClick={handleFileAreaClick}
                sx={{
                  border: file ? '2px solid #A3E635' : '2px dashed #D1D5DB',
                  borderRadius: '12px',
                  padding: 5,
                  textAlign: 'center',
                  color: '#6B7280',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: file ? 'rgba(163, 230, 53, 0.05)' : '#F9FAFB',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: file ? '#A3E635' : '#008C8C',
                    backgroundColor: file ? 'rgba(163, 230, 53, 0.08)' : 'rgba(0, 140, 140, 0.04)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                {file ? (
                  <>
                    <CheckCircleOutlineIcon
                      sx={{
                        fontSize: 56,
                        color: '#A3E635',
                        marginBottom: 2,
                        animation: 'checkmark 0.4s ease-in-out',
                        '@keyframes checkmark': {
                          '0%': { transform: 'scale(0.8)', opacity: 0 },
                          '50%': { transform: 'scale(1.1)' },
                          '100%': { transform: 'scale(1)', opacity: 1 },
                        },
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#1F2937',
                        fontWeight: 600,
                        fontSize: '15px',
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#A3E635',
                        fontWeight: 600,
                        marginTop: 0.5,
                      }}
                    >
                      Uploaded successfully
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUploadOutlinedIcon
                      sx={{
                        fontSize: 56,
                        color: '#008C8C',
                        marginBottom: 2,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#1F2937',
                        fontWeight: 600,
                        marginBottom: 0.5,
                      }}
                    >
                      Click or drag file to this area to upload
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#6B7280', fontSize: '13px' }}
                    >
                      Support for CSV, XLSX, or XLS files
                    </Typography>
                  </>
                )}
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6B7280',
                    marginBottom: 0.5,
                    fontSize: '13px',
                  }}
                >
                  Formats accepted are .csv and .xlsx or .xls
                </Typography>

                <Divider sx={{ borderColor: '#E5E7EB', my: 2.5 }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: '#1F2937',
                    marginBottom: 2,
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  If you do not have a file you can use the sample below:
                </Typography>

                <Button
                  variant="contained"
                  startIcon={
                    <DescriptionOutlinedIcon sx={{ color: '#A3E635' }} />
                  }
                  onClick={handleDownloadTemplate}
                  sx={{
                    backgroundColor: '#F9FAFB',
                    color: '#1F2937',
                    boxShadow: 'none',
                    border: '1.5px solid #E5E7EB',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    paddingX: 2.5,
                    paddingY: 1.2,
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#FFFFFF',
                      borderColor: '#008C8C',
                      color: '#008C8C',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0, 140, 140, 0.1)',
                    },
                  }}
                >
                  Download Sample Template
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                padding: '20px 28px',
                gap: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: '#F9FAFB',
                borderRadius: '0 0 16px 16px',
                borderTop: '1px solid #E5E7EB',
              }}
            >
              <CustomButton
                variant="outlined"
                handleClick={() => {
                  handleClose();
                  setSelectedTab(0);
                }}
                title="Cancel"
                backgroundColor="transparent"
                color="#1F2937"
                sx={{
                  border: '1.5px solid #D1D5DB',
                  fontWeight: 600,
                  textTransform: 'none',
                  paddingX: 3,
                  paddingY: 1.1,
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#1F2937',
                    color: '#FFFFFF',
                    borderColor: '#1F2937',
                    transform: 'translateY(-1px)',
                  },
                }}
              />

              <CustomButton
                handleClick={handleUploadClick}
                variant="contained"
                title="Upload"
                backgroundColor="#008C8C"
                color="white"
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  paddingX: 3,
                  paddingY: 1.1,
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(0, 140, 140, 0.15)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#007070',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 140, 140, 0.25)',
                  },
                }}
              />
            </Box>
          </Box>
        </div>
      )}

      <CustomDialog
        open={openDialog}
        onClose={handleDialogClose}
        loading={loading}
        applications={applications}
        mappedApplications={mappedApplications}
        orphans={orphans}
        selectedTab={selectedTab}
      />
    </Box>
  );
};

export default Upload;