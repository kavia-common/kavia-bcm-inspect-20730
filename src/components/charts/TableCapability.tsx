import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Fade,
  useTheme,
} from '@mui/material';
import { fetchDashboardTableData } from 'apis';


const CapabilityTable = () => {
  const [data, setData] = useState<{
    businessCapability: string;
    E2EBusinessProcess: string;
    domain: string;
    subDomain: string;
    noApplication: number;
  }[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const theme = useTheme();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDashboardTableData();
        setData(result.response.map((item: { core_capability: any; E2EBusinessProcess: any; domain: any; subdomain: any; noApplication: any; }) => ({
          businessCapability: item.core_capability,
          E2EBusinessProcess: item.E2EBusinessProcess,
          domain: item.domain ?? '',
          subDomain: item.subdomain ?? '',
          noApplication: item.noApplication ?? 0
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpand = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <TableContainer>
        <Table stickyHeader aria-label="dynamic capability table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Business Capability</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>E2E Business Process</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Domain</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Sub-domain</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Applications</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <React.Fragment key={index}>
                <TableRow
                  hover
                  onClick={() => toggleRowExpand(index)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell>{row.businessCapability}</TableCell>
                  <TableCell>{row.E2EBusinessProcess}</TableCell>
                  <TableCell>{row.domain}</TableCell>
                  <TableCell>{row.subDomain}</TableCell>
                  <TableCell>{row.noApplication}</TableCell>
                  {/* <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => toggleRowExpand(index)}>
                      <ExpandMoreIcon
                        sx={{
                          transform: expandedRow === index ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s',
                        }}
                      />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
                {/* <TableRow>
                  <TableCell colSpan={5} sx={{ padding: 0, borderBottom: 'none' }}>
                    <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                      <Fade in={expandedRow === index}>
                        <Box
                          sx={{
                            backgroundColor: theme.palette.background.default,
                            padding: '16px 24px',
                            borderTop: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {row.details}
                          </Typography>
                        </Box>
                      </Fade>
                    </Collapse>
                  </TableCell>
                </TableRow> */}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" padding="16px">
        <Typography>Show rows:</Typography>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
};

export default CapabilityTable;