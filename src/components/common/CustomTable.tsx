import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
  CircularProgress,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardOutlined from "@mui/icons-material/ArrowUpward";
import ArrowDownwardOutlined from "@mui/icons-material/ArrowDownward";
import CustomMenu from "./CustomMenu";
import CustomEditDialog from "./CustomEditDialog";
import CustomDeleteDialog from "./CustomDeleteDialog";
import { deleteApplication, patchApplication } from "apis";
import CustomMapping from "./MappingPagination";

interface TableData {
  id: string;
  businessCapabilityName: string;
  domain: string;
  subDomain: string;
  applicationName: string;
  applicationVersion?: string;
  core_id: string;
  domain_id: string;
  subdomain_id: string;
  E2EBusinessProcess: string;
  region: string;
  country: string;
  status: string;
}

interface CustomTableProps {
  data: TableData[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalCount: number;
  setTotalCount: (count: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  editCallback: () => Promise<void>;
  sortConfig: { key: string; direction: "ASC" | "DESC" | "" };
  handleSort: (key: string) => void;
  searchMode?: "row" | "all-columns";
  searchTerm?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  data,
  loading,
  page,
  setPage,
  totalCount,
  setTotalCount,
  pageSize,
  setPageSize,
  editCallback,
  sortConfig,
  handleSort,
  searchMode = "row",
  searchTerm = "",
}) => {
  const [filteredData, setFilteredData] = useState<TableData[]>(data);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = data.filter((row) => {
      if (searchMode === "row") {
        return Object.values(row).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTermLower)
        );
      } else {
        const searchTerms = searchTermLower.split(" ").filter(Boolean);
        return searchTerms.every((term) =>
          Object.values(row).some(
            (value) => value && value.toString().toLowerCase().includes(term)
          )
        );
      }
    });
    setFilteredData(filtered);
  }, [searchTerm, data, searchMode]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<TableData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<TableData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: TableData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    console.log("Selected row for deletion/edit:", row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (row: TableData) => {
    console.log(row, "edict");
    setEditData({
      ...row,
      core_id: row.core_id || "",
      domain_id: row.domain_id || "",
      subdomain_id: row.subdomain_id || "",
      region: row.region || "",
      country: row.country || "",
      status: row.status || "",
      E2EBusinessProcess: row.E2EBusinessProcess || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditData(null);
  };

  const handleEditSave = async (payload: {
    core_id: string;
    domain_id: string;
    subdomain_id: string;
    region: string;
    country: string;
    status: string;
    name: string;
    applicationVersion?: string;
    E2EBusinessProcess?: string;
  }) => {
    if (!editData) return;

    try {
      const response = await patchApplication(
        editData.id,
        JSON.stringify(payload)
      );
      if (!response.ok) {
        throw new Error("Failed to update the application");
      }

      const result = await response.json();
      console.log("Edit saved successfully:", result);

      setEditDialogOpen(false);
      setEditData(null);
      await editCallback();
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("An error occurred while saving the edit. Please try again.");
    }
  };

  const handleEditChange = (field: string, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleChangePage = (
    event: React.MouseEvent<unknown> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) {
      console.error("No selected row to delete");
      return;
    }
    console.log("Deleting application with ID:", selectedRow.id);
    try {
      const response = await deleteApplication(selectedRow.id);
      console.log("Response status:", response.status);
      if (!response.ok) {
        console.error(
          "Failed to delete application. Status code:",
          response.status
        );
        throw new Error("Failed to delete the application");
      }

      console.log("Deleted data:", selectedRow);

      setDeleteDialogOpen(false);
      setSelectedRow(null);
      await editCallback();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert(
        "An error occurred while deleting the application. Please try again."
      );
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const columns = [
    { label: "Digital Product", key: "applicationName" },
    { label: "Status", key: "status" },
    { label: "E2E Business Process", key: "E2EBusinessProcess" },
    { label: "Business Capability", key: "businessCapabilityName" },
    { label: "Domain", key: "domain" },
    { label: "Sub-domain", key: "subDomain" },
    { label: "Region", key: "region" },
    { label: "Country", key: "country" },
  ];

  return (
    <Box position="relative">
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(249, 250, 251, 0.95)",
            zIndex: 10,
            borderRadius: 2,
          }}
        >
          <CircularProgress
            sx={{
              color: "#008C8C",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
            size={48}
            thickness={4}
          />
        </Box>
      )}

      {filteredData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "450px",
            textAlign: "center",
            backgroundColor: "#F9FAFB",
            borderRadius: 2,
            padding: 4,
          }}
        >
          <img
            src="https://digitalt3.com/wp-content/uploads/2024/12/No-data-bcm.png"
            alt="No results found"
            style={{
              width: "300px",
              marginBottom: "20px",
              opacity: 0.9,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "#6B7280",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            No data found
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#9CA3AF",
              fontSize: "14px",
              mt: 1,
            }}
          >
            Try adjusting your filters or search criteria
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            borderRadius: "8px",
            maxHeight: 600,
            overflowY: "auto",
            border: "1px solid #E5E7EB",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#F9FAFB",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#008C8C",
              borderRadius: "4px",
              transition: "background-color 0.2s ease",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#006666",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    backgroundColor: "#008C8C",
                    color: "#F9FAFB",
                    borderBottom: "2px solid #A3E635",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                  },
                }}
              >
                {columns.map(({ label, key }) => (
                  <TableCell
                    key={key}
                    align="left"
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                      paddingY: 2,
                      paddingX: 2,
                      fontWeight: 700,
                      fontSize: "13px",
                      "&:hover": {
                        backgroundColor: "#006B6B",
                      },
                    }}
                    onClick={() => handleSort(key)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {label}
                      {sortConfig.key === key ? (
                        sortConfig.direction === "ASC" ? (
                          <ArrowUpwardOutlined style={{ fontSize: 16, color: "#A3E635" }} />
                        ) : sortConfig.direction === "DESC" ? (
                          <ArrowDownwardOutlined style={{ fontSize: 16, color: "#A3E635" }} />
                        ) : (
                          <ArrowUpwardOutlined
                            style={{
                              fontSize: 16,
                              color: "rgba(255,255,255,0.5)",
                            }}
                          />
                        )
                      ) : (
                        <ArrowUpwardOutlined
                          style={{
                            fontSize: 16,
                            color: "rgba(255,255,255,0.4)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    backgroundColor: "#008C8C",
                    color: "#F9FAFB",
                    borderBottom: "2px solid #A3E635",
                    textAlign: "center",
                    width: "80px",
                    paddingX: 2,
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: "#E6F9F5 !important",
                    },
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      fontWeight: 600,
                      color: "#1F2937",
                    }}
                  >
                    {row.applicationName || "-"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                    }}
                  >
                    <Chip
                      label={row.status || "-"}
                      size="small"
                      sx={{
                        backgroundColor:
                          row.status === "Terminate"
                            ? "#FEE2E2"
                            : row.status === "Invest"
                            ? "#D1FAE5"
                            : row.status === "Maintain"
                            ? "#FEF3C7"
                            : row.status === "Retire"
                            ? "#E0E7FF"
                            : "#F3F4F6",
                        color:
                          row.status === "Terminate"
                            ? "#991B1B"
                            : row.status === "Invest"
                            ? "#008C8C"
                            : row.status === "Maintain"
                            ? "#92400E"
                            : row.status === "Retire"
                            ? "#3730A3"
                            : "#1F2937",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        border:
                          row.status === "Terminate"
                            ? "1px solid #FCA5A5"
                            : row.status === "Invest"
                            ? "1px solid #A3E635"
                            : row.status === "Maintain"
                            ? "1px solid #FCD34D"
                            : row.status === "Retire"
                            ? "1px solid #A5B4FC"
                            : "1px solid #E5E7EB",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      color: "#374151",
                    }}
                  >
                    {row.E2EBusinessProcess || "-"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      color: "#374151",
                    }}
                  >
                    {row.businessCapabilityName || "-"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      color: "#374151",
                    }}
                  >
                    {row.domain || "-"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      color: "#374151",
                    }}
                  >
                    {row.subDomain || "-"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      color: "#374151",
                    }}
                  >
                    {row.region || "-"}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                      color: "#374151",
                    }}
                  >
                    {row.country || "-"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #E5E7EB",
                      paddingY: 2,
                      paddingX: 2,
                    }}
                  >
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, row)}
                      sx={{
                        transform: "rotate(90deg)",
                        color: "#6B7280",
                        padding: "8px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(0, 140, 140, 0.12)",
                          color: "#008C8C",
                          transform: "rotate(90deg) scale(1.15)",
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                    {selectedRow === row && (
                      <CustomMenu
                        anchorEl={anchorEl}
                        onClose={handleCloseMenu}
                        onOpen={(event) => handleOpenMenu(event, row)}
                        onDelete={handleDeleteClick}
                        onEdit={() => handleEditClick(row)}
                        capabilityName={""}
                        label={""}
                        useCustomEditDialog={true}
                        useCustomDeleteDialog={true}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {editData && (
            <CustomEditDialog
              open={editDialogOpen}
              onClose={handleEditDialogClose}
              onSave={(payload: any) => handleEditSave(payload)}
              data={editData}
              onChange={handleEditChange}
              sort={""}
            />
          )}
          <CustomDeleteDialog
            open={deleteDialogOpen}
            onClose={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
            title={`Delete ${selectedRow?.businessCapabilityName}`}
          />

          <Box sx={{ p: 2, borderTop: "1px solid #E5E7EB", bgcolor: "#F9FAFB" }}>
            <CustomMapping
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </Box>
        </TableContainer>
      )}
    </Box>
  );
};

export default CustomTable;