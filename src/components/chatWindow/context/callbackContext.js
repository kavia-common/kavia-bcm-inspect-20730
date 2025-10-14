import React, { createContext, useContext, useState, useEffect } from "react";
import APIService from "../APIService";

// Initialize API service
const apiService = new APIService();

const CallbackContext = createContext();

export const CallbackProvider = ({
  children,
  onMessagesUpdate,
  onIsLoading,
}) => {
  // const [isLoading, setIsLoading] = useState(false);
  // useEffect(() => {
  //   console.log("Loading state changed-->1:", onIsLoading);
  // }, [onIsLoading]); // Logs every time `isLoading` changes

  const handleInsightClick = async () => {
    onIsLoading(true);
    onMessagesUpdate({ type: "user", content: "Generate Insights from the table data" });
    try {
      const insights = await apiService.generateInsights({ priority: 0 });
      // console.log(`insights: ${JSON.stringify(insights.insights)}`);
      if (insights) {
        const aiMessages = {
          type: "ai",
          content: insights.insights,
          messageType: "insight",
        };
        onMessagesUpdate(aiMessages); // Pass the response back to the parent component
      } else {
        // Handle unexpected response format
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    } finally {
      onIsLoading(false);
    }
  };

  const handleDiagramClick = async () => {
    onIsLoading(true);
    onMessagesUpdate({ type: "user", content: "Generate Diagram from the table data" });

    try {
        const placeholderId = `diagram-${Date.now()}`;
        let imageIndex = 0; // Track multiple images

        const base64ToBlobUrl = (base64) => {
          try {
              const byteCharacters = atob(base64); // Decode Base64
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: "image/png" });
              return URL.createObjectURL(blob); // Generate Blob URL
          } catch (error) {
              console.error("Error converting Base64 to Blob:", error);
              return null;
          }
      };

        const handleStreamingChunk = (chunk) => {
            if (chunk.done) {
                onIsLoading(false);
                return;
            }

            if (!chunk.content) return; // Ignore empty chunks
            
            const imageUrl = base64ToBlobUrl(chunk.content); // Convert Base64 to Blob URL
            console.log(`🔹 Received chunk for image ${imageIndex}:`, imageUrl);
            onMessagesUpdate({
                type: "ai",
                id: `${placeholderId}-${imageIndex}`, // Unique ID for each image
                content: imageUrl || chunk.content, // Use Blob URL if available, fallback to Base64
                messageType: "image",
                isStreaming: false
            });

            imageIndex++; // Move to the next image
        };

        await apiService.generateDiagram({
            priority: 0,
            stream: true,
            onChunk: handleStreamingChunk
        });

    } catch (error) {
        console.error("Error generating diagram:", error);
        onMessagesUpdate({
            type: "ai",
            content: "Failed to generate diagram. Please try again.",
            messageType: "error"
        });
    } finally {
        onIsLoading(false);
    }
};

const handleE2EDiagramClick = async () => {
  onIsLoading(true);
  onMessagesUpdate({
    type: "user",
    content: "Generate E2E Business Diagram from the table data",
  });

  try {
    const placeholderId = `e2e-diagram-${Date.now()}`;
    let imageIndex = 0;

    const base64ToBlobUrl = (base64) => {
      try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error("E2E: Error converting Base64 to Blob:", error);
        return null;
      }
    };

    const handleStreamingChunk = (chunk) => {
      if (chunk.done) {
        onIsLoading(false);
        return;
      }

      if (!chunk.content) return;

      const imageUrl = base64ToBlobUrl(chunk.content);
      console.log(`🔷 E2E Chunk ${imageIndex}:`, imageUrl);

      onMessagesUpdate({
        type: "ai",
        id: `${placeholderId}-${imageIndex}`,
        content: imageUrl || chunk.content,
        messageType: "image",
        isStreaming: false,
      });

      imageIndex++;
    };

    await apiService.e2eDiagram({
      priority: 0,
      stream: true,
      onChunk: handleStreamingChunk,
    });
  } catch (error) {
    console.error("E2E: Error generating diagram:", error);
    onMessagesUpdate({
      type: "ai",
      content: "Failed to generate E2E Business diagram. Please try again.",
      messageType: "error",
    });
  } finally {
    onIsLoading(false);
  }
};



  const value = {
    onInsightClick: handleInsightClick,
    onDiagramClick: handleDiagramClick,
    onE2EDiagramClick: handleE2EDiagramClick,
  };

  return (
    <CallbackContext.Provider value={value}>
      {children}
    </CallbackContext.Provider>
  );
};

export const useCallbacks = () => {
  const context = useContext(CallbackContext);
  if (!context) {
    throw new Error("useCallbacks must be used within a CallbackProvider");
  }
  return context;
};
