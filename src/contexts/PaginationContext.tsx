import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Interface defining the shape of the pagination context data
 */
interface PaginationContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  handlePageChange: (newPage: number) => void;
}

/**
 * Props for the PaginationProvider component
 */
interface PaginationProviderProps {
  children: ReactNode;
}

/**
 * Create the context with undefined as default value
 * The actual value will be provided by the PaginationProvider
 */
const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

/**
 * Custom hook to use the pagination context
 * Throws an error if used outside of a PaginationProvider
 */
export const usePagination = (): PaginationContextType => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};

/**
 * Provider component that makes pagination context available to its children
 * Manages pagination state and provides functions for changing pages
 */
export const PaginationProvider: React.FC<PaginationProviderProps> = ({ children }) => {
  // State for current page, starting at 0 (zero-based index)
  const [page, setPage] = useState<number>(0);
  
  // Fixed number of rows per page
  const rowsPerPage = 100;

  /**
   * Handler for page change events
   * @param newPage - The new page index to navigate to
   */
  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  // Context value containing pagination state and handlers
  const value: PaginationContextType = {
    page,
    setPage,
    rowsPerPage,
    handlePageChange,
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};

export default PaginationContext;