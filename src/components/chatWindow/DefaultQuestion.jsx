/*import React, { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";

const DefaultQuestions = ({
  onQuestionSelect,
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const buttonRefs = useRef([]);
  const announceRef = useRef(null);

  const defaultQuestions = [
    "Identify E2E Business Process for Enterprise Resource Planning",
    "What are the business capability, domain and subdomain for SAP ?",
    "For Finance Business Capability, Treasury Domain and Cash Management subdomain list all products grouped together by region.",
    "List all the products by Enterprise Support business capability.",
    "For Finance Business Capability list all products grouped together by region.",
  ];

  const handleClick = useCallback(
    (question, index) => {
      if (isLoading || disabled) return;

      setSelectedIndex(index);

      if (announceRef.current) {
        announceRef.current.textContent = `Selected question: ${question}. Processing your request.`;
      }

      onQuestionSelect(question);
    },
    [onQuestionSelect, isLoading, disabled]
  );

  const handleKeyDown = useCallback(
    (event, index) => {
      if (isLoading || disabled) return;

      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft": {
          event.preventDefault();
          const prevIndex = index > 0 ? index - 1 : defaultQuestions.length - 1;
          buttonRefs.current[prevIndex]?.focus();
          setFocusedIndex(prevIndex);
          break;
        }
        case "ArrowDown":
        case "ArrowRight": {
          event.preventDefault();
          const nextIndex = index < defaultQuestions.length - 1 ? index + 1 : 0;
          buttonRefs.current[nextIndex]?.focus();
          setFocusedIndex(nextIndex);
          break;
        }
        case "Enter":
        case " ": {
          event.preventDefault();
          handleClick(defaultQuestions[index], index);
          break;
        }
        default:
          break;
      }
    },
    [defaultQuestions, handleClick, isLoading, disabled]
  );

  return (
    <div className="space-y-8" role="region" aria-label="Popular questions">
      <div
        ref={announceRef}
        className="sr-only"
        role="status"
        aria-live="polite"
      />
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Popular Questions
      </h2>
      <div
        className={`flex flex-col space-y-3 p-4 ${className}`}
        role="listbox"
        aria-label="Default questions"
      >
        {defaultQuestions.map((question, index) => (
          <button
            key={index}
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => handleClick(question, index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              text-left px-5 py-4 rounded-lg shadow-md
              border border-blue-200 focus:outline-none
              focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              text-gray-700 relative transition-all duration-300
              ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
              ${
                selectedIndex === index
                  ? "bg-blue-100 border-blue-400 text-blue-800 ring-2 ring-blue-400"
                  : "bg-white"
              }
              ${
                (hoveredIndex === index || focusedIndex === index) &&
                !disabled &&
                !isLoading
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 scale-105 shadow-lg"
                  : "hover:bg-blue-50 hover:text-blue-700 hover:scale-105 hover:shadow-lg"
              }
            `}
            disabled={disabled || isLoading}
            role="option"
            aria-selected={selectedIndex === index}
            aria-disabled={disabled || isLoading}
            aria-label={`Ask: ${question}${
              selectedIndex === index && isLoading ? ". Processing..." : ""
            }`}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

DefaultQuestions.propTypes = {
  onQuestionSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default DefaultQuestions;*/
import React, { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { ArrowRightIcon } from "@heroicons/react/24/solid"; // Optional side icon

const DefaultQuestions = ({
  onQuestionSelect,
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const buttonRefs = useRef([]);
  const announceRef = useRef(null);

  const defaultQuestions = [
    "Identify E2E Business Process for Enterprise Resource Planning",
    "What are the business capability, domain and subdomain for SAP ?",
    "For Finance Business Capability, Treasury Domain and Cash Management subdomain list all products grouped together by region.",
    "List all the products by Enterprise Support business capability.",
    "For Finance Business Capability list all products grouped together by region.",
  ];

  const handleClick = useCallback(
    (question, index) => {
      if (isLoading || disabled) return;

      setSelectedIndex(index);

      if (announceRef.current) {
        announceRef.current.textContent = `Selected question: ${question}. Processing your request.`;
      }

      onQuestionSelect(question);
    },
    [onQuestionSelect, isLoading, disabled]
  );

  const handleKeyDown = useCallback(
    (event, index) => {
      if (isLoading || disabled) return;

      switch (event.key) {
        case "ArrowUp":
        case "ArrowLeft": {
          event.preventDefault();
          const prevIndex = index > 0 ? index - 1 : defaultQuestions.length - 1;
          buttonRefs.current[prevIndex]?.focus();
          setFocusedIndex(prevIndex);
          break;
        }
        case "ArrowDown":
        case "ArrowRight": {
          event.preventDefault();
          const nextIndex = index < defaultQuestions.length - 1 ? index + 1 : 0;
          buttonRefs.current[nextIndex]?.focus();
          setFocusedIndex(nextIndex);
          break;
        }
        case "Enter":
        case " ": {
          event.preventDefault();
          handleClick(defaultQuestions[index], index);
          break;
        }
        default:
          break;
      }
    },
    [defaultQuestions, handleClick, isLoading, disabled]
  );

  return (
    <div className="flex space-x-6">
      {/* Side Menu */}
      <div className="flex flex-col w-2 bg-blue-600 rounded-l-lg">
        {defaultQuestions.map((_, index) => (
          <div
            key={index}
            className={`h-12 transition-all duration-300 ${
              selectedIndex === index
                ? "bg-white w-full"
                : hoveredIndex === index || focusedIndex === index
                ? "bg-blue-400 w-full"
                : "bg-blue-600 w-full"
            }`}
          />
        ))}
      </div>

      {/* Questions List */}
      <div
        className={`flex-1 flex flex-col space-y-3 p-4 bg-white rounded-r-lg shadow-md ${className}`}
        role="listbox"
        aria-label="Default questions"
      >
        <div
          ref={announceRef}
          className="sr-only"
          role="status"
          aria-live="polite"
        />
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Popular Questions
        </h2>

        {defaultQuestions.map((question, index) => (
          <button
            key={index}
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => handleClick(question, index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled || isLoading}
            role="option"
            aria-selected={selectedIndex === index}
            aria-disabled={disabled || isLoading}
            aria-label={`Ask: ${question}${
              selectedIndex === index && isLoading ? ". Processing..." : ""
            }`}
            className={`
              relative flex items-center justify-between px-4 py-3 rounded-lg
              border border-gray-200 shadow-sm
              transition-all duration-300
              ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${
                selectedIndex === index
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "bg-white text-gray-700"
              }
              ${
                (hoveredIndex === index || focusedIndex === index) &&
                !disabled &&
                !isLoading
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 scale-105 shadow-lg"
                  : ""
              }
            `}
          >
            <span>{question}</span>
            {/* Optional side arrow */}
            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

DefaultQuestions.propTypes = {
  onQuestionSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default DefaultQuestions;
