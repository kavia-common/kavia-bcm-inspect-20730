// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { Table, Input, Button, Select, Menu } from "antd";
// import {
//   DownloadOutlined,
//   ArrowUpwardOutlined,
//   ArrowDownwardOutlined,
// } from "@mui/icons-material";
// import { DownOutlined } from "@ant-design/icons";
// import { saveAs } from "file-saver";
// import { getReportData, getReportExport, getRegions, getCountrys } from "apis";
// import { Box, TablePagination, Typography } from "@mui/material";
// import {
//   Table as MUITable,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import AIChat from "components/chatWindow";
// import { MessageCircle } from "lucide-react";
// import CustomPagination from "components/common/CustomPagination";

// interface DataItem {
//   country: string;
//   region: string;
//   cap: string;
//   e2e: string;
//   domain: string;
//   subdomain: string;
//   name: string;
//   status: string;
//   business_owner: string;
// }

// interface ProcessedDataItem extends DataItem {
//   [key: string]: string; // Allow string indexing for dynamic field access
// }

// interface TagRenderProps {
//   label: React.ReactNode;
//   value: string;
//   closable?: boolean;
//   onClose?: () => void;
// }

// const Report: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const urlFilter = searchParams.get("filter") || "";

//   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
//   const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
//   const [selectType, setSelectType] = useState<string>("All"); // New state for Select Type filter
//   const [region, setRegion] = useState<string>("");
//   const [filterType, setFilterType] = useState<string>(""); // New state for filter type
//   const [search, setSearch] = useState<string>(""); // Search term for the selected filter type
//   const [globalSearch, setGlobalSearch] = useState<string>("");
//   const [debouncedGlobalSearch, setDebouncedGlobalSearch] =
//     useState<string>("");
//   const [debouncedSearch, setDebouncedSearch] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [pageSize, setPageSize] = useState<number>(0); // Page size state
//   const [loading, setLoading] = useState<boolean>(false); // Loading state
//   const [data, setData] = useState<ProcessedDataItem[]>([]);
//   const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
//   const [countries, setCountries] = useState<{ id: string; name: string }[]>(
//     []
//   );
//   const [totalData, setTotalData] = useState<number>(0);
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: "ASC" | "DESC" | "";
//   }>({
//     key: "",
//     direction: "",
//   });
//   const [persistentMessages, setPersistentMessages] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const handleClose = () => {
//     setIsModalOpen(false);
//   };

//   const keyMapping: { [key: string]: string } = {
//     country: "country",
//     region: "region",
//     cap: "cap",
//     e2e: "e2e",
//     domain: "domain",
//     subdomain: "subdomain",
//     name: "name",
//     status: "status",
//   };

//   const columns = [
//     { title: "Application Name", dataIndex: "name", key: "name" },
//     { title: "Status", dataIndex: "status", key: "status" },
//     { title: "E2E Business Process", dataIndex: "e2e", key: "e2e" },
//     { title: "Business Capability", dataIndex: "cap", key: "cap" },
//     { title: "Domain", dataIndex: "domain", key: "domain" },
//     { title: "Sub-domain", dataIndex: "subdomain", key: "subDomain" },
//     { title: "Region", dataIndex: "region", key: "regional" },
//     { title: "Country", dataIndex: "country", key: "type" },
//   ];

//   // Handle URL filter on component mount
//   useEffect(() => {
//     if (urlFilter) {
//       const filterMap: Record<string, string> = {
//         businessCapabilities: "cap",
//         E2EBusinessProcess: "e2e",
//         domain: "domain",
//         subDomain: "subdomain",
//       };
//       const filterField = filterMap[urlFilter];
//       if (filterField) {
//         setFilterType(filterField);
//         setSearch("");
//       }
//     }
//   }, [urlFilter]);

//   // Updated sort handler
//   const handleSort = (key: string) => {
//     setSortConfig((prevSortConfig) => {
//       let direction: "ASC" | "DESC" | "" = "ASC";
//       if (prevSortConfig.key === key) {
//         direction = prevSortConfig.direction === "ASC" ? "DESC" : "";
//       }
//       return { key, direction };
//     });
//   };

//   const getFilters = () => {
//     const mappedKey = keyMapping[sortConfig.key] || sortConfig.key;
//     const filter: any = {
//       ...(selectType === "Regional" && selectedRegions.length > 0
//         ? { region: selectedRegions }
//         : {}),
//       ...(selectType === "Country" && selectedCountries.length > 0
//         ? { country: selectedCountries }
//         : {}),
//       ...(debouncedSearch ? { [filterType]: debouncedSearch } : {}),
//       ...(selectType !== "All" ? { reportType: selectType } : {}),
//       ...(globalSearch ? { globalSearch } : {}),
//     };

//     // Ensure required fields are present for regional/country reports
//     if (
//       selectType === "Regional" &&
//       (!filter.region || filter.region.length === 0)
//     ) {
//       filter.region = regions.map((r) => r.name); // Select all if none selected
//     }
//     if (
//       selectType === "Country" &&
//       (!filter.country || filter.country.length === 0)
//     ) {
//       filter.country = countries.map((c) => c.name); // Select all if none selected
//     }

//     return {
//       filter,
//       page: currentPage,
//       limit: pageSize,
//       sortField: mappedKey,
//       sortOrder: sortConfig.direction,
//     };
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true); // Start loading

//       // Check if sorting should be done on frontend for specific URL filters
//       const frontendSortFilters = [
//         "businessCapabilities",
//         "E2EBusinessProcess",
//         "domain",
//         "subDomain",
//       ];
//       let response;
//       if (frontendSortFilters.includes(urlFilter)) {
//         // Fetch data without sorting
//         response = await getReportData(
//           JSON.stringify({
//             filter: {
//               ...(search ? { [filterType]: search } : {}),
//             },
//             page: 1,
//             limit: 0,
//           })
//         );
//       } else {
//         // Regular API call with sorting
//         response = await getReportData(JSON.stringify(getFilters()));
//       }

//       const filteredData = response?.response.filter((item: DataItem) => {
//         if (urlFilter === "businessCapabilities")
//           return item.cap && item.cap !== "-";
//         if (urlFilter === "E2EBusinessProcess")
//           return item.e2e && item.e2e !== "-";
//         if (urlFilter === "domain") return item.domain && item.domain !== "-";
//         if (urlFilter === "subDomain")
//           return item.subdomain && item.subdomain !== "-";
//         return true;
//       });

//       let processedData: ProcessedDataItem[] = (filteredData || []).map(
//         (item: DataItem) => ({
//           country:
//             item.country === "empty" || !item.country ? "-" : item.country,
//           region: item.region === "empty" || !item.region ? "-" : item.region,
//           cap: item.cap || "-",
//           e2e: item.e2e || "-",
//           domain: item.domain || "-",
//           subdomain: item.subdomain || "-",
//           name: item.name || "-",
//           status: item.status || "-",
//           business_owner: item.business_owner || "-",
//         })
//       );

//       // Apply global search if it exists
//       if (debouncedGlobalSearch) {
//         const searchTerm = debouncedGlobalSearch.toLowerCase();
//         processedData = processedData.filter((item: ProcessedDataItem) =>
//           Object.values(item).some((value: string) =>
//             value.toLowerCase().includes(searchTerm)
//           )
//         );
//       }

//       let finalData = processedData;

//       // Frontend sorting for specific URL filters
//       if (
//         frontendSortFilters.includes(urlFilter) &&
//         sortConfig.key &&
//         sortConfig.direction
//       ) {
//         finalData = processedData.sort(
//           (a: ProcessedDataItem, b: ProcessedDataItem) => {
//             const key = sortConfig.key === "cap" ? "cap" : sortConfig.key;
//             if (a[key] === b[key]) return 0;
//             if (sortConfig.direction === "ASC") {
//               return a[key] < b[key] ? -1 : 1;
//             } else if (sortConfig.direction === "DESC") {
//               return a[key] > b[key] ? -1 : 1;
//             }
//             return 0;
//           }
//         );
//       }

//       if (selectType === "All") {
//         setData(processedData || []);
//       } else if (selectType === "global") {
//         setData(processedData || []);
//       } else {
//         setData(
//           processedData.filter(
//             (e: ProcessedDataItem) => e.region !== "Global"
//           ) || []
//         );
//       }

//       // setTotalData(response?.totalCount || 0);
//       setTotalData(processedData.length || 0);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       // Handle error appropriately
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // const fetchRegions = async () => {
//   //   try {
//   //     const regionsData = await getRegions();
//   //     const filteredRegions = regionsData?.filter(
//   //       (region: any) => region.name && region.name.trim() !== "empty"
//   //     );
//   //     console.log(filteredRegions);
//   //     setRegions(filteredRegions.filter((e: any) => e.name !== "Global") || []);
//   //   } catch (error) {
//   //     console.error("Error fetching regions:", error);
//   //   }
//   // };

//   // const fetchCountries = async () => {
//   //   try {
//   //     const countriesData = await getCountrys();
//   //     const filteredCountries = countriesData?.filter(
//   //       (country: any) => country.name && country.name.trim() !== "empty"
//   //     );
//   //     setCountries(
//   //       filteredCountries.filter((e: any) => e.name !== "Global") || []
//   //     );
//   //   } catch (error) {
//   //     console.error("Error fetching countries:", error);
//   //   }
//   // };
//   const fetchRegions = async () => {
//     try {
//       const regionsData = await getRegions();
//       const filteredRegions = regionsData?.filter(
//         (region: { name: string }) =>
//           region.name && region.name.trim() !== "empty"
//       );
//       const processedRegions =
//         filteredRegions.filter((e: { name: string }) => e.name !== "Global") ||
//         [];
//       setRegions(processedRegions);
//       // Automatically select all regions
//       if (selectType === "Regional") {
//         setSelectedRegions(processedRegions.map((region: any) => region.name));
//       }
//     } catch (error) {
//       console.error("Error fetching regions:", error);
//     }
//   };

//   const fetchCountries = async () => {
//     try {
//       const countriesData = await getCountrys();
//       const filteredCountries = countriesData?.filter(
//         (country: { name: string }) =>
//           country.name && country.name.trim() !== "empty"
//       );
//       const processedCountries =
//         filteredCountries.filter(
//           (e: { name: string }) => e.name !== "Global"
//         ) || [];
//       setCountries(processedCountries);
//       // Automatically select all countries
//       if (selectType === "Country") {
//         setSelectedCountries(
//           processedCountries.map((country: any) => country.name)
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//     }
//   };

//   // Add these useEffect hooks after your existing useEffects
//   useEffect(() => {
//     if (selectType === "Regional") {
//       fetchRegions().then(() => {
//         setSelectedRegions(
//           regions.map((region: { name: string }) => region.name)
//         );
//       });
//     }
//   }, [selectType === "Regional"]);

//   useEffect(() => {
//     if (selectType === "Country") {
//       fetchCountries().then(() => {
//         setSelectedCountries(
//           countries.map((country: { name: string }) => country.name)
//         );
//       });
//     }
//   }, [selectType === "Country"]);

//   const getExport = async () => {
//     const body = JSON.stringify(getFilters());
//     const data = await getReportExport(body);
//     console.log(data);
//     saveAs(data?.csvUrl, "export.csv");
//   };

//   // First, modify the resetState function
//   const resetState = useCallback(() => {
//     // Reset all states in a single batch
//     setSelectedRegions([]);
//     setSelectedCountries([]);
//     setSelectType("All");
//     setFilterType("");
//     setSearch("");
//     setGlobalSearch("");
//     setCurrentPage(1);
//     setPageSize(0);
//     setSortConfig({ key: "", direction: "" });
//     fetchData();
//   }, []);

//   // Modify the handleResetForm function
//   const handleResetForm = useCallback(async () => {
//     // Reset the state first
//     resetState();

//     // Immediately fetch data with reset filters
//     try {
//       setLoading(true);
//       const response = await getReportData(
//         JSON.stringify({
//           filter: {},
//           page: 1,
//           limit: 0,
//         })
//       );

//       if (response?.response) {
//         const processedData = response.response.map((item: DataItem) => ({
//           ...item,
//           country:
//             item.country === "empty" || !item.country ? "-" : item.country,
//           region: item.region === "empty" || !item.region ? "-" : item.region,
//           cap: item.cap || "-",
//           e2e: item.e2e || "-",
//           domain: item.domain || "-",
//           subdomain: item.subdomain || "-",
//           name: item.name || "-",
//           status: item.status || "-",
//           business_owner: item.business_owner || "-",
//         }));

//         setData(processedData);
//         setTotalData(response.totalCount || 0);
//       } else {
//         setData([]);
//         setTotalData(0);
//       }
//     } catch (error) {
//       console.error("Error resetting data:", error);
//       setData([]);
//       setTotalData(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [resetState]);

//   // Debounce function
//   const debounce = useCallback((func: Function, wait: number) => {
//     let timeout: NodeJS.Timeout;
//     return (...args: any[]) => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func(...args), wait);
//     };
//   }, []);

//   // Debounced search handlers
//   const debouncedGlobalSearchHandler = useMemo(
//     () => debounce((value: string) => setDebouncedGlobalSearch(value), 500),
//     [debounce]
//   );

//   const debouncedSearchHandler = useMemo(
//     () => debounce((value: string) => setDebouncedSearch(value), 500),
//     [debounce]
//   );

//   // Update debounced values when search inputs change
//   useEffect(() => {
//     debouncedGlobalSearchHandler(globalSearch);
//   }, [globalSearch, debouncedGlobalSearchHandler]);

//   useEffect(() => {
//     debouncedSearchHandler(search);
//   }, [search, debouncedSearchHandler]);

//   useEffect(() => {
//     fetchData();
//   }, [
//     pageSize,
//     currentPage,
//     sortConfig,
//     urlFilter,
//     debouncedGlobalSearch,
//     debouncedSearch,
//   ]);

//   const handleApply = () => {
//     fetchData();
//   };

//   const getHeaderText = () => {
//     if (urlFilter) {
//       const filterLabels: Record<string, string> = {
//         businessCapabilities: "Applications with Business Capabilities Mapping",
//         E2EBusinessProcess: "Applications with E2E Business Process",
//         domain: "Applications with Domain Mapping",
//         subDomain: "Applications with Sub-domain Mapping",
//       };
//       return filterLabels[urlFilter] || "Filtered Applications";
//     }
//     return "Reports";
//   };

//   const handleClearDrillDown = () => {
//     navigate("/Reports");
//     setSearch("");
//     setFilterType("");
//     setSortConfig({ key: "", direction: "" });
//   };

//   return (
//     <div className="regional-report">
//       <div className="Report-header" style={{ marginBottom: "10px" }}>
//         <Typography fontSize={28} fontWeight={700} color="#11142D" mb={2}>
//           {getHeaderText()}
//         </Typography>
//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             alignItems: "center",
//             marginBottom: "15px",
//           }}
//         >
//           <Input
//             placeholder="Report Search (search across)"
//             value={globalSearch}
//             onChange={(e) => setGlobalSearch(e.target.value)}
//             style={{ flex: 1, padding: "10px", width: "400px" }}
//             prefix={
//               <span role="img" aria-label="search">
//                 <SearchIcon />
//               </span>
//             }
//             // allowClear
//             suffix={
//               globalSearch && (
//                 <span
//                   onClick={() => setGlobalSearch("")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <ClearIcon />
//                 </span>
//               )
//             }
//           />
//           {urlFilter && (
//             <Button
//               type="default"
//               onClick={handleClearDrillDown}
//               style={{ padding: "10px 20px" }}
//             >
//               Clear Drill Down
//             </Button>
//           )}
//           <Button
//             icon={<DownloadOutlined />}
//             onClick={getExport}
//             className="export-button"
//           >
//             Export
//           </Button>
//         </div>
//       </div>
//       <div
//         className="filters"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "10px",
//           marginBottom: "15px",
//         }}
//       >
//         {/* <Select
//           placeholder="Select Type"
//           onChange={(value: string) => setSelectType(value)}
//           allowClear
//           style={{ flex: 1, maxWidth: "300px", height: "45px" }}
//           value={selectType}
//         >
//           <Select.Option value="All">All</Select.Option>
//           <Select.Option value="global">Global</Select.Option>
//           <Select.Option value="Regional">Regional</Select.Option>
//           <Select.Option value="Country">Country</Select.Option>
//         </Select> */}

//         <Select
//           placeholder="Select Type"
//           onChange={(value) => setSelectType(value)}
//           allowClear
//           style={{ flex: 1, maxWidth: "300px", height: "45px" }}
//           value={selectType}
//           disabled={!!urlFilter}
//         >
//           <Select.Option value="All">All</Select.Option>
//           <Select.Option value="global">Global</Select.Option>
//           <Select.Option value="Regional">Regional</Select.Option>
//           <Select.Option value="Country">Country</Select.Option>
//         </Select>

//         {selectType === "Regional" && (
//           <Select
//             mode="multiple"
//             placeholder="Select Regions"
//             onFocus={fetchRegions}
//             onChange={(values: string[]) => {
//               if (values.includes("all")) {
//                 setSelectedRegions(regions.map((region: any) => region.name));
//               } else {
//                 setSelectedRegions(values.filter((value) => value !== "all"));
//               }
//             }}
//             value={
//               selectedRegions.length === regions.length
//                 ? ["all"]
//                 : selectedRegions
//             }
//             allowClear
//             style={{ width: "400px", maxWidth: "300px", height: "45px" }}
//             maxTagCount={1}
//             maxTagPlaceholder={(omittedValues) =>
//               `+${omittedValues.length} more`
//             }
//             tagRender={(props) => {
//               const { label, value, closable, onClose }: TagRenderProps = props;
//               if (value === "all") {
//                 return (
//                   <div
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       margin: "2px 2px 2px 0",
//                       padding: "4px 8px",
//                       borderRadius: "4px",
//                       backgroundColor: "#e6f7ff",
//                       border: "1px solid #91d5ff",
//                       fontSize: "14px",
//                       color: "#1890ff",
//                     }}
//                   >
//                     Select All
//                   </div>
//                 );
//               }
//               return (
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     margin: "2px 2px 2px 0",
//                     padding: "4px 8px",
//                     borderRadius: "4px",
//                     backgroundColor: "#f0f0f0",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {label}
//                   {closable && (
//                     <span
//                       onClick={onClose}
//                       style={{
//                         marginLeft: "8px",
//                         cursor: "pointer",
//                         color: "#1890ff",
//                       }}
//                     >
//                       ✖
//                     </span>
//                   )}
//                 </div>
//               );
//             }}
//           >
//             <Select.Option key="all" value="all">
//               Select all
//             </Select.Option>
//             {regions.map((region: { id: string; name: string }) => (
//               <Select.Option key={region.id} value={region.name}>
//                 {region.name}
//               </Select.Option>
//             ))}
//           </Select>
//         )}

//         {selectType === "Country" && (
//           <Select
//             mode="multiple"
//             placeholder="Select Countries"
//             onFocus={fetchCountries}
//             onChange={(values: string[]) => {
//               if (values.includes("all")) {
//                 setSelectedCountries(
//                   countries.map((country: any) => country.name)
//                 );
//               } else {
//                 setSelectedCountries(values.filter((value) => value !== "all"));
//               }
//             }}
//             value={
//               selectedCountries.length === countries.length
//                 ? ["all"]
//                 : selectedCountries
//             }
//             allowClear
//             style={{
//               // flex: 1,
//               width: "400px",
//               maxWidth: "350px",
//               height: "45px",
//             }}
//             maxTagCount={1}
//             maxTagPlaceholder={(omittedValues) =>
//               `+${omittedValues.length} more`
//             }
//             tagRender={(props) => {
//               const { label, value, closable, onClose } = props;
//               if (value === "all") {
//                 return (
//                   <div
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       margin: "2px 2px 2px 0",
//                       padding: "4px 8px",
//                       borderRadius: "4px",
//                       backgroundColor: "#e6f7ff",
//                       border: "1px solid #91d5ff",
//                       fontSize: "14px",
//                       color: "#1890ff",
//                     }}
//                   >
//                     Select All
//                   </div>
//                 );
//               }
//               return (
//                 <div
//                   style={{
//                     display: "inline-flex",
//                     alignItems: "center",
//                     margin: "2px 2px 2px 0",
//                     padding: "4px 8px",
//                     borderRadius: "4px",
//                     backgroundColor: "#f0f0f0",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {label}
//                   {closable && (
//                     <span
//                       onClick={onClose}
//                       style={{
//                         marginLeft: "8px",
//                         cursor: "pointer",
//                         color: "#1890ff",
//                       }}
//                     >
//                       ✖
//                     </span>
//                   )}
//                 </div>
//               );
//             }}
//           >
//             <Select.Option key="all" value="all">
//               <div style={{ fontWeight: "bold", color: "#1890ff" }}>
//                 Select All
//               </div>
//             </Select.Option>
//             {countries.map((country: { id: string; name: string }) => (
//               <Select.Option key={country.id} value={country.name}>
//                 {country.name}
//               </Select.Option>
//             ))}
//           </Select>
//         )}

//         <Select
//           placeholder="Filter By"
//           value={filterType}
//           onChange={(value: string) => setFilterType(value)}
//           allowClear
//           style={{ flex: 1, maxWidth: "300px", height: "45px" }}
//           disabled={!!urlFilter}
//         >
//           {columns
//             .filter(
//               (col) => col.dataIndex !== "region" && col.dataIndex !== "country"
//             )
//             .map((col) => (
//               <Select.Option key={col.dataIndex} value={col.dataIndex}>
//                 {col.title}
//               </Select.Option>
//             ))}
//         </Select>

//         <Input
//           placeholder="Search"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ flex: 2, maxWidth: "500px", padding: "10px" }}
//           disabled={!!urlFilter}
//         />
//         <Button
//           type="primary"
//           onClick={handleApply}
//           style={{ flex: "none", padding: "20px" }}
//           disabled={!!urlFilter}
//         >
//           Apply
//         </Button>
//         <Button
//           type="primary"
//           onClick={handleResetForm}
//           style={{ flex: "none", padding: "20px" }}
//         >
//           Clear
//         </Button>
//       </div>

//       <TableContainer
//         component={Paper}
//         sx={{
//           minHeight: 500,
//           maxHeight: 600,
//           overflow: "auto",
//           "& .MuiTable-root": {
//             borderCollapse: "separate",
//             borderSpacing: 0,
//           },
//         }}
//       >
//         {loading ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: Light overlay effect
//               zIndex: 1000,
//             }}
//           >
//             <CircularProgress /> {/* Loading spinner */}
//           </Box>
//         ) : data.length === 0 ? (
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//               flexDirection: "column",
//               textAlign: "center",
//             }}
//           >
//             <img
//               src="https://digitalt3.com/wp-content/uploads/2024/12/No-data-bcm.png"
//               alt="No data found"
//               style={{ maxWidth: "300px" }}
//             />
//             <p>No data found</p>
//           </Box>
//         ) : (
//           <MUITable
//             stickyHeader
//             sx={{
//               minWidth: 650,
//               "& .MuiTableCell-root": {
//                 borderBottom: "none",
//                 padding: "20px 16px",
//               },
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.key}
//                     sx={{
//                       fontWeight: "bold",
//                       fontSize: 16,
//                       backgroundColor: "#e2e2e2",
//                       position: "sticky",
//                       top: 0,
//                       zIndex: 1,
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleSort(column.dataIndex)}
//                   >
//                     {column.title}
//                     {sortConfig.key === column.dataIndex &&
//                       (sortConfig.direction === "ASC" ? (
//                         <ArrowUpwardOutlined
//                           style={{ marginLeft: 8, fontSize: 16 }}
//                         />
//                       ) : sortConfig.direction === "DESC" ? (
//                         <ArrowDownwardOutlined
//                           style={{ marginLeft: 8, fontSize: 16 }}
//                         />
//                       ) : null)}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((row: ProcessedDataItem, index: number) => (
//                 <TableRow
//                   key={index}
//                   hover
//                   sx={{
//                     backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
//                     "&:hover": {
//                       backgroundColor: "#e6f7ff",
//                     },
//                     "&:last-child td, &:last-child th": { border: 0 },
//                   }}
//                 >
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.name}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.status}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.e2e}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.cap}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.domain}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.subdomain}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.region}
//                   </TableCell>
//                   <TableCell sx={{ borderBottom: "1px solid #ddd !important" }}>
//                     {row.country}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </MUITable>
//         )}
//       </TableContainer>

//       <CustomPagination
//         totalData={totalData}
//         currentPage={currentPage}
//         pageSize={pageSize}
//         setCurrentPage={setCurrentPage}
//         setPageSize={setPageSize}
//       />

//       {/* <TablePagination
//   component="div"
//   count={totalData}
//   page={currentPage - 1}
//   onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
//   rowsPerPage={pageSize}
//   onRowsPerPageChange={(event) => {
//     const value = parseInt(event.target.value, 10);
//     setPageSize(value);
//     setCurrentPage(1);
//   }}
//   rowsPerPageOptions={[
//     { label: 'All', value: 0 },
//     10, 50, 100
//   ]}
//   labelDisplayedRows={({ count }) => {
//     const totalPages = pageSize > 0 ? Math.ceil(count / pageSize) : 1;
//     return `Page ${currentPage} of ${totalPages} (${count})`;
//   }}
//   sx={{ 
//     marginTop: 2,
//     '& .MuiTablePagination-selectLabel': { margin: 0 },
//     '& .MuiTablePagination-displayedRows': { margin: 0 },
//   }}
//   SelectProps={{
//     renderValue: (value) => {
//       if (typeof value === 'number') {
//         return <span>{value === 0 ? 'All' : value}</span>;
//       }
//       return null; // Return null as a fallback
//     },
//   }}
// /> */}

//       <>
//         {/* Floating Action Button */}
//         <div className="fixed bottom-20 right-8 z-[1200]">
//           <div className="relative flex items-center justify-center">
//             <span className="absolute w-14 h-14 rounded-full bg-blue-600 opacity-50 animate-ping"></span>
//             <span className="absolute w-19 h-19 rounded-full bg-blue-500 opacity-20 animate-ping"></span>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 relative z-10"
//               aria-label="Open AI Chat"
//             >
//               <MessageCircle className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Modal Overlay */}
//         {isModalOpen && (
//           <div className="fixed inset-0 z-[1400]">
//             <div
//               className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//               onClick={handleClose}
//             />

//             {/* Close Button */}
//             <button
//               onClick={handleClose}
//               className="absolute top-4 right-4 z-[1410] p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-800/70 transition-colors"
//               aria-label="Close chat"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Modal Content - Wrapping AIChat */}
//             <div className="fixed inset-4 md:inset-8 z-[1405]">
//               {/* <div className="w-full h-full overflow-hidden rounded-lg bg-blur dark:bg-gray-900 shadow-xl"> */}
//               {/* Create a stable container with fixed padding */}
//               <div className="h-full w-full p-6">
//                 {/* Wrap AIChat in a div that maintains dimensions */}
//                 <div className="h-full w-full flex flex-col">
//                   {/* Override AIChat's min-h-screen and background classes */}
//                   <div className="h-full [&>div]:min-h-0 [&>div]:h-full [&>div]:bg-none">
//                     <AIChat
//                       initialMessages={persistentMessages}
//                       onMessagesUpdate={(newMessages: any) =>
//                         setPersistentMessages(newMessages)
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     </div>
//   );
// };

// export default Report;


import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Input, Button, Select, Menu } from "antd";
import {
  DownloadOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
} from "@mui/icons-material";
import { DownOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import { getReportData, getReportExport, getRegions, getCountrys } from "apis";
import { Box, TablePagination, Typography, Card, Chip, Stack } from "@mui/material";
import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSearchParams, useNavigate } from "react-router-dom";
import AIChat from "components/chatWindow";
import { MessageCircle } from "lucide-react";
import CustomPagination from "components/common/CustomPagination";

interface DataItem {
  country: string;
  region: string;
  cap: string;
  e2e: string;
  domain: string;
  subdomain: string;
  name: string;
  status: string;
  business_owner: string;
}

interface ProcessedDataItem extends DataItem {
  [key: string]: string;
}

interface TagRenderProps {
  label: React.ReactNode;
  value: string;
  closable?: boolean;
  onClose?: () => void;
}

const Report: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlFilter = searchParams.get("filter") || "";

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectType, setSelectType] = useState<string>("All");
  const [region, setRegion] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [debouncedGlobalSearch, setDebouncedGlobalSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ProcessedDataItem[]>([]);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ASC" | "DESC" | "";
  }>({
    key: "",
    direction: "",
  });
  const [persistentMessages, setPersistentMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const keyMapping: { [key: string]: string } = {
    country: "country",
    region: "region",
    cap: "cap",
    e2e: "e2e",
    domain: "domain",
    subdomain: "subdomain",
    name: "name",
    status: "status",
  };

  const columns = [
    { title: "Digital Product", dataIndex: "name", key: "name" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "E2E Business Process", dataIndex: "e2e", key: "e2e" },
    { title: "Business Capability", dataIndex: "cap", key: "cap" },
    { title: "Domain", dataIndex: "domain", key: "domain" },
    { title: "Sub-domain", dataIndex: "subdomain", key: "subDomain" },
    { title: "Region", dataIndex: "region", key: "regional" },
    { title: "Country", dataIndex: "country", key: "type" },
  ];

  useEffect(() => {
    if (urlFilter) {
      const filterMap: Record<string, string> = {
        businessCapabilities: "cap",
        E2EBusinessProcess: "e2e",
        domain: "domain",
        subDomain: "subdomain",
      };
      const filterField = filterMap[urlFilter];
      if (filterField) {
        setFilterType(filterField);
        setSearch("");
      }
    }
  }, [urlFilter]);

  const handleSort = (key: string) => {
    setSortConfig((prevSortConfig) => {
      let direction: "ASC" | "DESC" | "" = "ASC";
      if (prevSortConfig.key === key) {
        direction = prevSortConfig.direction === "ASC" ? "DESC" : "";
      }
      return { key, direction };
    });
  };

  const getFilters = () => {
    const mappedKey = keyMapping[sortConfig.key] || sortConfig.key;
    const filter: any = {
      ...(selectType === "Regional" && selectedRegions.length > 0
        ? { region: selectedRegions }
        : {}),
      ...(selectType === "Country" && selectedCountries.length > 0
        ? { country: selectedCountries }
        : {}),
      ...(debouncedSearch ? { [filterType]: debouncedSearch } : {}),
      ...(selectType !== "All" ? { reportType: selectType } : {}),
      ...(globalSearch ? { globalSearch } : {}),
    };

    if (selectType === "Regional" && (!filter.region || filter.region.length === 0)) {
      filter.region = regions.map((r) => r.name);
    }
    if (selectType === "Country" && (!filter.country || filter.country.length === 0)) {
      filter.country = countries.map((c) => c.name);
    }

    return {
      filter,
      page: currentPage,
      limit: pageSize,
      sortField: mappedKey,
      sortOrder: sortConfig.direction,
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const frontendSortFilters = [
        "businessCapabilities",
        "E2EBusinessProcess",
        "domain",
        "subDomain",
      ];
      let response;
      if (frontendSortFilters.includes(urlFilter)) {
        response = await getReportData(
          JSON.stringify({
            filter: {
              ...(search ? { [filterType]: search } : {}),
            },
            page: 1,
            limit: 0,
          })
        );
      } else {
        response = await getReportData(JSON.stringify(getFilters()));
      }

      const filteredData = response?.response.filter((item: DataItem) => {
        if (urlFilter === "businessCapabilities")
          return item.cap && item.cap !== "-";
        if (urlFilter === "E2EBusinessProcess")
          return item.e2e && item.e2e !== "-";
        if (urlFilter === "domain") return item.domain && item.domain !== "-";
        if (urlFilter === "subDomain")
          return item.subdomain && item.subdomain !== "-";
        return true;
      });

      let processedData: ProcessedDataItem[] = (filteredData || []).map(
        (item: DataItem) => ({
          country: item.country === "empty" || !item.country ? "-" : item.country,
          region: item.region === "empty" || !item.region ? "-" : item.region,
          cap: item.cap || "-",
          e2e: item.e2e || "-",
          domain: item.domain || "-",
          subdomain: item.subdomain || "-",
          name: item.name || "-",
          status: item.status || "-",
          business_owner: item.business_owner || "-",
        })
      );

      if (debouncedGlobalSearch) {
        const searchTerm = debouncedGlobalSearch.toLowerCase();
        processedData = processedData.filter((item: ProcessedDataItem) =>
          Object.values(item).some((value: string) =>
            value.toLowerCase().includes(searchTerm)
          )
        );
      }

      let finalData = processedData;

      if (
        frontendSortFilters.includes(urlFilter) &&
        sortConfig.key &&
        sortConfig.direction
      ) {
        finalData = processedData.sort(
          (a: ProcessedDataItem, b: ProcessedDataItem) => {
            const key = sortConfig.key === "cap" ? "cap" : sortConfig.key;
            if (a[key] === b[key]) return 0;
            if (sortConfig.direction === "ASC") {
              return a[key] < b[key] ? -1 : 1;
            } else if (sortConfig.direction === "DESC") {
              return a[key] > b[key] ? -1 : 1;
            }
            return 0;
          }
        );
      }

      if (selectType === "All") {
        setData(processedData || []);
      } else if (selectType === "global") {
        setData(processedData || []);
      } else {
        setData(
          processedData.filter(
            (e: ProcessedDataItem) => e.region !== "Global"
          ) || []
        );
      }

      setTotalData(processedData.length || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const regionsData = await getRegions();
      const filteredRegions = regionsData?.filter(
        (region: { name: string }) =>
          region.name && region.name.trim() !== "empty"
      );
      const processedRegions =
        filteredRegions.filter((e: { name: string }) => e.name !== "Global") ||
        [];
      setRegions(processedRegions);
      if (selectType === "Regional") {
        setSelectedRegions(processedRegions.map((region: any) => region.name));
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const countriesData = await getCountrys();
      const filteredCountries = countriesData?.filter(
        (country: { name: string }) =>
          country.name && country.name.trim() !== "empty"
      );
      const processedCountries =
        filteredCountries.filter(
          (e: { name: string }) => e.name !== "Global"
        ) || [];
      setCountries(processedCountries);
      if (selectType === "Country") {
        setSelectedCountries(
          processedCountries.map((country: any) => country.name)
        );
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    if (selectType === "Regional") {
      fetchRegions().then(() => {
        setSelectedRegions(
          regions.map((region: { name: string }) => region.name)
        );
      });
    }
  }, [selectType === "Regional"]);

  useEffect(() => {
    if (selectType === "Country") {
      fetchCountries().then(() => {
        setSelectedCountries(
          countries.map((country: { name: string }) => country.name)
        );
      });
    }
  }, [selectType === "Country"]);

  const getExport = async () => {
    const body = JSON.stringify(getFilters());
    const data = await getReportExport(body);
    console.log(data);
    saveAs(data?.csvUrl, "export.csv");
  };

  const resetState = useCallback(() => {
    setSelectedRegions([]);
    setSelectedCountries([]);
    setSelectType("All");
    setFilterType("");
    setSearch("");
    setGlobalSearch("");
    setCurrentPage(1);
    setPageSize(0);
    setSortConfig({ key: "", direction: "" });
    fetchData();
  }, []);

  const handleResetForm = useCallback(async () => {
    resetState();

    try {
      setLoading(true);
      const response = await getReportData(
        JSON.stringify({
          filter: {},
          page: 1,
          limit: 0,
        })
      );

      if (response?.response) {
        const processedData = response.response.map((item: DataItem) => ({
          ...item,
          country: item.country === "empty" || !item.country ? "-" : item.country,
          region: item.region === "empty" || !item.region ? "-" : item.region,
          cap: item.cap || "-",
          e2e: item.e2e || "-",
          domain: item.domain || "-",
          subdomain: item.subdomain || "-",
          name: item.name || "-",
          status: item.status || "-",
          business_owner: item.business_owner || "-",
        }));

        setData(processedData);
        setTotalData(response.totalCount || 0);
      } else {
        setData([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      setData([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  }, [resetState]);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedGlobalSearchHandler = useMemo(
    () => debounce((value: string) => setDebouncedGlobalSearch(value), 500),
    [debounce]
  );

  const debouncedSearchHandler = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [debounce]
  );

  useEffect(() => {
    debouncedGlobalSearchHandler(globalSearch);
  }, [globalSearch, debouncedGlobalSearchHandler]);

  useEffect(() => {
    debouncedSearchHandler(search);
  }, [search, debouncedSearchHandler]);

  useEffect(() => {
    fetchData();
  }, [
    pageSize,
    currentPage,
    sortConfig,
    urlFilter,
    debouncedGlobalSearch,
    debouncedSearch,
  ]);

  const handleApply = () => {
    fetchData();
  };

  const getHeaderText = () => {
    if (urlFilter) {
      const filterLabels: Record<string, string> = {
        businessCapabilities: "Products with Business Capabilities Mapping",
        E2EBusinessProcess: "Products with E2E Business Process",
        domain: "Products with Domain Mapping",
        subDomain: "Products with Sub-domain Mapping",
      };
      return filterLabels[urlFilter] || "Filtered Products";
    }
    return "Reports";
  };

  const handleClearDrillDown = () => {
    navigate("/Reports");
    setSearch("");
    setFilterType("");
    setSortConfig({ key: "", direction: "" });
  };

  return (
    <Box className="regional-report" sx={{ p: 3, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Compact Header with Integrated Filters */}
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
                {getHeaderText()}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              {urlFilter && (
                <Button
                  type="default"
                  onClick={handleClearDrillDown}
                  icon={<ClearIcon style={{ fontSize: 16 }} />}
                  style={{ 
                    height: 38,
                    borderRadius: 8,
                    fontWeight: 600,
                    backgroundColor: "rgba(249, 250, 251, 0.15)",
                    borderColor: "rgba(249, 250, 251, 0.3)",
                    color: "#F9FAFB",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  Clear Filter
                </Button>
              )}
              <Button
                icon={<DownloadOutlined style={{ fontSize: 16 }} />}
                onClick={getExport}
                type="primary"
                style={{ 
                  height: 38,
                  borderRadius: 8,
                  fontWeight: 600,
                  backgroundColor: "#A3E635",
                  borderColor: "#A3E635",
                  color: "#1F2937",
                  boxShadow: "0 4px 16px rgba(163, 230, 53, 0.4)"
                }}
              >
                Export Report
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Compact Filters */}
        <Box sx={{ 
          p: 2.5, 
          bgcolor: "#FFFFFF",
          borderTop: "3px solid #A3E635"
        }}>
          <Stack spacing={1.5}>
            {/* Row 1: Main Filters */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Select
                placeholder="Type"
                onChange={(value) => setSelectType(value)}
                allowClear
                size="middle"
                style={{ width: 140 }}
                value={selectType}
                disabled={!!urlFilter}
              >
                <Select.Option value="All">All</Select.Option>
                <Select.Option value="global">Global</Select.Option>
                <Select.Option value="Regional">Regional</Select.Option>
                <Select.Option value="Country">Country</Select.Option>
              </Select>

              {selectType === "Regional" && (
                <Select
                  mode="multiple"
                  placeholder="Regions"
                  onFocus={fetchRegions}
                  onChange={(values: string[]) => {
                    if (values.includes("all")) {
                      setSelectedRegions(regions.map((region: any) => region.name));
                    } else {
                      setSelectedRegions(values.filter((value) => value !== "all"));
                    }
                  }}
                  value={selectedRegions.length === regions.length ? ["all"] : selectedRegions}
                  allowClear
                  size="middle"
                  style={{ flex: 1, minWidth: 180 }}
                  maxTagCount={1}
                  maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                >
                  <Select.Option key="all" value="all">Select all</Select.Option>
                  {regions.map((region: { id: string; name: string }) => (
                    <Select.Option key={region.id} value={region.name}>
                      {region.name}
                    </Select.Option>
                  ))}
                </Select>
              )}

              {selectType === "Country" && (
                <Select
                  mode="multiple"
                  placeholder="Countries"
                  onFocus={fetchCountries}
                  onChange={(values: string[]) => {
                    if (values.includes("all")) {
                      setSelectedCountries(countries.map((country: any) => country.name));
                    } else {
                      setSelectedCountries(values.filter((value) => value !== "all"));
                    }
                  }}
                  value={selectedCountries.length === countries.length ? ["all"] : selectedCountries}
                  allowClear
                  size="middle"
                  style={{ flex: 1, minWidth: 180 }}
                  maxTagCount={1}
                  maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                >
                  <Select.Option key="all" value="all">Select All</Select.Option>
                  {countries.map((country: { id: string; name: string }) => (
                    <Select.Option key={country.id} value={country.name}>
                      {country.name}
                    </Select.Option>
                  ))}
                </Select>
              )}

              <Select
                placeholder="Filter By"
                value={filterType}
                onChange={(value: string) => setFilterType(value)}
                allowClear
                size="middle"
                style={{ width: 160 }}
                disabled={!!urlFilter}
              >
                {columns
                  .filter((col) => col.dataIndex !== "region" && col.dataIndex !== "country")
                  .map((col) => (
                    <Select.Option key={col.dataIndex} value={col.dataIndex}>
                      {col.title}
                    </Select.Option>
                  ))}
              </Select>

              <Input
                placeholder="Filter value..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="middle"
                style={{ width: 200 }}
                disabled={!!urlFilter}
                prefix={<SearchIcon style={{ color: "#6B7280", fontSize: 18 }} />}
              />

              <Input
                placeholder="Global search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                size="middle"
                style={{ flex: 1, minWidth: 200 }}
                prefix={<SearchIcon style={{ color: "#008C8C", fontSize: 18 }} />}
                suffix={
                  globalSearch && (
                    <ClearIcon
                      onClick={() => setGlobalSearch("")}
                      style={{ cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}
                    />
                  )
                }
              />

              <Button
                type="primary"
                onClick={handleApply}
                size="middle"
                style={{ 
                  minWidth: 100,
                  borderRadius: 8,
                  fontWeight: 600,
                  backgroundColor: "#008C8C",
                  borderColor: "#008C8C",
                  boxShadow: "0 2px 8px rgba(0, 140, 140, 0.25)"
                }}
                disabled={!!urlFilter}
              >
                Apply
              </Button>
              <Button
                icon={<RefreshIcon style={{ fontSize: 16 }} />}
                onClick={handleResetForm}
                size="middle"
                style={{ 
                  minWidth: 100,
                  borderRadius: 8,
                  fontWeight: 600,
                  borderColor: "#E5E7EB",
                  color: "#1F2937",
                  backgroundColor: "#FFFFFF"
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Card>

      {/* Table Section */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          overflow: "hidden"
        }}
      >
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            minHeight: 500,
            maxHeight: 600,
            overflow: "auto",
            "& .MuiTable-root": {
              borderCollapse: "separate",
              borderSpacing: 0,
            },
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
                flexDirection: "column",
                gap: 2
              }}
            >
              <CircularProgress size={48} thickness={4} sx={{ color: "#008C8C" }} />
              <Typography variant="body1" color="#6B7280" fontWeight={500}>
                Loading data...
              </Typography>
            </Box>
          ) : data.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 500,
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <img
                src="https://digitalt3.com/wp-content/uploads/2024/12/No-data-bcm.png"
                alt="No data found"
                style={{ maxWidth: "300px", marginBottom: "20px" }}
              />
              <Typography variant="h6" color="#6B7280" fontWeight={600}>
                No data found
              </Typography>
              <Typography variant="body2" color="#9CA3AF" sx={{ mt: 1 }}>
                Try adjusting your filters or search criteria
              </Typography>
            </Box>
          ) : (
            <MUITable
              stickyHeader
              sx={{
                minWidth: 650,
                "& .MuiTableCell-root": {
                  borderBottom: "1px solid #E5E7EB",
                  padding: "16px",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        backgroundColor: "#008C8C",
                        color: "#F9FAFB",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        borderBottom: "2px solid #A3E635",
                        "&:hover": {
                          backgroundColor: "#006B6B",
                        },
                      }}
                      onClick={() => handleSort(column.dataIndex)}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {column.title}
                        {sortConfig.key === column.dataIndex ? (
  sortConfig.direction === "ASC" ? (
    <ArrowUpwardOutlined style={{ fontSize: 16, color: "#A3E635" }} />
  ) : sortConfig.direction === "DESC" ? (
    <ArrowDownwardOutlined style={{ fontSize: 16, color: "#A3E635" }} />
  ) : (
    <ArrowUpwardOutlined style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", transform: "rotate(0deg)" }} />
  )
) : (
  // Default faint arrow for unsorted columns
  <ArrowUpwardOutlined
    style={{
      fontSize: 16,
      color: "rgba(255,255,255,0.4)",
      transform: "rotate(0deg)",
    }}
  />
)}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: ProcessedDataItem, index: number) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#E6F9F5 !important",
                      },
                      transition: "all 0.15s ease",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: "#1F2937" }}>
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          backgroundColor: 
                            row.status === "Terminate" ? "#FEE2E2" :
                            row.status === "Invest" ? "#D1FAE5" :
                            row.status === "Maintain" ? "#FEF3C7" :
                            row.status === "Retire" ? "#E0E7FF" :
                            "#F3F4F6",
                          color: 
                            row.status === "Terminate" ? "#991B1B" :
                            row.status === "Invest" ? "#008C8C" :
                            row.status === "Maintain" ? "#92400E" :
                            row.status === "Retire" ? "#3730A3" :
                            "#1F2937",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          border: 
                            row.status === "Terminate" ? "1px solid #FCA5A5" :
                            row.status === "Invest" ? "1px solid #A3E635" :
                            row.status === "Maintain" ? "1px solid #FCD34D" :
                            row.status === "Retire" ? "1px solid #A5B4FC" :
                            "1px solid #E5E7EB"
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#374151" }}>{row.e2e}</TableCell>
                    <TableCell sx={{ color: "#374151" }}>{row.cap}</TableCell>
                    <TableCell sx={{ color: "#374151" }}>{row.domain}</TableCell>
                    <TableCell sx={{ color: "#374151" }}>{row.subdomain}</TableCell>
                    <TableCell sx={{ color: "#374151" }}>{row.region}</TableCell>
                    <TableCell sx={{ color: "#374151" }}>{row.country}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MUITable>
          )}
        </TableContainer>

        <Box sx={{ p: 2, borderTop: "1px solid #E5E7EB", bgcolor: "#F9FAFB" }}>
          <CustomPagination
            totalData={totalData}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />
        </Box>
      </Card>

      {/* Floating Action Button */}
      <>
        <div className="fixed bottom-20 right-8 z-[1200]">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-14 h-14 rounded-full bg-teal-600 opacity-30 animate-ping"></span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center text-white p-4 rounded-full shadow-lg transition-all duration-200 relative z-10 hover:scale-110"
              aria-label="Open AI Chat"
              style={{
                backgroundColor: "#008C8C",
                boxShadow: "0 4px 20px rgba(0, 140, 140, 0.4)"
              }}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[1400]">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-[1410] p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-800/70 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="fixed inset-4 md:inset-8 z-[1405]">
              <div className="h-full w-full p-6">
                <div className="h-full w-full flex flex-col">
                  <div className="h-full [&>div]:min-h-0 [&>div]:h-full [&>div]:bg-none">
                    <AIChat
                      initialMessages={persistentMessages}
                      onMessagesUpdate={(newMessages: any) =>
                        setPersistentMessages(newMessages)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </Box>
  );
};

export default Report;