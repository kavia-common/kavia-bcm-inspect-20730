// import { useState } from "react";
// import {
//   usePagination,
//   PaginationProvider,
// } from "../../contexts/PaginationContext";
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   CircularProgress,
//   Card,
//   CardContent,
//   Grid,
//   useTheme,
//   useMediaQuery,
//   LinearProgress,
//   CssBaseline,
//   Tab,
//   Tabs,
//   Tooltip,
// } from "@mui/material";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import {
//   CloudUpload as CloudUploadIcon,
//   Assessment as AssessmentIcon,
//   TableChart as TableChartIcon,
//   GridOn as GridOnIcon,
//   FileDownload as FileDownloadIcon,
//   Save as SaveIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import { AlertCircle } from "lucide-react";

// // Define TypeScript interfaces for the data structures
// interface AnalysisData {
//   total_rows: number;
//   total_columns: number;
//   columns: string[];
//   data: Record<string, any>[];
//   missing_positions: Record<string, number[]>;
//   tbd_positions: Record<string, number[]>;
//   delimiter_analysis: Record<string, number[]>;
//   regional_column: string;
//   location_column: string;
//   region_mismatches?: number[];
//   location_mismatch?: number[];
//   duplicate_rows: {
//     total: number;
//     indices: number[];
//     percentage: number;
//   };
//   missing_values: Record<string, number>;
//   tbd_values: Record<string, number>;
//   data_types: Record<string, string>;
//   missing_percentage: Record<string, number>;
//   tbd_percentage: Record<string, number>;
//   validation_errors?: boolean;
// }

// /**
//  * DataValidation component for analyzing and validating data files
//  * Adapted from the Data Validation app's functionality
//  */
// const DataValidationContent = () => {
//   // State management
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<number>(0);
//   const [modifications, setModifications] = useState<
//     Map<number, Record<string, any>>
//   >(new Map());
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
//   const [revalidating, setRevalidating] = useState<boolean>(false);

//   // Theme and responsive design
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   // Pagination from context
//   const { page, setPage, rowsPerPage } = usePagination();

//   /**
//    * Exports the current data (with modifications) to CSV format
//    */
//   const exportToCSV = async () => {
//     if (!analysis) return null;

//     // Create a CSV string from the data
//     const modifiedData = [...analysis.data];
//     modifications.forEach((newRow, rowIndex) => {
//       modifiedData[rowIndex] = { ...modifiedData[rowIndex], ...newRow };
//     });

//     // Create CSV content
//     const headers = analysis.columns.join(",");
//     const rows = modifiedData.map((row) =>
//       analysis.columns.map((col) => `"${row[col] || ""}"`).join(",")
//     );

//     const csvContent = [headers, ...rows].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });

//     return blob;
//   };

//   /**
//    * Handles saving changes to the data and revalidating
//    */
//   // const handleSaveChanges = async () => {
//   //   if (!analysis) return;

//   //   setRevalidating(true);
//   //   try {
//   //     // Export current data to CSV
//   //     const csvBlob = await exportToCSV();
//   //     if (!csvBlob) {
//   //       setError("Failed to prepare data for revalidation");
//   //       return;
//   //     }

//   //     const csvFile = new File([csvBlob], "revalidation.csv", {
//   //       type: "text/csv",
//   //     });

//   //     // Create form data for upload
//   //     const formData = new FormData();
//   //     formData.append("file", csvFile);

//   //     // Reuse existing analysis endpoint
//   //     const response = await axios.post(
//   //       "https://skju53n8x5.execute-api.us-east-2.amazonaws.com/prod/api/upload",
//   //       formData,
//   //       {
//   //         headers: { "Content-Type": "multipart/form-data" },
//   //       }
//   //     );

//   //     // Check for validation errors
//   //     if (response.data.analysis.validation_errors) {
//   //       setError("Validation failed. Please check highlighted cells.");
//   //       return;
//   //     }

//   //     // Update analysis with new results
//   //     setAnalysis(response.data.analysis);
//   //     setModifications(new Map());
//   //     setHasUnsavedChanges(false);
//   //   } catch (err: any) {
//   //     setError(
//   //       "Failed to revalidate data: " +
//   //         (err.response?.data?.error || err.message)
//   //     );
//   //   } finally {
//   //     setRevalidating(false);
//   //   }
//   // };

//   const handleSaveChanges = async () => {
//     if (!analysis) return;

//     setRevalidating(true);
//     setError(null);
//     try {
//       // Export current data to CSV
//       const csvBlob = await exportToCSV();
//       if (!csvBlob) {
//         setError("Failed to prepare data for revalidation");
//         setRevalidating(false);
//         return;
//       }

//       // Use FileReader to convert blob to base64
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         if (!e.target) {
//           setError("File reading failed: Event target is null");
//           setRevalidating(false);
//           return;
//         }
//         const result = e.target.result;
//         if (!result || typeof result !== "string") {
//           setError("File reading failed: Invalid result format");
//           setRevalidating(false);
//           return;
//         }
//         const base64File = result.split(",")[1]; // Remove the data URL prefix

//         // Create the request payload
//         const payload = {
//           file: base64File,
//           filename: "revalidation.csv",
//         };

//         try {
//           // Send to Lambda API
//           const response = await axios.post(
//             "https://skju53n8x5.execute-api.us-east-2.amazonaws.com/prod/api/upload",
//             payload,
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           // Check for validation errors
//           if (response.data.analysis.validation_errors) {
//             setError("Validation failed. Please check highlighted cells.");
//             setRevalidating(false);
//             return;
//           }

//           // Update analysis with new results
//           setAnalysis(response.data.analysis);
//           setModifications(new Map());
//           setHasUnsavedChanges(false);
//         } catch (err: any) {
//           setError(
//             "Failed to revalidate data: " +
//               (err.response?.data?.error || err.message)
//           );
//         } finally {
//           setRevalidating(false);
//         }
//       };

//       // Add error handler for FileReader
//       reader.onerror = () => {
//         setError("File reading failed");
//         setRevalidating(false);
//       };

//       // Read the CSV blob as data URL
//       reader.readAsDataURL(csvBlob);
//     } catch (err: any) {
//       setError(
//         "An unexpected error occurred: " +
//           (err.response?.data?.error || err.message)
//       );
//       setRevalidating(false);
//     }
//   };

//   /**
//    *
//    *
//    * Overlay component shown during revalidation
//    */
//   const RevalidationOverlay = () => (
//     <Box
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0, 0, 0, 0.7)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 9999,
//       }}
//     >
//       <CircularProgress size={60} sx={{ color: "white", mb: 2 }} />
//       <Typography variant="h6" sx={{ color: "white" }}>
//         Revalidating Data...
//       </Typography>
//     </Box>
//   );

//   /**
//    * Handles row updates in the data grid
//    */
//   const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
//     const rowId = newRow.id - 1;
//     setModifications((prev) => {
//       const updated = new Map(prev);
//       updated.set(rowId, newRow);
//       return updated;
//     });
//     setHasUnsavedChanges(true);
//     return newRow;
//   };

//   /**
//    * Handles file selection
//    */
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setError(null);
//     }
//   };

//   /**
//    * Gets paginated data for the current page
//    */
//   const getPaginatedData = () => {
//     if (!analysis || !analysis.data) return [];
//     const startIndex = page * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return analysis.data.slice(startIndex, endIndex).map((row, index) => ({
//       id: startIndex + index + 1,
//       ...row,
//     }));
//   };

//   /**
//    * Handles exporting data to Excel
//    */
//   const handleExport = async () => {
//     if (!analysis) return;

//     try {
//       console.log("Export started");

//       // Filter out the specified columns
//       const excludedColumns = [
//         "stages",
//         "description",
//         "start_date",
//         "end_date",
//         "updated_at",
//         "created_at",
//       ];
//       const headers = analysis.columns.filter(
//         (column) => !excludedColumns.includes(column)
//       );
//       const rows = analysis.data;

//       // Create CSV content
//       const csvHeaders = headers.join(",");
//       const csvRows = rows.map((row) =>
//         headers.map((header) => `"${row[header] || ""}"`).join(",")
//       );

//       const csvContent = [csvHeaders, ...csvRows].join("\n");
//       const blob = new Blob([csvContent], { type: "text/csv" });

//       // Create and trigger download
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `data_analysis_${
//         new Date().toISOString().split("T")[0]
//       }.csv`;
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       setTimeout(() => {
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       }, 0);

//       console.log("Export completed");
//     } catch (error) {
//       console.error("Export failed:", error);
//       setError("Failed to export data. Please try again.");
//     }
//   };

//   /**
//    * List of validation conditions applied to the data
//    */
//   const conditions = [
//     "Highlight all Must have cells which have either TBD, Blanks or All CAPS.",
//     "If Region is EMEA then Location should contain only EMEA counties else Location should be highlighted.",
//     "If Region is Americas then Location should contain only Americas counties else Location should be highlighted.",
//     "If Region is APAC then Location should contain only APAC counties else Location should be highlighted.",
//     "If Region is AMERICAS then Location should contain only AMERICAS counties else location should be highlighted.",
//     "Location column should have only country names or Worldwide else it should be highlighted.",
//     "If Location is Worldwide then Region should contain only Global else Region and Location field should be highlighted.",
//     "The counties in the Location field should belong to the regions mentioned in Region field else both fields should be highlighted.",
//     `Replace "Worldwide" with "All" in country column where Region is "Global"`,
//     "Country Americas to be made All",
//     "Country empty to be changed to All",
//     "Region TBD to be changed to Global",
//     "Make region to match the country",
//   ];

//   /**
//    * Handles file upload and analysis
//    */
//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select a file first");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // Read the file as base64
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         if (!e.target) {
//           setError("File reading failed: Event target is null");
//           setLoading(false);
//           return;
//         }
//         const result = e.target.result;
//         if (!result || typeof result !== "string") {
//           setError("File reading failed: Invalid result format");
//           setLoading(false);
//           return;
//         }

//         const base64File = result.split(",")[1]; // Remove the data URL prefix
//         // Create the request payload
//         const payload = {
//           file: base64File,
//           filename: file.name,
//         };

//         // Send to Lambda API
//         const response = await axios.post(
//           "https://skju53n8x5.execute-api.us-east-2.amazonaws.com/prod/api/upload",
//           payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         setAnalysis(response.data.analysis);
//       };
//       // Add error handler for FileReader
//       reader.onerror = () => {
//         setError("File reading failed");
//         setLoading(false);
//       };
//       reader.readAsDataURL(file);
//     } catch (err: any) {
//       setError(
//         err.response?.data?.error ||
//           "An error occurred while uploading the file"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Generates column definitions for the data grid
//    */
//   const getGridColumns = (): GridColDef[] => {
//     if (!analysis || !analysis.columns) return [];

//     const columnsToHide = [
//       "stages",
//       "description",
//       "start_date",
//       "end_date",
//       "updated_at",
//       "created_at",
//     ];

//     return analysis.columns
//       .filter((column) => !columnsToHide.includes(column))
//       .map((column) => ({
//         field: column,
//         headerName: column,
//         flex: 1,
//         minWidth: 150,
//         maxWidth: 300,
//         editable: true,
//         resizable: true,
//         headerClassName: "bold-header",

//         renderCell: (params) => {
//           const rowIndex = params.row.id - 1;
//           const isMissing =
//             analysis.missing_positions[column].includes(rowIndex);
//           const isTBD = analysis.tbd_positions[column].includes(rowIndex);
//           const isDuplicate =
//             analysis.duplicate_rows.indices.includes(rowIndex);
//           const hasDelimiter =
//             analysis.delimiter_analysis[column]?.includes(rowIndex);
//           const hasRegionMismatch =
//             column === analysis.regional_column &&
//             analysis.region_mismatches?.includes(rowIndex);
//           const hasLocationMismatch =
//             column === analysis.location_column &&
//             analysis.location_mismatch?.includes(rowIndex);
//           const value = params.value;

//           // Check for uppercase text, excluding special cases
//           const isUpperCase =
//             column !== analysis.regional_column &&
//             column !== analysis.location_column &&
//             typeof value === "string" &&
//             value === value.toUpperCase() &&
//             value.length > 1 &&
//             isNaN(Number(value)) &&
//             !value.match(/^\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}/) &&
//             !value.match(
//               /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}$/
//             ) &&
//             !value.match(
//               /^(19|20)\d{2}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/
//             ) &&
//             value !== "EMEA" &&
//             value !== "SAP" &&
//             value !== "AWS" &&
//             value !== "UKG" &&
//             value !== "HWI IT" &&
//             value !== "SAI360";

//           // Build tooltip messages
//           let tooltipMessage: React.ReactNode[] = [];
//           const formatMessage = (message: string) => {
//             const parts = message.split(": ");
//             return parts.length > 1 ? (
//               <span>
//                 <strong>{parts[0]}:</strong> {parts[1]}
//               </span>
//             ) : (
//               message
//             );
//           };

//           if (hasLocationMismatch)
//             tooltipMessage.push(
//               formatMessage(
//                 "Location Mismatch: Regional value doesn't match with location"
//               )
//             );
//           if (hasRegionMismatch)
//             tooltipMessage.push(
//               formatMessage(
//                 "Region Mismatch: Location value doesn't match with region"
//               )
//             );
//           if (hasDelimiter)
//             tooltipMessage.push(
//               formatMessage(
//                 "Delimiter Error: This delimiter is not allowed in this column"
//               )
//             );
//           if (isTBD)
//             tooltipMessage.push(
//               formatMessage(
//                 "TBD Value: Cell contains a TBD or placeholder or '-' or NUll or None value"
//               )
//             );
//           if (isMissing)
//             tooltipMessage.push(
//               formatMessage("Missing Value: Cell contains missing")
//             );
//           if (isDuplicate)
//             tooltipMessage.push(
//               formatMessage(
//                 "Duplicate Row: This row is a duplicate of another row in the dataset"
//               )
//             );
//           if (isUpperCase)
//             tooltipMessage.push(
//               formatMessage(
//                 "Uppercase Warning: Cell contains all uppercase text"
//               )
//             );

//           // Cell content with appropriate styling
//           const content = (
//             <Box
//               sx={{
//                 width: "100%",
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "flex-start",
//                 justifyContent: "space-between",
//                 boxSizing: "border-box",
//                 gap: 0,
//                 backgroundColor:
//                   hasRegionMismatch ||
//                   hasLocationMismatch ||
//                   (column === analysis.regional_column &&
//                     analysis.location_mismatch?.includes(rowIndex))
//                     ? "rgba(255, 0, 0, 0.55)"
//                     : hasDelimiter
//                     ? "rgba(255, 0, 0, 0.55)"
//                     : isTBD
//                     ? "rgba(255, 176, 0, 0.35)"
//                     : isMissing
//                     ? "rgba(255, 176, 0, 0.35)"
//                     : isUpperCase
//                     ? "rgba(255, 176, 0, 0.35)"
//                     : "transparent",
//                 color: isTBD ? "black" : "inherit",
//                 fontStyle: isTBD ? "italic" : "normal",
//                 p: 1,
//                 whiteSpace: "normal",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 minWidth: 0,
//               }}
//             >
//               {value}
//             </Box>
//           );

//           // Add tooltip if there are messages
//           return tooltipMessage.length > 0 ? (
//             <Tooltip
//               title={
//                 <div>
//                   {tooltipMessage.map((msg, index) => (
//                     <div key={index}>{msg}</div>
//                   ))}
//                 </div>
//               }
//               arrow
//               placement="top"
//               sx={{ width: "100%", height: "100%" }}
//             >
//               {content}
//             </Tooltip>
//           ) : (
//             content
//           );
//         },
//       }));
//   };

//   return (
//     <>
//       <CssBaseline />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           minHeight: "100vh",
//           width: "100%",
//           bgcolor: theme.palette.background.default,
//           overflowX: "hidden",
//           boxSizing: "border-box",
//           position: "relative",
//           paddingLeft: { xs: 0, md: 0 }, // Add padding to account for the sidebar in collapsed state
//           transition: "padding-left 0.3s ease",
//           maxWidth: "100vw", // Ensure the box doesn't exceed viewport width
//           "& *": {
//             boxSizing: "border-box", // Ensure all child elements use box-sizing: border-box
//           },
//         }}
//       >
//         <Container
//           maxWidth="xl"
//           sx={{
//             flex: 1,
//             py: 2,
//             px: { xs: 1, md: 1 },
//             boxSizing: "border-box",
//             width: "100%",
//             margin: "0 auto",
//             overflow: "hidden",
//             position: "relative",
//             maxWidth: { xs: "100%", md: "calc(100% - 12px)" }, // Adjust container width based on sidebar
//             "@media (min-width: 1200px)": {
//               maxWidth: { md: "calc(1200px - 12px)" }, // Maintain xl container size but account for sidebar
//             },
//           }}
//         >
//           <Grid container spacing={3}>
//             {/* Header - Simple version like Report page */}
//             <Grid item xs={12} sx={{ mb: 2, mt: -2 }}>
//               <Typography fontSize={28} fontWeight={700} color="#11142D">
//                 Data Validation Dashboard
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 color="text.secondary"
//                 sx={{ mt: 0.5, mb: 1 }}
//               >
//                 Upload your CSV or Excel file for instant validation and
//                 analysis
//               </Typography>
//             </Grid>

//             {/* File Upload Section */}
//             <Grid item xs={12} mt={-4}>
//               <Card
//                 elevation={3}
//                 sx={{
//                   borderRadius: "12px",
//                   overflow: "hidden",
//                   transition: "box-shadow 0.3s ease",
//                   "&:hover": {
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 2 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexDirection: isMobile ? "column" : "row",
//                       alignItems: "center",
//                       gap: 1.5,
//                       width: "100%",
//                     }}
//                   >
//                     <input
//                       accept=".csv,.xlsx,.xls"
//                       style={{ display: "none" }}
//                       id="file-upload"
//                       type="file"
//                       onChange={handleFileChange}
//                     />
//                     <label htmlFor="file-upload">
//                       <Button
//                         variant="contained"
//                         component="span"
//                         startIcon={<CloudUploadIcon />}
//                         sx={{
//                           minWidth: "160px",
//                           py: 0.5,
//                           bgcolor: theme.palette.primary.main,
//                           borderRadius: "8px",
//                           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                           transition: "all 0.2s ease",
//                           "&:hover": {
//                             bgcolor: theme.palette.primary.dark,
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                             transform: "translateY(-2px)",
//                           },
//                         }}
//                       >
//                         Choose File
//                       </Button>
//                     </label>
//                     {file && (
//                       <Typography
//                         sx={{
//                           flex: 1,
//                           textAlign: isMobile ? "center" : "left",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: "nowrap",
//                           my: 0.5,
//                         }}
//                       >
//                         Selected: {file.name}
//                       </Typography>
//                     )}
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleUpload}
//                       disabled={!file || loading}
//                       startIcon={<TableChartIcon />}
//                       sx={{
//                         minWidth: "160px",
//                         py: 0.5,
//                         borderRadius: "8px",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                         transition: "all 0.2s ease",
//                         "&:not(:disabled):hover": {
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                           transform: "translateY(-2px)",
//                         },
//                       }}
//                     >
//                       Analyze Data
//                     </Button>
//                   </Box>
//                 </CardContent>
//                 {loading && (
//                   <LinearProgress
//                     sx={{
//                       height: "4px",
//                       "& .MuiLinearProgress-bar": {
//                         transition: "transform 0.4s linear",
//                       },
//                     }}
//                   />
//                 )}
//               </Card>
//             </Grid>

//             {/* Error Display */}
//             {error && (
//               <Grid item xs={12}>
//                 <Card
//                   sx={{
//                     bgcolor: theme.palette.error.light,
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)",
//                   }}
//                 >
//                   <CardContent sx={{ py: 2 }}>
//                     <Typography
//                       color="black"
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         fontWeight: 500,
//                       }}
//                     >
//                       <AlertCircle size={20} />
//                       {error}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             )}

//             {/* Analysis Results */}
//             {analysis && (
//               <>
//                 <Grid item xs={12}>
//                   <Card elevation={3}>
//                     <Box
//                       sx={{
//                         borderBottom: 1,
//                         borderColor: "divider",
//                         backgroundColor:
//                           theme.palette.mode === "light"
//                             ? "rgba(245, 245, 245, 1)"
//                             : "rgba(66, 66, 66, 0.8)",
//                         borderTopLeftRadius: "8px",
//                         borderTopRightRadius: "8px",
//                       }}
//                     >
//                       <Tabs
//                         value={activeTab}
//                         onChange={(e, newValue) => setActiveTab(newValue)}
//                         variant="fullWidth"
//                         sx={{
//                           minHeight: "40px",
//                           "& .MuiTab-root": {
//                             transition: "all 0.2s ease",
//                             minHeight: "40px",
//                             padding: "6px 12px",
//                             fontWeight: 500,
//                             "&:hover": {
//                               backgroundColor: "rgba(0, 0, 0, 0.04)",
//                             },
//                           },
//                           "& .Mui-selected": {
//                             fontWeight: 700,
//                           },
//                         }}
//                       >
//                         <Tab
//                           icon={<AssessmentIcon />}
//                           label="Analysis"
//                           iconPosition="start"
//                         />
//                         <Tab
//                           icon={<GridOnIcon />}
//                           label="Data Grid"
//                           iconPosition="start"
//                         />
//                       </Tabs>
//                     </Box>
//                     {activeTab === 0 ? (
//                       <CardContent>
//                         <Grid container spacing={2} sx={{ mb: 3 }}>
//                           <Grid item xs={12} sm={6} md={4}>
//                             <Card variant="outlined">
//                               <CardContent>
//                                 <Typography
//                                   variant="h6"
//                                   color="primary"
//                                   gutterBottom
//                                 >
//                                   Total Rows
//                                 </Typography>
//                                 <Typography variant="h4">
//                                   {analysis.total_rows}
//                                 </Typography>
//                               </CardContent>
//                             </Card>
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={4}>
//                             <Card variant="outlined">
//                               <CardContent>
//                                 <Typography
//                                   variant="h6"
//                                   color="primary"
//                                   gutterBottom
//                                 >
//                                   Total Columns
//                                 </Typography>
//                                 <Typography variant="h4">
//                                   {analysis.total_columns}
//                                 </Typography>
//                               </CardContent>
//                             </Card>
//                           </Grid>
//                           <Grid item xs={12} sm={6} md={4}>
//                             <Card variant="outlined">
//                               <CardContent>
//                                 <Typography
//                                   variant="h6"
//                                   color="primary"
//                                   gutterBottom
//                                 >
//                                   Duplicate Rows
//                                 </Typography>
//                                 <Typography variant="h4">
//                                   {analysis.duplicate_rows.total}
//                                 </Typography>
//                               </CardContent>
//                             </Card>
//                           </Grid>
//                         </Grid>
//                         <Card sx={{ width: "100%", maxWidth: "4xl", mt: 4 }}>
//                           <CardContent sx={{ pt: 3 }}>
//                             <Box
//                               sx={{
//                                 typography: "h6",
//                                 fontWeight: 600,
//                                 mb: 2,
//                                 color: "text.primary",
//                               }}
//                             >
//                               List of Validation Conditions
//                             </Box>

//                             <Box
//                               component="ul"
//                               sx={{
//                                 listStyle: "none",
//                                 p: 0,
//                                 m: 0,
//                                 "& > li": { mb: 2 },
//                               }}
//                             >
//                               {conditions.map((condition, index) => (
//                                 <Box
//                                   component="li"
//                                   key={index}
//                                   sx={{
//                                     display: "flex",
//                                     alignItems: "flex-start",
//                                     p: 1,
//                                     borderRadius: 1,
//                                     "&:hover": {
//                                       bgcolor: "action.hover",
//                                     },
//                                     transition: "background-color 0.2s",
//                                   }}
//                                 >
//                                   <AlertCircle
//                                     style={{
//                                       width: 20,
//                                       height: 20,
//                                       marginRight: 12,
//                                       marginTop: 4,
//                                       color: theme.palette.primary.main,
//                                     }}
//                                   />
//                                   <Box
//                                     sx={{
//                                       color: "text.secondary",
//                                       flex: 1,
//                                     }}
//                                   >
//                                     {condition}
//                                   </Box>
//                                 </Box>
//                               ))}
//                             </Box>
//                           </CardContent>
//                         </Card>
//                       </CardContent>
//                     ) : (
//                       <Box
//                         sx={{
//                           height: "calc(100vh - 200px)",
//                           width: "100%",
//                           position: "relative",
//                           display: "flex",
//                           flexDirection: "column",
//                           borderRadius: "8px",
//                           boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//                           backgroundColor: "#ffffff",
//                           padding: "10px",
//                           transition: "all 0.3s ease",
//                           maxWidth: "100%", // Ensure the box doesn't exceed viewport width
//                           overflow: "hidden", // Prevent content from spilling out
//                           boxSizing: "border-box",
//                           "& .MuiDataGrid-root": {
//                             width: "100%",
//                             maxWidth: "100%",
//                             "& .MuiDataGrid-virtualScroller": {
//                               overflowX: "auto !important",
//                             },
//                           },
//                           "&:hover": {
//                             boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
//                           },
//                         }}
//                       >
//                         {revalidating && <RevalidationOverlay />}
//                         <Box
//                           sx={{
//                             mb: 3,
//                             display: "flex",
//                             gap: 2,
//                             flexWrap: "wrap",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             padding: "0 0 5px 0",
//                             borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 3,
//                             }}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   width: 16,
//                                   height: 16,
//                                   bgcolor: "rgba(255, 0, 0, 0.55)",
//                                   borderRadius: "4px",
//                                 }}
//                               />
//                               <Typography
//                                 variant="body2"
//                                 sx={{ fontWeight: 500 }}
//                               >
//                                 Location / Regional Mismatch / Delimiter
//                               </Typography>
//                             </Box>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   width: 16,
//                                   height: 16,
//                                   bgcolor: "rgba(255, 176, 0, 0.35)",
//                                   borderRadius: "4px",
//                                 }}
//                               />
//                               <Typography
//                                 variant="body2"
//                                 sx={{ fontWeight: 500 }}
//                               >
//                                 Missing / TBD Value / UpperCase Text
//                               </Typography>
//                             </Box>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   width: 16,
//                                   height: 16,
//                                   bgcolor: "rgba(248, 150, 201, 0.8)",
//                                   borderRadius: "4px",
//                                 }}
//                               />
//                               <Typography
//                                 variant="body2"
//                                 sx={{ fontWeight: 500 }}
//                               >
//                                 Duplicate Row
//                               </Typography>
//                             </Box>
//                           </Box>
//                           <Box sx={{ display: "flex", gap: 2 }}>
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               onClick={handleExport}
//                               startIcon={<FileDownloadIcon />}
//                               disabled={!analysis}
//                               sx={{
//                                 borderRadius: "8px",
//                                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                                 transition: "all 0.2s ease",
//                                 "&:hover": {
//                                   boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                                   transform: "translateY(-2px)",
//                                 },
//                               }}
//                             >
//                               Export Data
//                             </Button>
//                             {hasUnsavedChanges && (
//                               <Button
//                                 variant="contained"
//                                 color="success"
//                                 onClick={handleSaveChanges}
//                                 startIcon={<SaveIcon />}
//                                 disabled={revalidating}
//                                 sx={{
//                                   borderRadius: "8px",
//                                   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                                   transition: "all 0.2s ease",
//                                   "&:hover": {
//                                     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                                     transform: "translateY(-2px)",
//                                   },
//                                 }}
//                               >
//                                 {revalidating
//                                   ? "Validating..."
//                                   : "Save Changes"}
//                               </Button>
//                             )}
//                           </Box>
//                         </Box>

//                         <Box
//                           sx={{
//                             flex: 1,
//                             overflow: "auto",
//                             borderRadius: "8px",
//                             border: "none",
//                             boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//                             position: "relative",
//                             "&::before":
//                               loading || revalidating
//                                 ? {
//                                     content: '""',
//                                     position: "absolute",
//                                     top: 0,
//                                     left: 0,
//                                     right: 0,
//                                     height: "3px",
//                                     background:
//                                       "linear-gradient(90deg, transparent, rgba(58, 130, 246, 0.6), transparent)",
//                                     animation: "loading 1.5s infinite",
//                                     zIndex: 10,
//                                   }
//                                 : {},
//                           }}
//                         >
//                           <DataGrid
//                             rows={getPaginatedData()}
//                             columns={getGridColumns()}
//                             initialState={{
//                               pagination: {
//                                 paginationModel: {
//                                   pageSize: rowsPerPage,
//                                   page: page,
//                                 },
//                               },
//                               columns: {
//                                 columnVisibilityModel: {},
//                               },
//                             }}
//                             pageSizeOptions={[rowsPerPage]}
//                             pagination
//                             paginationMode="server"
//                             onPaginationModelChange={(model) =>
//                               setPage(model.page)
//                             }
//                             rowCount={analysis?.data?.length || 0}
//                             loading={loading}
//                             disableRowSelectionOnClick
//                             density="comfortable"
//                             editMode="cell"
//                             processRowUpdate={handleProcessRowUpdate}
//                             sx={{
//                               width: "100%",
//                               height: "100%",
//                               flex: 1,
//                               padding: "0",
//                               border: "none",
//                               borderRadius: "8px",
//                               boxSizing: "border-box",
//                               boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
//                               maxWidth: "100%",
//                               "& .MuiDataGrid-root": {
//                                 border: "none",
//                                 boxSizing: "border-box",
//                                 width: "100%",
//                                 maxWidth: "100%",
//                               },
//                               "& .MuiDataGrid-main": {
//                                 width: "100%",
//                                 minWidth: "100%",
//                                 overflow: "auto",
//                                 boxSizing: "border-box",
//                                 maxWidth: "100%", // Ensure content doesn't overflow
//                               },
//                               "& .MuiDataGrid-virtualScroller": {
//                                 overflowY: "auto",
//                                 overflowX: "auto",
//                                 boxSizing: "border-box",
//                                 minWidth: "100%",
//                                 maxWidth: "100%", // Prevent horizontal overflow
//                                 "&::-webkit-scrollbar": {
//                                   width: "8px",
//                                   height: "8px",
//                                 },
//                                 "&::-webkit-scrollbar-thumb": {
//                                   backgroundColor: "rgba(0,0,0,0.2)",
//                                   borderRadius: "4px",
//                                 },
//                                 "&::-webkit-scrollbar-track": {
//                                   backgroundColor: "rgba(0,0,0,0.05)",
//                                 },
//                               },
//                               "& .MuiDataGrid-cell": {
//                                 padding: 0,
//                                 overflow: "hidden",
//                                 whiteSpace: "normal",
//                                 lineHeight: "normal",
//                                 boxSizing: "border-box",
//                                 borderBottom:
//                                   "1px solid rgba(224, 224, 224, 0.4)",
//                                 "&:focus": {
//                                   outline: "none",
//                                 },
//                                 "&:focus-within": {
//                                   outline: `2px solid ${theme.palette.primary.main}`,
//                                   outlineOffset: "-1px",
//                                 },
//                               },
//                               "& .MuiDataGrid-row": {
//                                 "&:hover": {
//                                   backgroundColor: "rgba(0, 0, 0, 0.04)",
//                                 },
//                               },
//                               "& .MuiDataGrid-columnHeader": {
//                                 padding: "0 16px",
//                                 boxSizing: "border-box",
//                                 height: "36px !important",
//                                 lineHeight: "36px !important",
//                               },
//                               "& .duplicate-row": {
//                                 backgroundColor: "rgba(248, 150, 201, 0.8)",
//                                 "&:hover": {
//                                   backgroundColor: "rgba(248, 150, 201, 0.9)",
//                                 },
//                               },
//                               "& .MuiDataGrid-columnHeaders": {
//                                 backgroundColor: "rgba(245, 245, 245, 1)",
//                                 borderBottom:
//                                   "2px solid rgba(224, 224, 224, 1)",
//                                 height: "36px !important",
//                                 minHeight: "36px !important",
//                                 maxHeight: "36px !important",
//                                 "& .MuiDataGrid-columnHeaderTitle": {
//                                   fontWeight: 700,
//                                   color: theme.palette.text.primary,
//                                   fontSize: "0.875rem",
//                                 },
//                                 // height: "36px", // Reduced height for column headers (default is 56px)
//                                 // minHeight: "36px", // Ensure minimum height is also set
//                                 // maxHeight: "36px",
//                               },
//                               "& .MuiDataGrid-columnSeparator": {
//                                 visibility: "hidden",
//                               },
//                               "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell":
//                                 {
//                                   transition: "none !important",
//                                 },
//                               "& .MuiDataGrid-footerContainer": {
//                                 minHeight: "24px",
//                               },
//                               "@keyframes loading": {
//                                 "0%": {
//                                   transform: "translateX(-100%)",
//                                 },
//                                 "100%": {
//                                   transform: "translateX(100%)",
//                                 },
//                               },
//                             }}
//                             components={{
//                               Pagination: () => (
//                                 <Box
//                                   sx={{
//                                     position: "fixed",
//                                     bottom: 20,
//                                     left: "50%",
//                                     transform: "translateX(-50%)",
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     backgroundColor: "white",
//                                     padding: "8px 12px",
//                                     borderRadius: "12px",
//                                     boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//                                     zIndex: 9999,
//                                     transition: "all 0.2s ease",
//                                     "&:hover": {
//                                       boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
//                                     },
//                                   }}
//                                 >
//                                   <Button
//                                     onClick={() =>
//                                       setPage(Math.max(0, page - 1))
//                                     }
//                                     disabled={page === 0}
//                                     sx={{
//                                       mr: 1,
//                                       py: 0.5,
//                                       borderRadius: "8px",
//                                       minWidth: "100px",
//                                       transition: "all 0.2s ease",
//                                       "&:not(:disabled):hover": {
//                                         transform: "translateY(-2px)",
//                                         boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                                       },
//                                     }}
//                                     variant="contained"
//                                   >
//                                     Previous
//                                   </Button>
//                                   <Typography
//                                     sx={{
//                                       mx: 3,
//                                       alignSelf: "center",
//                                       fontWeight: 500,
//                                       color: theme.palette.text.primary,
//                                     }}
//                                   >
//                                     Page {page + 1} of{" "}
//                                     {Math.ceil(
//                                       (analysis?.data?.length || 0) /
//                                         rowsPerPage
//                                     )}
//                                   </Typography>
//                                   <Button
//                                     onClick={() => setPage(page + 1)}
//                                     disabled={
//                                       !analysis?.data ||
//                                       (page + 1) * rowsPerPage >=
//                                         analysis.data.length
//                                     }
//                                     variant="contained"
//                                     sx={{
//                                       py: 0.5,
//                                       borderRadius: "8px",
//                                       minWidth: "100px",
//                                       transition: "all 0.2s ease",
//                                       "&:not(:disabled):hover": {
//                                         transform: "translateY(-2px)",
//                                         boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//                                       },
//                                     }}
//                                   >
//                                     Next
//                                   </Button>
//                                 </Box>
//                               ),
//                             }}
//                             getRowClassName={(params) => {
//                               const isDuplicate =
//                                 analysis.duplicate_rows.indices.includes(
//                                   params.row.id - 1
//                                 );
//                               return isDuplicate ? "duplicate-row" : "";
//                             }}
//                           />
//                         </Box>
//                       </Box>
//                     )}
//                   </Card>
//                 </Grid>
//               </>
//             )}
//           </Grid>
//         </Container>
//       </Box>
//     </>
//   );
// };

// /**
//  * DataValidation component that wraps DataValidationContent with PaginationProvider
//  * This ensures that the usePagination hook is used within a PaginationProvider context
//  */
// const DataValidation = () => {
//   return (
//     <PaginationProvider>
//       <DataValidationContent />
//     </PaginationProvider>
//   );
// };

// export default DataValidation;



import { useState } from "react";
import {
  usePagination,
  PaginationProvider,
} from "../../contexts/PaginationContext";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  LinearProgress,
  CssBaseline,
  Tab,
  Tabs,
  Tooltip,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  CloudUpload as CloudUploadIcon,
  Assessment as AssessmentIcon,
  TableChart as TableChartIcon,
  GridOn as GridOnIcon,
  FileDownload as FileDownloadIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import axios from "axios";
import { AlertCircle } from "lucide-react";

// Define TypeScript interfaces for the data structures
interface AnalysisData {
  total_rows: number;
  total_columns: number;
  columns: string[];
  data: Record<string, any>[];
  missing_positions: Record<string, number[]>;
  tbd_positions: Record<string, number[]>;
  delimiter_analysis: Record<string, number[]>;
  regional_column: string;
  location_column: string;
  region_mismatches?: number[];
  location_mismatch?: number[];
  duplicate_rows: {
    total: number;
    indices: number[];
    percentage: number;
  };
  missing_values: Record<string, number>;
  tbd_values: Record<string, number>;
  data_types: Record<string, string>;
  missing_percentage: Record<string, number>;
  tbd_percentage: Record<string, number>;
  validation_errors?: boolean;
}

/**
 * DataValidation component for analyzing and validating data files
 * Adapted from the Data Validation app's functionality
 */
const DataValidationContent = () => {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [modifications, setModifications] = useState<
    Map<number, Record<string, any>>
  >(new Map());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [revalidating, setRevalidating] = useState<boolean>(false);

  // Theme and responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Pagination from context
  const { page, setPage, rowsPerPage } = usePagination();

  /**
   * Exports the current data (with modifications) to CSV format
   */
  const exportToCSV = async () => {
    if (!analysis) return null;

    // Create a CSV string from the data
    const modifiedData = [...analysis.data];
    modifications.forEach((newRow, rowIndex) => {
      modifiedData[rowIndex] = { ...modifiedData[rowIndex], ...newRow };
    });

    // Create CSV content
    const headers = analysis.columns.join(",");
    const rows = modifiedData.map((row) =>
      analysis.columns.map((col) => `"${row[col] || ""}"`).join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    return blob;
  };

  /**
   * Handles saving changes to the data and revalidating
   */
  const handleSaveChanges = async () => {
    if (!analysis) return;

    setRevalidating(true);
    setError(null);
    try {
      // Export current data to CSV
      const csvBlob = await exportToCSV();
      if (!csvBlob) {
        setError("Failed to prepare data for revalidation");
        setRevalidating(false);
        return;
      }

      // Use FileReader to convert blob to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target) {
          setError("File reading failed: Event target is null");
          setRevalidating(false);
          return;
        }
        const result = e.target.result;
        if (!result || typeof result !== "string") {
          setError("File reading failed: Invalid result format");
          setRevalidating(false);
          return;
        }
        const base64File = result.split(",")[1]; // Remove the data URL prefix

        // Create the request payload
        const payload = {
          file: base64File,
          filename: "revalidation.csv",
        };

        try {
          // Send to Lambda API
          const response = await axios.post(
            "https://skju53n8x5.execute-api.us-east-2.amazonaws.com/prod/api/upload",
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Check for validation errors
          if (response.data.analysis.validation_errors) {
            setError("Validation failed. Please check highlighted cells.");
            setRevalidating(false);
            return;
          }

          // Update analysis with new results
          setAnalysis(response.data.analysis);
          setModifications(new Map());
          setHasUnsavedChanges(false);
        } catch (err: any) {
          setError(
            "Failed to revalidate data: " +
              (err.response?.data?.error || err.message)
          );
        } finally {
          setRevalidating(false);
        }
      };

      // Add error handler for FileReader
      reader.onerror = () => {
        setError("File reading failed");
        setRevalidating(false);
      };

      // Read the CSV blob as data URL
      reader.readAsDataURL(csvBlob);
    } catch (err: any) {
      setError(
        "An unexpected error occurred: " +
          (err.response?.data?.error || err.message)
      );
      setRevalidating(false);
    }
  };

  /**
   *
   *
   * Overlay component shown during revalidation
   */
  const RevalidationOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress size={60} sx={{ color: "white", mb: 2 }} />
      <Typography variant="h6" sx={{ color: "white" }}>
        Revalidating Data...
      </Typography>
    </Box>
  );

  /**
   * Handles row updates in the data grid
   */
  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    const rowId = newRow.id - 1;
    setModifications((prev) => {
      const updated = new Map(prev);
      updated.set(rowId, newRow);
      return updated;
    });
    setHasUnsavedChanges(true);
    return newRow;
  };

  /**
   * Handles file selection
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  /**
   * Gets paginated data for the current page
   */
  const getPaginatedData = () => {
    if (!analysis || !analysis.data) return [];
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return analysis.data.slice(startIndex, endIndex).map((row, index) => ({
      id: startIndex + index + 1,
      ...row,
    }));
  };

  /**
   * Handles exporting data to Excel
   */
  const handleExport = async () => {
    if (!analysis) return;

    try {
      console.log("Export started");

      // Filter out the specified columns
      const excludedColumns = [
        "stages",
        "description",
        "start_date",
        "end_date",
        "updated_at",
        "created_at",
      ];
      const headers = analysis.columns.filter(
        (column) => !excludedColumns.includes(column)
      );
      const rows = analysis.data;

      // Create CSV content
      const csvHeaders = headers.join(",");
      const csvRows = rows.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(",")
      );

      const csvContent = [csvHeaders, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });

      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `data_analysis_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 0);

      console.log("Export completed");
    } catch (error) {
      console.error("Export failed:", error);
      setError("Failed to export data. Please try again.");
    }
  };

  /**
   * List of validation conditions applied to the data
   */
  const conditions = [
    "Highlight all Must have cells which have either TBD, Blanks or All CAPS.",
    "If Region is EMEA then Location should contain only EMEA counties else Location should be highlighted.",
    "If Region is Americas then Location should contain only Americas counties else Location should be highlighted.",
    "If Region is APAC then Location should contain only APAC counties else Location should be highlighted.",
    "If Region is AMERICAS then Location should contain only AMERICAS counties else location should be highlighted.",
    "Location column should have only country names or Worldwide else it should be highlighted.",
    "If Location is Worldwide then Region should contain only Global else Region and Location field should be highlighted.",
    "The counties in the Location field should belong to the regions mentioned in Region field else both fields should be highlighted.",
    `Replace "Worldwide" with "All" in country column where Region is "Global"`,
    "Country Americas to be made All",
    "Country empty to be changed to All",
    "Region TBD to be changed to Global",
    "Make region to match the country",
  ];

  /**
   * Handles file upload and analysis
   */
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Read the file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target) {
          setError("File reading failed: Event target is null");
          setLoading(false);
          return;
        }
        const result = e.target.result;
        if (!result || typeof result !== "string") {
          setError("File reading failed: Invalid result format");
          setLoading(false);
          return;
        }

        const base64File = result.split(",")[1]; // Remove the data URL prefix
        // Create the request payload
        const payload = {
          file: base64File,
          filename: file.name,
        };

        // Send to Lambda API
        const response = await axios.post(
          "https://skju53n8x5.execute-api.us-east-2.amazonaws.com/prod/api/upload",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setAnalysis(response.data.analysis);
      };
      // Add error handler for FileReader
      reader.onerror = () => {
        setError("File reading failed");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "An error occurred while uploading the file"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates column definitions for the data grid
   */
  const getGridColumns = (): GridColDef[] => {
    if (!analysis || !analysis.columns) return [];

    const columnsToHide = [
      "stages",
      "description",
      "start_date",
      "end_date",
      "updated_at",
      "created_at",
    ];

    return analysis.columns
      .filter((column) => !columnsToHide.includes(column))
      .map((column) => ({
        field: column,
        headerName: column,
        flex: 1,
        minWidth: 150,
        maxWidth: 300,
        editable: true,
        resizable: true,
        headerClassName: "bold-header",

        renderCell: (params) => {
          const rowIndex = params.row.id - 1;
          const isMissing =
            analysis.missing_positions[column].includes(rowIndex);
          const isTBD = analysis.tbd_positions[column].includes(rowIndex);
          const isDuplicate =
            analysis.duplicate_rows.indices.includes(rowIndex);
          const hasDelimiter =
            analysis.delimiter_analysis[column]?.includes(rowIndex);
          const hasRegionMismatch =
            column === analysis.regional_column &&
            analysis.region_mismatches?.includes(rowIndex);
          const hasLocationMismatch =
            column === analysis.location_column &&
            analysis.location_mismatch?.includes(rowIndex);
          const value = params.value;

          // Check for uppercase text, excluding special cases
          const isUpperCase =
            column !== analysis.regional_column &&
            column !== analysis.location_column &&
            typeof value === "string" &&
            value === value.toUpperCase() &&
            value.length > 1 &&
            isNaN(Number(value)) &&
            !value.match(/^\d{1,4}[-/\.]\d{1,2}[-/\.]\d{1,4}/) &&
            !value.match(
              /^(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}$/
            ) &&
            !value.match(
              /^(19|20)\d{2}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])$/
            ) &&
            value !== "EMEA" &&
            value !== "SAP" &&
            value !== "AWS" &&
            value !== "UKG" &&
            value !== "HWI IT" &&
            value !== "SAI360";

          // Build tooltip messages
          let tooltipMessage: React.ReactNode[] = [];
          const formatMessage = (message: string) => {
            const parts = message.split(": ");
            return parts.length > 1 ? (
              <span>
                <strong>{parts[0]}:</strong> {parts[1]}
              </span>
            ) : (
              message
            );
          };

          if (hasLocationMismatch)
            tooltipMessage.push(
              formatMessage(
                "Location Mismatch: Regional value doesn't match with location"
              )
            );
          if (hasRegionMismatch)
            tooltipMessage.push(
              formatMessage(
                "Region Mismatch: Location value doesn't match with region"
              )
            );
          if (hasDelimiter)
            tooltipMessage.push(
              formatMessage(
                "Delimiter Error: This delimiter is not allowed in this column"
              )
            );
          if (isTBD)
            tooltipMessage.push(
              formatMessage(
                "TBD Value: Cell contains a TBD or placeholder or '-' or NUll or None value"
              )
            );
          if (isMissing)
            tooltipMessage.push(
              formatMessage("Missing Value: Cell contains missing")
            );
          if (isDuplicate)
            tooltipMessage.push(
              formatMessage(
                "Duplicate Row: This row is a duplicate of another row in the dataset"
              )
            );
          if (isUpperCase)
            tooltipMessage.push(
              formatMessage(
                "Uppercase Warning: Cell contains all uppercase text"
              )
            );

          // Cell content with appropriate styling
          const content = (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                boxSizing: "border-box",
                gap: 0,
                backgroundColor:
                  hasRegionMismatch ||
                  hasLocationMismatch ||
                  (column === analysis.regional_column &&
                    analysis.location_mismatch?.includes(rowIndex))
                    ? "rgba(255, 0, 0, 0.55)"
                    : hasDelimiter
                    ? "rgba(255, 0, 0, 0.55)"
                    : isTBD
                    ? "rgba(255, 176, 0, 0.35)"
                    : isMissing
                    ? "rgba(255, 176, 0, 0.35)"
                    : isUpperCase
                    ? "rgba(255, 176, 0, 0.35)"
                    : "transparent",
                color: isTBD ? "black" : "inherit",
                fontStyle: isTBD ? "italic" : "normal",
                p: 1,
                whiteSpace: "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
              }}
            >
              {value}
            </Box>
          );

          // Add tooltip if there are messages
          return tooltipMessage.length > 0 ? (
            <Tooltip
              title={
                <div>
                  {tooltipMessage.map((msg, index) => (
                    <div key={index}>{msg}</div>
                  ))}
                </div>
              }
              arrow
              placement="top"
              sx={{ width: "100%", height: "100%" }}
            >
              {content}
            </Tooltip>
          ) : (
            content
          );
        },
      }));
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          bgcolor: "#F9FAFB",
          overflowX: "hidden",
          boxSizing: "border-box",
          position: "relative",
          paddingLeft: { xs: 0, md: 0 },
          transition: "padding-left 0.3s ease",
          maxWidth: "100vw",
          "& *": {
            boxSizing: "border-box",
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            py: 3,
            px: { xs: 2, md: 3 },
            boxSizing: "border-box",
            width: "100%",
            margin: "0 auto",
            overflow: "hidden",
            position: "relative",
            maxWidth: { xs: "100%", md: "calc(100% - 12px)" },
            "@media (min-width: 1200px)": {
              maxWidth: { md: "calc(1200px - 12px)" },
            },
          }}
        >
          <Grid container spacing={3}>
            {/* Header Section - Enhanced with gradient */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  background: "linear-gradient(135deg, #008C8C 0%, #006666 100%)",
                  borderRadius: 3,
                  p: 3,
                  mb: 1,
                  border: "1px solid #008C8C"
                }}
              >
                <Typography 
                  fontSize={32} 
                  fontWeight={700} 
                  sx={{ 
                    color: "white",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    mb: 1
                  }}
                >
                  Data Validation Dashboard
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ 
                    color: "rgba(255,255,255,0.95)",
                    fontSize: "1.05rem"
                  }}
                >
                  Upload your CSV or Excel file for instant validation and analysis
                </Typography>
              </Card>
            </Grid>

            {/* File Upload Section - Enhanced */}
            <Grid item xs={12}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  transition: "box-shadow 0.3s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)"
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems="center"
                  >
                    <input
                      accept=".csv,.xlsx,.xls"
                      style={{ display: "none" }}
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" style={{ width: isMobile ? "100%" : "auto" }}>
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        fullWidth={isMobile}
                        sx={{
                          minWidth: 180,
                          py: 1.5,
                          bgcolor: "#008C8C",
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: "1rem",
                          boxShadow: "0 4px 12px rgba(0, 140, 140, 0.3)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "#006666",
                            boxShadow: "0 6px 16px rgba(0, 140, 140, 0.4)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Choose File
                      </Button>
                    </label>
                    
                    {file && (
                      <Paper
                        elevation={0}
                        sx={{
                          flex: 1,
                          p: 2,
                          bgcolor: "#E8F5F5",
                          borderRadius: 2,
                          border: "1px solid #B3E0E0",
                          width: isMobile ? "100%" : "auto"
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircleIcon sx={{ color: "#A3E635", fontSize: 20 }} />
                          <Typography
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontWeight: 500,
                              color: "#1F2937"
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                    
                    <Button
                      variant="contained"
                      onClick={handleUpload}
                      disabled={!file || loading}
                      startIcon={<TableChartIcon />}
                      fullWidth={isMobile}
                      sx={{
                        minWidth: 180,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: "1rem",
                        bgcolor: "#008C8C",
                        boxShadow: "0 4px 12px rgba(0, 140, 140, 0.3)",
                        transition: "all 0.2s ease",
                        "&:not(:disabled):hover": {
                          bgcolor: "#006666",
                          boxShadow: "0 6px 16px rgba(0, 140, 140, 0.4)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {loading ? "Analyzing..." : "Analyze Data"}
                    </Button>
                  </Stack>
                </CardContent>
                {loading && (
                  <LinearProgress
                    sx={{
                      height: 4,
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#A3E635",
                        transition: "transform 0.4s linear",
                      },
                    }}
                  />
                )}
              </Card>
            </Grid>

            {/* Error Display - Enhanced */}
            {error && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    bgcolor: "#ffebee",
                    borderRadius: 2,
                    border: "1px solid #ef5350",
                    boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)",
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ErrorIcon sx={{ color: "#d32f2f", fontSize: 24 }} />
                      <Typography
                        color="#d32f2f"
                        sx={{
                          fontWeight: 500,
                          fontSize: "1rem"
                        }}
                      >
                        {error}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Analysis Results */}
            {analysis && (
              <>
                <Grid item xs={12}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3,
                      border: "1px solid #e0e0e0",
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        background: "linear-gradient(135deg, #008C8C 0%, #006666 100%)",
                      }}
                    >
                      <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        sx={{
                          minHeight: 56,
                          "& .MuiTab-root": {
                            transition: "all 0.2s ease",
                            minHeight: 56,
                            padding: "12px 16px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            color: "rgba(255,255,255,0.7)",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.9)",
                            },
                          },
                          "& .Mui-selected": {
                            fontWeight: 700,
                            color: "white !important",
                            backgroundColor: "rgba(255,255,255,0.15)",
                          },
                          "& .MuiTabs-indicator": {
                            backgroundColor: "#A3E635",
                            height: 3,
                          },
                        }}
                      >
                        <Tab
                          icon={<AssessmentIcon />}
                          label="Analysis"
                          iconPosition="start"
                        />
                        <Tab
                          icon={<GridOnIcon />}
                          label="Data Grid"
                          iconPosition="start"
                        />
                      </Tabs>
                    </Box>
                    {activeTab === 0 ? (
                      <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                          <Grid item xs={12} sm={6} md={4}>
                            <Card 
                              variant="outlined"
                              sx={{
                                borderRadius: 3,
                                border: "2px solid #E8F5F5",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderColor: "#008C8C",
                                  boxShadow: "0 4px 16px rgba(0, 140, 140, 0.2)",
                                  transform: "translateY(-4px)"
                                }
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                  <Box
                                    sx={{
                                      bgcolor: "#E8F5F5",
                                      borderRadius: 2,
                                      p: 1,
                                      display: "flex"
                                    }}
                                  >
                                    <TableChartIcon sx={{ color: "#008C8C", fontSize: 28 }} />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    color="#008C8C"
                                  >
                                    Total Rows
                                  </Typography>
                                </Stack>
                                <Typography variant="h3" fontWeight={700} color="#1F2937">
                                  {analysis.total_rows.toLocaleString()}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Card 
                              variant="outlined"
                              sx={{
                                borderRadius: 3,
                                border: "2px solid #F4FCE3",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderColor: "#A3E635",
                                  boxShadow: "0 4px 16px rgba(163, 230, 53, 0.2)",
                                  transform: "translateY(-4px)"
                                }
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                  <Box
                                    sx={{
                                      bgcolor: "#F4FCE3",
                                      borderRadius: 2,
                                      p: 1,
                                      display: "flex"
                                    }}
                                  >
                                    <GridOnIcon sx={{ color: "#A3E635", fontSize: 28 }} />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    color="#A3E635"
                                  >
                                    Total Columns
                                  </Typography>
                                </Stack>
                                <Typography variant="h3" fontWeight={700} color="#1F2937">
                                  {analysis.total_columns}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Card 
                              variant="outlined"
                              sx={{
                                borderRadius: 3,
                                border: "2px solid #fff3e0",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  borderColor: "#ff9800",
                                  boxShadow: "0 4px 16px rgba(255, 152, 0, 0.2)",
                                  transform: "translateY(-4px)"
                                }
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                  <Box
                                    sx={{
                                      bgcolor: "#fff3e0",
                                      borderRadius: 2,
                                      p: 1,
                                      display: "flex"
                                    }}
                                  >
                                    <WarningIcon sx={{ color: "#ff9800", fontSize: 28 }} />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    color="#ff9800"
                                  >
                                    Duplicate Rows
                                  </Typography>
                                </Stack>
                                <Typography variant="h3" fontWeight={700} color="#1F2937">
                                  {analysis.duplicate_rows.total}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {analysis.duplicate_rows.percentage.toFixed(2)}% of total
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                        <Card 
                          sx={{ 
                            width: "100%", 
                            maxWidth: "4xl", 
                            borderRadius: 3,
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                          }}
                        >
                          <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                              <Box
                                sx={{
                                  bgcolor: "#E8F5F5",
                                  borderRadius: 2,
                                  p: 1.5,
                                  display: "flex"
                                }}
                              >
                                <AlertCircle 
                                  style={{
                                    width: 24,
                                    height: 24,
                                    color: "#008C8C"
                                  }}
                                />
                              </Box>
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="#1F2937"
                              >
                                Validation Conditions
                              </Typography>
                            </Stack>

                            <Box
                              component="ul"
                              sx={{
                                listStyle: "none",
                                p: 0,
                                m: 0,
                                "& > li": { mb: 1.5 },
                              }}
                            >
                              {conditions.map((condition, index) => (
                                <Box
                                  component="li"
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "#F9FAFB",
                                    border: "1px solid #e0e0e0",
                                    "&:hover": {
                                      bgcolor: "#E8F5F5",
                                      borderColor: "#008C8C",
                                      boxShadow: "0 2px 8px rgba(0, 140, 140, 0.1)"
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <Chip
                                    label={index + 1}
                                    size="small"
                                    sx={{
                                      bgcolor: "#008C8C",
                                      color: "white",
                                      fontWeight: 700,
                                      minWidth: 28,
                                      mr: 2,
                                      mt: 0.3
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      color: "#1F2937",
                                      flex: 1,
                                      fontSize: "0.95rem",
                                      lineHeight: 1.6
                                    }}
                                  >
                                    {condition}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </CardContent>
                    ) : (
                      <Box
                        sx={{
                          height: "calc(100vh - 200px)",
                          width: "100%",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "8px",
                          backgroundColor: "#ffffff",
                          padding: "10px",
                          transition: "all 0.3s ease",
                          maxWidth: "100%",
                          overflow: "hidden",
                          boxSizing: "border-box",
                          "& .MuiDataGrid-root": {
                            width: "100%",
                            maxWidth: "100%",
                            "& .MuiDataGrid-virtualScroller": {
                              overflowX: "auto !important",
                            },
                          },
                        }}
                      >
                        {revalidating && <RevalidationOverlay />}
                        <Box
                          sx={{
                            mb: 3,
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                            borderRadius: 2,
                            bgcolor: "#F9FAFB",
                            border: "1px solid #e0e0e0"
                          }}
                        >
                          <Stack spacing={2} flex={1}>
                            <Stack
                              direction="row"
                              spacing={3}
                              flexWrap="wrap"
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    bgcolor: "rgba(255, 0, 0, 0.55)",
                                    borderRadius: 1,
                                    border: "1px solid rgba(255, 0, 0, 0.7)"
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: "#1F2937" }}
                                >
                                  Location / Regional Mismatch
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    bgcolor: "rgba(255, 176, 0, 0.35)",
                                    borderRadius: 1,
                                    border: "1px solid rgba(255, 176, 0, 0.5)"
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: "#1F2937" }}
                                >
                                  Missing / TBD / UpperCase
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    bgcolor: "rgba(248, 150, 201, 0.8)",
                                    borderRadius: 1,
                                    border: "1px solid rgba(248, 150, 201, 1)"
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, color: "#1F2937" }}
                                >
                                  Duplicate Row
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              onClick={handleExport}
                              startIcon={<FileDownloadIcon />}
                              disabled={!analysis}
                              sx={{
                                borderRadius: 2,
                                py: 1.5,
                                px: 3,
                                fontWeight: 600,
                                bgcolor: "#008C8C",
                                boxShadow: "0 4px 12px rgba(0, 140, 140, 0.3)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: "#006666",
                                  boxShadow: "0 6px 16px rgba(0, 140, 140, 0.4)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Export Data
                            </Button>
                            {hasUnsavedChanges && (
                              <Button
                                variant="contained"
                                onClick={handleSaveChanges}
                                startIcon={<SaveIcon />}
                                disabled={revalidating}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.5,
                                  px: 3,
                                  fontWeight: 600,
                                  bgcolor: "#A3E635",
                                  color: "#1F2937",
                                  boxShadow: "0 4px 12px rgba(163, 230, 53, 0.3)",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: "#8BC629",
                                    boxShadow: "0 6px 16px rgba(163, 230, 53, 0.4)",
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                {revalidating
                                  ? "Validating..."
                                  : "Save Changes"}
                              </Button>
                            )}
                          </Stack>
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            overflow: "auto",
                            borderRadius: 3,
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                            position: "relative",
                            "&::before":
                              loading || revalidating
                                ? {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "3px",
                                    background:
                                      "linear-gradient(90deg, transparent, rgba(163, 230, 53, 0.8), transparent)",
                                    animation: "loading 1.5s infinite",
                                    zIndex: 10,
                                  }
                                : {},
                          }}
                        >
                          <DataGrid
                            rows={getPaginatedData()}
                            columns={getGridColumns()}
                            initialState={{
                              pagination: {
                                paginationModel: {
                                  pageSize: rowsPerPage,
                                  page: page,
                                },
                              },
                              columns: {
                                columnVisibilityModel: {},
                              },
                            }}
                            pageSizeOptions={[rowsPerPage]}
                            pagination
                            paginationMode="server"
                            onPaginationModelChange={(model) =>
                              setPage(model.page)
                            }
                            rowCount={analysis?.data?.length || 0}
                            loading={loading}
                            disableRowSelectionOnClick
                            density="comfortable"
                            editMode="cell"
                            processRowUpdate={handleProcessRowUpdate}
                            sx={{
                              width: "100%",
                              height: "100%",
                              flex: 1,
                              padding: "0",
                              border: "none",
                              borderRadius: "8px",
                              boxSizing: "border-box",
                              maxWidth: "100%",
                              "& .MuiDataGrid-root": {
                                border: "none",
                                boxSizing: "border-box",
                                width: "100%",
                                maxWidth: "100%",
                              },
                              "& .MuiDataGrid-main": {
                                width: "100%",
                                minWidth: "100%",
                                overflow: "auto",
                                boxSizing: "border-box",
                                maxWidth: "100%",
                              },
                              "& .MuiDataGrid-virtualScroller": {
                                overflowY: "auto",
                                overflowX: "auto",
                                boxSizing: "border-box",
                                minWidth: "100%",
                                maxWidth: "100%",
                                "&::-webkit-scrollbar": {
                                  width: "10px",
                                  height: "10px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "#008C8C",
                                  borderRadius: "5px",
                                },
                                "&::-webkit-scrollbar-track": {
                                  backgroundColor: "rgba(0,0,0,0.05)",
                                },
                              },
                              "& .MuiDataGrid-cell": {
                                padding: 0,
                                overflow: "hidden",
                                whiteSpace: "normal",
                                lineHeight: "normal",
                                boxSizing: "border-box",
                                borderBottom:
                                  "1px solid rgba(224, 224, 224, 0.4)",
                                "&:focus": {
                                  outline: "none",
                                },
                                "&:focus-within": {
                                  outline: `2px solid #008C8C`,
                                  outlineOffset: "-1px",
                                },
                              },
                              "& .MuiDataGrid-row": {
                                "&:hover": {
                                  backgroundColor: "rgba(0, 140, 140, 0.05)",
                                },
                              },
                              "& .MuiDataGrid-columnHeader": {
                                padding: "0 16px",
                                boxSizing: "border-box",
                                height: "36px !important",
                                lineHeight: "36px !important",
                              },
                              "& .duplicate-row": {
                                backgroundColor: "rgba(248, 150, 201, 0.8)",
                                "&:hover": {
                                  backgroundColor: "rgba(248, 150, 201, 0.9)",
                                },
                              },
                              "& .MuiDataGrid-columnHeaders": {
                                background: "linear-gradient(135deg, #008C8C 0%, #006666 100%)",
                                borderBottom: "none",
                                height: "36px !important",
                                minHeight: "36px !important",
                                maxHeight: "36px !important",
                                "& .MuiDataGrid-columnHeaderTitle": {
                                  fontWeight: 700,
                                  color: "white",
                                  fontSize: "0.875rem",
                                },
                              },
                              "& .MuiDataGrid-columnSeparator": {
                                visibility: "hidden",
                              },
                              "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell":
                                {
                                  transition: "none !important",
                                },
                              "& .MuiDataGrid-footerContainer": {
                                minHeight: "24px",
                              },
                              "@keyframes loading": {
                                "0%": {
                                  transform: "translateX(-100%)",
                                },
                                "100%": {
                                  transform: "translateX(100%)",
                                },
                              },
                            }}
                            components={{
                              Pagination: () => (
                                <Box
                                  sx={{
                                    position: "fixed",
                                    bottom: 20,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                    padding: "12px 20px",
                                    borderRadius: 3,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                                    zIndex: 9999,
                                    transition: "all 0.2s ease",
                                    border: "1px solid #e0e0e0",
                                    "&:hover": {
                                      boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                                    },
                                  }}
                                >
                                  <Button
                                    onClick={() =>
                                      setPage(Math.max(0, page - 1))
                                    }
                                    disabled={page === 0}
                                    sx={{
                                      mr: 2,
                                      py: 1,
                                      px: 3,
                                      borderRadius: 2,
                                      minWidth: "110px",
                                      fontWeight: 600,
                                      bgcolor: "#008C8C",
                                      color: "white",
                                      transition: "all 0.2s ease",
                                      "&:not(:disabled):hover": {
                                        bgcolor: "#006666",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(0, 140, 140, 0.3)",
                                      },
                                      "&:disabled": {
                                        bgcolor: "#e0e0e0",
                                        color: "#999"
                                      }
                                    }}
                                    variant="contained"
                                  >
                                    Previous
                                  </Button>
                                  <Typography
                                    sx={{
                                      mx: 3,
                                      alignSelf: "center",
                                      fontWeight: 700,
                                      color: "#1F2937",
                                      fontSize: "1rem"
                                    }}
                                  >
                                    Page {page + 1} of{" "}
                                    {Math.ceil(
                                      (analysis?.data?.length || 0) /
                                        rowsPerPage
                                    )}
                                  </Typography>
                                  <Button
                                    onClick={() => setPage(page + 1)}
                                    disabled={
                                      !analysis?.data ||
                                      (page + 1) * rowsPerPage >=
                                        analysis.data.length
                                    }
                                    variant="contained"
                                    sx={{
                                      py: 1,
                                      px: 3,
                                      borderRadius: 2,
                                      minWidth: "110px",
                                      fontWeight: 600,
                                      bgcolor: "#008C8C",
                                      color: "white",
                                      transition: "all 0.2s ease",
                                      "&:not(:disabled):hover": {
                                        bgcolor: "#006666",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(0, 140, 140, 0.3)",
                                      },
                                      "&:disabled": {
                                        bgcolor: "#e0e0e0",
                                        color: "#999"
                                      }
                                    }}
                                  >
                                    Next
                                  </Button>
                                </Box>
                              ),
                            }}
                            getRowClassName={(params) => {
                              const isDuplicate =
                                analysis.duplicate_rows.indices.includes(
                                  params.row.id - 1
                                );
                              return isDuplicate ? "duplicate-row" : "";
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

/**
 * DataValidation component that wraps DataValidationContent with PaginationProvider
 * This ensures that the usePagination hook is used within a PaginationProvider context
 */
const DataValidation = () => {
  return (
    <PaginationProvider>
      <DataValidationContent />
    </PaginationProvider>
  );
};

export default DataValidation;