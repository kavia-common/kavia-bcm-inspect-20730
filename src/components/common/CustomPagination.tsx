import React from 'react';
import { TablePagination } from '@mui/material';

interface CustomPaginationProps {
  totalData: number;       // total number of items
  currentPage: number;     // 1-based current page
  pageSize: number;        // 0 means "All"
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalData,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}) => {
  /**
   * Handle changes in rows per page.
   * MUI's TablePagination typically emits event.target.value as a string,
   * so parse it to a number. If NaN, default to 0 (All).
   */
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    let parsedValue = parseInt(rawValue, 10);
    if (isNaN(parsedValue)) {
      parsedValue = 0; // fallback to "All"
    }
    setPageSize(parsedValue);
    setCurrentPage(1);
  };

  /**
   * MUI's TablePagination is 0-based, but our currentPage is 1-based.
   * If pageSize === 0 => force page to 0 (the only page).
   */
  const muiPageIndex = pageSize === 0 ? 0 : currentPage - 1;

  /**
   * If pageSize === 0 => treat rowsPerPage as totalData.
   * This ensures MUI sees exactly one page: Math.ceil(totalData / totalData) = 1.
   */
  const muiRowsPerPage = pageSize === 0 ? totalData : pageSize;

  return (
    <TablePagination
    style={{marginTop: "10px"}}
      component="div"
      count={totalData}
      page={muiPageIndex}
      rowsPerPage={muiRowsPerPage}
      onPageChange={(event, newPage) => {
        // Only change page if not in "All" mode
        if (pageSize !== 0) {
          setCurrentPage(newPage + 1);
        }
      }}
      onRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={[
        { label: 'All', value: 0 },
        { label: '10', value: 10 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
      ]}
      labelRowsPerPage="Rows per page:"
      labelDisplayedRows={({ count }) => {
        if (pageSize === 0) {
          return `Showing all ${count} items`;
        }
        const totalPages = Math.ceil(count / pageSize);
        return `Page ${currentPage} of ${totalPages} (${count} items)`;
      }}
      SelectProps={{
        renderValue: (selected) => {
          const val = selected as number;
          return val === 0 ? 'All' : val;
        },
      }}
    />
  );
};

export default CustomPagination;
