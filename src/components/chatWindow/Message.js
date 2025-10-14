import React, { useState } from "react";
import PropTypes from "prop-types";
import TableMessage from "./TableMessage";
import { Download } from "lucide-react";

/**
 * Canonical E2E Business column order
 */
const E2E_BUSINESS_COL_ORDER = [
  "Application Name",
  "E2E Business Name",
  "Business Capability",
  "Domain",
  "Subdomain",
  "Region",
  "Country"
];

/**
 * Detects if the table is an E2E Business table by checking for the E2E Business Name column.
 * @param {Array<Object>} content
 * @returns {boolean}
 */
function isE2EBusinessTable(content) {
  if (!content || !content[0]) return false;
  return Object.keys(content[0]).some(
    key => key.toLowerCase().replace(/\s+/g, '') === 'e2ebusinessname'
  );
}

/**
 * Transforms array of objects into headers and rows format,
 * enforcing E2E Business column order if detected.
 * @param {Array<Object>} content
 * @returns {{headers: string[], rows: string[][]}}
 */
function transformTableData(content) {
  if (!content || content.length === 0) return { headers: [], rows: [] };

  if (isE2EBusinessTable(content)) {
    const headers = E2E_BUSINESS_COL_ORDER;
    const rows = content.map(row =>
      headers.map(col => row[col] !== undefined && row[col] !== null ? String(row[col]) : "")
    );
    return { headers, rows };
  }

  // Default behavior for non-E2E tables
  const headers = Object.keys(content[0]);
  const rows = content.map(item =>
    headers.map(header => item[header] === null ? "" : String(item[header]))
  );
  return { headers, rows };
}

/**
 * Type guard to validate table content structure
 * @param {any} content - The content to validate
 * @returns {boolean} - True if content is an array of objects
 */
const isValidTableContent = (content) => {
  if (!Array.isArray(content) || content.length === 0) {
    return false;
  }
  // Check if all items are objects
  return content.every((item) => item !== null && typeof item === "object");
};

const isValidInsightContent = (content) => {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return false;
  }
  return Object.entries(content).every(
    ([key, value]) => typeof key === "string" && typeof value === "string"
  );
};

/**
 * Message component that renders different types of message content (text, image, table)
 */
const Message = ({
  type,
  content,
  messageType = "text",
  isWelcomeMessage,
  // onInsightClick,
  // onDiagramClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidBase64 = (str) => {
    try {
      return str.match(/^([A-Za-z0-9+\/=]|\n|\r)+$/); // Improved regex for Base64 validation
    } catch (e) {
      return false;
    }
  };

  const handleImageError = (event) => {
    console.error("Failed to load image:", event.target.src);
    setImageError(true);
  };

  const handleImageDownload = (imageBase64) => {
    try {
      const link = document.createElement("a");
      const imageContent = imageBase64.startsWith("data:image/png;base64,")
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;
      link.href = imageContent;
      link.download = `image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleBlobImageDownload = async (blobUrl, fileName = `image-${Date.now()}.png`) => {
    try {
      if (!blobUrl) {
        throw new Error('Blob URL is required');
      }
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      return true;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error(`Failed to download image: ${error.message}`);
    }
  };

  const renderContent = () => {
    if (messageType === "image") {
      if (!content) {
        return <p className="text-red-500">No image available</p>;
      }
      if (imageError) {
        return <p className="text-red-500">Failed to load image</p>;
      }
      return (
        <div className="relative group">
          <img
            src={content}
            alt="Message content"
            onError={handleImageError}
            className="max-w-full h-auto rounded-lg"
          />
          <button
            onClick={() => handleBlobImageDownload(content)}
            className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Download image"
          >
            Download
          </button>
        </div>
      );
    }

    if (messageType === "table") {
      if (!isValidTableContent(content)) {
        return (
          <p className="text-red-500">
            Invalid table data: Expected an array of objects
          </p>
        );
      }
      const tableData = transformTableData(content);
      return (
        <div className="relative">
          <TableMessage headers={tableData.headers} rows={tableData.rows} />
        </div>
      );
    }

    if (messageType === "insight") {
      if (!isValidInsightContent(content)) {
        return <p className="text-red-500">Invalid insight format</p>;
      }
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([description, imageData], index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 mb-3">{description}</p>
              <div className="relative group">
                <img
                  src={`data:image/png;base64,${imageData}`}
                  alt={`Insight visualization ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                  onError={handleImageError}
                />
                <button
                  onClick={() => handleImageDownload(imageData)}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Download insight image"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <p className="break-words whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div
      className={`flex ${type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[75%] p-3 rounded-lg
          ${
            type === "user"
              ? "bg-blue-700 text-white rounded-br-none"
              : isWelcomeMessage
              ? "bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 p-6 rounded-lg text-white shadow-lg border border-blue-400"
              : "bg-white text-gray-800 shadow-sm rounded-bl-none"
          }
        `}
        role="article"
        aria-label={`${type === "user" ? "Your message" : "AI response"}`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

Message.propTypes = {
  type: PropTypes.oneOf(["user", "ai"]).isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.object), // Updated to accept array of objects
  ]).isRequired,
  messageType: PropTypes.oneOf(["text", "image", "table"]),
  isWelcomeMessage: PropTypes.bool,
  // onInsightClick: PropTypes.func,
  // onDiagramClick: PropTypes.func,
};

export default React.memo(Message, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.content === nextProps.content &&
    prevProps.messageType === nextProps.messageType &&
    prevProps.isWelcomeMessage === nextProps.isWelcomeMessage
  );
});
