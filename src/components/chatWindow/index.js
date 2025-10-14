// import React, { useState, useEffect } from "react";
// import "./index.css";
// import InputBox from "./InputBox";
// import SubmitButton from "./SubmitButton";
// import ChatWindow from "./ChatWindow";
// import LoadingIndicator from "./LoadingIndicator";
// import APIService from "./APIService";
// import { CallbackProvider } from "./context/callbackContext";

// // Initialize API service
// const apiService = new APIService();

// function AIChat({ initialMessages = [], onMessagesUpdate }) {
//   const [messages, setMessages] = useState(initialMessages);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     if (onMessagesUpdate) {
//       onMessagesUpdate(messages);
//     }
//   }, [messages, onMessagesUpdate]);

//   const handleFileSelect = (file) => {
//     setSelectedFile(file);
//     setError(null);
//   };

//   const handleChange = (value) => {
//     setInputValue(value);
//     setError(null);
//   };

//   const clearInput = () => {
//     setInputValue("");
//     setError(null);
//   };

//   const processUserMessage = async (content) => {
//     const userMessage = { type: "user", content: content.trim() };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await apiService.sendQuery(userMessage.content);

//       if (Array.isArray(response)) {
//         const aiMessages = {
//           type: "ai",
//           content: response,
//           messageType: "table",
//         };
//         setMessages((prev) => [...prev, aiMessages]);
//       } else if (response.response) {
//         const aiMessage = {
//           type: "ai",
//           content: response.response,
//           messageType: "text",
//         };
//         setMessages((prev) => [...prev, aiMessage]);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (error) {
//       let errorMessage = "An error occurred while processing your request.";

//       if (error.message.includes("Invalid response format")) {
//         errorMessage =
//           "Received an invalid response from the AI service. Please try again.";
//       } else if (error.message.includes("No response received")) {
//         errorMessage =
//           "Unable to connect to the AI service. Please check your connection and try again.";
//       } else if (error.response?.status === 429) {
//         errorMessage = "Too many requests. Please wait a moment and try again.";
//       } else if (error.response?.status === 503) {
//         errorMessage =
//           "AI service is temporarily unavailable. Please try again later.";
//       }

//       setError(errorMessage);
//       console.error("API Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!inputValue.trim()) {
//       setError("Please enter a message");
//       return;
//     }

//     setInputValue("");
//     await processUserMessage(inputValue);
//   };

//   const handleAddMessage = async (message) => {
//     if (message && message.content) {
//       await processUserMessage(message.content);
//     }
//   };

//   const handleMessagesUpdate = (newMessage) => {
//     setMessages((prev) => [...prev, newMessage]);
//   };

//   const onIsLoading = (loadingState) => {
//     setIsLoading(loadingState);
//   };

//   return (
//     <div className="flex flex-col rounded-lg items-center justify-center">
//       <div className="w-full max-w-8xl bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4">
//        {/* <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
//           Ask AI
//         </h1> */}
//         {/* <div className="p-4 flex flex-col h-[calc(90vh-80px)]"> */}
//           <div className="flex-grow overflow-auto relative">
//             <CallbackProvider
//               onMessagesUpdate={handleMessagesUpdate}
//               onIsLoading={onIsLoading}
//             >
//               <ChatWindow messages={messages} onAddMessage={handleAddMessage} />
//             </CallbackProvider>
//           </div>

//           {error && (
//             <div className="text-red-500 text-sm text-center" role="alert">
//               {error}
//             </div>
//           )}

//           <div className="mt-4 flex items-center gap-2">
//             <div className="flex space-x-2 flex-grow">
//               <InputBox
//                 inputValue={inputValue}
//                 handleChange={handleChange}
//                 clearInput={clearInput}
//               />
//             </div>
//             <div className="flex-none px-2">
//               <SubmitButton
//                 onClick={handleSubmit}
//                 isLoading={isLoading}
//                 disabled={!inputValue.trim()}
//               />
//             </div>
//           </div>

//           {isLoading && (
//             <div className="flex justify-center">
//               <LoadingIndicator size="sm" text="AI is thinking..." />
//             </div>
//           )}
//         </div>
//       </div>
//     // </div>
//   );
// }

// export default AIChat;


import React, { useState, useEffect } from "react";
import "./index.css";
import InputBox from "./InputBox";
import SubmitButton from "./SubmitButton";
import ChatWindow from "./ChatWindow";
import LoadingIndicator from "./LoadingIndicator";
import APIService from "./APIService";
import { CallbackProvider } from "./context/callbackContext";
import { MessageCircle, Plus, Clock, ChevronRight, Sparkles } from "lucide-react";
//import Logo from "/src/assets/images/logo-light@2x.png"; // your logo path
import Logo from "../../assets/images/logo-light@2x.png";


// Initialize API service
const apiService = new APIService();

function AIChat({ initialMessages = [], onMessagesUpdate }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  const chatHistory = [
    { id: 1, title: 'Regional Report Analysis', time: '2 hours ago', preview: 'How do I filter by region?' },
    { id: 2, title: 'Export Data Query', time: '5 hours ago', preview: 'Can I export filtered results?' },
    { id: 3, title: 'Business Capabilities', time: 'Yesterday', preview: 'What are business capabilities?' },
    { id: 4, title: 'Status Filters', time: 'Yesterday', preview: 'How to filter by status?' },
    { id: 5, title: 'Domain Mapping', time: '2 days ago', preview: 'Explain domain structure' },
  ];

  const frequentQuestions = [
    { question: "How do I filter reports by region or country?", category: "Filtering" },
    { question: "What do the different status values mean?", category: "Data" },
    { question: "How can I export my filtered data?", category: "Export" },
    { question: "What is the difference between Domain and Sub-domain?", category: "Structure" },
    { question: "How do I use the global search feature?", category: "Search" },
    { question: "Can I sort by multiple columns?", category: "Sorting" },
  ];

  useEffect(() => {
    if (onMessagesUpdate) {
      onMessagesUpdate(messages);
    }
  }, [messages, onMessagesUpdate]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleChange = (value) => {
    setInputValue(value);
    setError(null);
  };

  const clearInput = () => {
    setInputValue("");
    setError(null);
  };

  const processUserMessage = async (content) => {
    const userMessage = { type: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendQuery(userMessage.content);

      if (Array.isArray(response)) {
        const aiMessages = {
          type: "ai",
          content: response,
          messageType: "table",
        };
        setMessages((prev) => [...prev, aiMessages]);
      } else if (response.response) {
        const aiMessage = {
          type: "ai",
          content: response.response,
          messageType: "text",
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      let errorMessage = "An error occurred while processing your request.";

      if (error.message.includes("Invalid response format")) {
        errorMessage =
          "Received an invalid response from the AI service. Please try again.";
      } else if (error.message.includes("No response received")) {
        errorMessage =
          "Unable to connect to the AI service. Please check your connection and try again.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.response?.status === 503) {
        errorMessage =
          "AI service is temporarily unavailable. Please try again later.";
      }

      setError(errorMessage);
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a message");
      return;
    }

    setInputValue("");
    await processUserMessage(inputValue);
  };

  const handleAddMessage = async (message) => {
    if (message && message.content) {
      await processUserMessage(message.content);
    }
  };

  const handleMessagesUpdate = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const onIsLoading = (loadingState) => {
    setIsLoading(loadingState);
  };

  const handleQuestionClick = (question) => {
    setInputValue(question);
  };

  return (
    <div className="flex h-full w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Left Sidebar - Chat History */}
      <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col items-center">
        {/* Logo/Header */}
        <div className="p-6 flex flex-col items-center w-full">
          <img
            src={Logo}
            alt="Logo"
            className="h-16 w-auto mb-4"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.querySelector(".fallback-logo").style.display = "flex";
            }}
          />
          <div
            style={{ display: "none" }}
            className="fallback-logo w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg mb-4"
          >
            <Sparkles className="w-6 h-6 text-lime-400" />
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => setMessages([])}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Conversation
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 w-full">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Recent Conversations</h3>
          </div>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                  activeChat === chat.id
                    ? 'bg-gradient-to-r from-teal-50 to-lime-50 border-2 border-teal-200'
                    : 'bg-white border border-gray-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{chat.title}</h4>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-all ${activeChat === chat.id ? 'text-teal-600 translate-x-1' : 'group-hover:translate-x-1'}`} />
                </div>
                <p className="text-xs text-gray-600 line-clamp-1 mb-2">{chat.preview}</p>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                AI Assistant of Biz First
              </h1>
              <p className="text-sm text-gray-600">
                Ask questions about your reports, data, and analytics
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gradient-to-b from-white to-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col">
              {/* Welcome Message */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Sparkles className="w-10 h-10 text-lime-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    How can I help you today?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Ask me anything about your reports, filtering, data analysis, or system features
                  </p>
                </div>
              </div>

              {/* Frequent Questions */}
              <div className="pb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-teal-600 to-lime-400 rounded-full"></span>
                  Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {frequentQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(item.question)}
                      className="group p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-lg transition-all duration-300 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-100 to-lime-100 group-hover:from-teal-600 group-hover:to-teal-700 rounded-lg flex items-center justify-center transition-all duration-300">
                          <MessageCircle className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded mb-2">
                            {item.category}
                          </span>
                          <p className="text-sm font-medium text-gray-800 leading-relaxed group-hover:text-teal-700 transition-colors">
                            {item.question}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-grow overflow-auto">
                <CallbackProvider
                  onMessagesUpdate={handleMessagesUpdate}
                  onIsLoading={onIsLoading}
                >
                  <ChatWindow messages={messages} onAddMessage={handleAddMessage} />
                </CallbackProvider>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-8 py-6 border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center" role="alert">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-grow">
                <InputBox
                  inputValue={inputValue}
                  handleChange={handleChange}
                  clearInput={clearInput}
                />
              </div>
              <div className="flex-none">
                <SubmitButton
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!inputValue.trim()}
                />
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center mt-4">
                <LoadingIndicator size="sm" text="AI is thinking..." />
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default AIChat;
