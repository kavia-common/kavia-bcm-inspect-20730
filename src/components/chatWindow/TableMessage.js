import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useCallbacks } from "./context/callbackContext";

const TableMessage = ({ headers, rows }) => {
  const { onInsightClick, onDiagramClick, onE2EDiagramClick } = useCallbacks();
  const tableRef = useRef(null);
  const [error, setError] = useState(null);

  // Moved CSV download logic to a separate hook for better organization
  const useCSVDownload = () => {
    const formatCSVCell = useCallback((cell) => {
      const stringCell = String(cell)
        .replace(/\r?\n|\r/g, " ")
        .trim();
      return stringCell.includes(" ") ||
        stringCell.includes(",") ||
        stringCell.includes('"')
        ? `"${stringCell.replace(/"/g, '""')}"`
        : stringCell;
    }, []);

    const downloadCSV = useCallback(() => {
      try {
        const processedRows = rows.map((row) =>
          row.map((cell) => formatCSVCell(cell))
        );

        const csvContent = [
          headers.map(formatCSVCell).join(","),
          ...processedRows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        Object.assign(link, {
          href: url,
          download: "table_data.csv",
          style: { visibility: "hidden" },
        });

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading CSV:", err);
        setError(`Failed to download CSV: ${err.message}`);
      }
    }, [headers, rows, formatCSVCell]);

    return downloadCSV;
  };

  const downloadCSV = useCSVDownload();

  // Data validation hook
  const useDataValidation = () => {
    useEffect(() => {
      try {
        if (!Array.isArray(headers))
          throw new Error("Headers must be an array");
        if (!Array.isArray(rows)) throw new Error("Rows must be an array");

        const validations = [
          [
            headers.some((header) => typeof header !== "string"),
            "All headers must be strings",
          ],
          [
            rows.some((row) => !Array.isArray(row)),
            "Each row must be an array",
          ],
          [
            rows.some((row) => row.length !== headers.length),
            "Each row must have the same number of cells as headers",
          ],
          [
            rows.some((row) => row.some((cell) => typeof cell !== "string")),
            "All cells must contain string values",
          ],
        ];

        const failedValidation = validations.find(([condition]) => condition);
        if (failedValidation) throw new Error(failedValidation[1]);

        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }, [headers, rows]);
  };

  useDataValidation();

  // Keyboard navigation hook
  const useKeyboardNavigation = () => {
    useEffect(() => {
      const handleKeyNavigation = (e) => {
        if (!tableRef.current) return;

        const cells = tableRef.current.querySelectorAll("th, td");
        const currentFocusIndex = Array.from(cells).indexOf(
          document.activeElement
        );
        const totalColumns = headers.length;
        const totalRows = rows.length + 1;

        const navigationMap = {
          ArrowRight: () =>
            currentFocusIndex % totalColumns < totalColumns - 1
              ? currentFocusIndex + 1
              : currentFocusIndex,
          ArrowLeft: () =>
            currentFocusIndex % totalColumns > 0
              ? currentFocusIndex - 1
              : currentFocusIndex,
          ArrowDown: () => {
            const nextIndex = currentFocusIndex + totalColumns;
            return nextIndex < cells.length ? nextIndex : currentFocusIndex;
          },
          ArrowUp: () => {
            const prevIndex = currentFocusIndex - totalColumns;
            return prevIndex >= 0 ? prevIndex : currentFocusIndex;
          },
          Home: () =>
            e.ctrlKey
              ? 0
              : Math.floor(currentFocusIndex / totalColumns) * totalColumns,
          End: () =>
            e.ctrlKey
              ? cells.length - 1
              : Math.floor(currentFocusIndex / totalColumns) * totalColumns +
                totalColumns -
                1,
          PageUp: () => currentFocusIndex % totalColumns,
          PageDown: () =>
            (totalRows - 1) * totalColumns + (currentFocusIndex % totalColumns),
        };

        const newIndex = navigationMap[e.key]?.();

        if (
          newIndex !== undefined &&
          newIndex !== currentFocusIndex &&
          cells[newIndex]
        ) {
          cells[newIndex].focus();
          e.preventDefault();
        }
      };

      const table = tableRef.current;
      if (table) {
        table.addEventListener("keydown", handleKeyNavigation);
        return () => table.removeEventListener("keydown", handleKeyNavigation);
      }
    }, [headers.length, rows.length]);
  };

  useKeyboardNavigation();

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-sm my-4" role="alert">
        Error: {error}
      </div>
    );
  }

  if (!headers.length || !rows.length) {
    return (
      <div
        className="text-gray-500 dark:text-gray-400 text-sm my-4"
        role="alert"
      >
        No data available
      </div>
    );
  }

  const ActionButton = ({ onClick, label, className }) => (
    <button
      onClick={onClick}
      className={`${className} px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
      aria-label={label}
    >
      {label.replace(/Generate|from table data/g, "")}
    </button>
  );

  return (
    <div
      className="overflow-x-auto w-full my-4 shadow-sm rounded-lg"
      role="table"
      aria-label="Data table"
      aria-rowcount={rows.length + 1}
      aria-colcount={headers.length}
      aria-describedby="table-description"
    >
      <div id="table-description" className="sr-only">
        This table contains {rows.length} rows and {headers.length} columns. Use
        arrow keys to navigate between cells.
      </div>
      <table
        ref={tableRef}
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed sm:table-auto"
        role="presentation"
      >
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={`header-${index}`}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                tabIndex={0}
                role="columnheader"
                aria-sort="none"
                aria-colindex={index + 1}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <tr
              key={`row-${rowIndex}`}
              className={
                rowIndex % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50 dark:bg-gray-800"
              }
              role="row"
              aria-rowindex={rowIndex + 2}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="px-6 py-4 whitespace-normal text-sm text-gray-900 dark:text-gray-100"
                  tabIndex={0}
                  role="gridcell"
                  aria-colindex={cellIndex + 1}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center gap-3 mt-4 px-2">
        {/* <ActionButton
          onClick={onInsightClick}
          label="Generate Insights from table data"
          className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
        /> */}
        <ActionButton
          onClick={onE2EDiagramClick}
          label="E2E Business"
          className="bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-green-700 text-white focus:ring-blue-500"
        />
        <ActionButton
          onClick={onDiagramClick}
          // label="Generate Diagram from table data"
          label="Business Capability"
          className="bg-gradient-to-r from-teal-600 to-teal-700 hover:bg-green-700 text-white focus:ring-blue-500"
        />
        <ActionButton
          onClick={downloadCSV}
          label="Download CSV"
          className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
        />
      </div>
    </div>
  );
};

TableMessage.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  // onInsightClick: PropTypes.func,
  // onDiagramClick: PropTypes.func,
};

TableMessage.defaultProps = {
  onInsightClick: () => {},
  onDiagramClick: () => {},
  onE2EDiagramClick: () => {},
};

export default TableMessage;
