import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Message from "./Message";
import DefaultQuestions from "./DefaultQuestion";

const WELCOME_MESSAGE =
  "👋 Hello! I'm your AI assistant. How can I help you today?";
const SCROLL_THRESHOLD = 150;
const SCROLL_DEBOUNCE_TIME = 150;

const ChatWindow = ({ messages = [], onAddMessage }) => {
  const containerRef = useRef(null);
  const debouncedScrollHandler = useRef(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollHeightRef = useRef(0);
  const lastScrollPositionRef = useRef(0);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  const displayMessages = useMemo(() => {
    if (messages.length === 0) {
      return [
        {
          type: "ai",
          content: WELCOME_MESSAGE,
          isWelcomeMessage: true,
        },
      ];
    }
    return messages;
  }, [messages]);

  const handleQuestionSelect = useCallback(
    (question) => {
      // console.log(`------------questions`, question);
      if (onAddMessage) {
        onAddMessage({
          type: "user",
          content: question,
        });
      }
    },
    [onAddMessage]
  );

  const isNearBottom = useCallback(() => {
    if (!containerRef.current) return false;
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    return scrollHeight - (scrollTop + clientHeight) < SCROLL_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    const newScrollHeight = containerRef.current.scrollHeight;

    if (newScrollHeight !== lastScrollHeightRef.current) {
      try {
        containerRef.current.scrollTo({
          top: newScrollHeight,
          behavior: "smooth",
        });
        lastScrollHeightRef.current = newScrollHeight;
      } catch (error) {
        containerRef.current.scrollTop = newScrollHeight;
        lastScrollHeightRef.current = newScrollHeight;
      }
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    isUserScrollingRef.current = true;

    if (debouncedScrollHandler.current) {
      clearTimeout(debouncedScrollHandler.current);
    }

    const currentScrollPosition = containerRef.current.scrollTop;

    if (Math.abs(currentScrollPosition - lastScrollPositionRef.current) > 5) {
      const isNearBottomNow = isNearBottom();

      if (shouldAutoScroll !== isNearBottomNow) {
        debouncedScrollHandler.current = setTimeout(() => {
          setShouldAutoScroll(isNearBottomNow);
          isUserScrollingRef.current = false;
        }, SCROLL_DEBOUNCE_TIME);
      }

      lastScrollPositionRef.current = currentScrollPosition;
    }
  }, [isNearBottom, shouldAutoScroll]);

  const handleMessagesUpdate = useCallback(() => {
    if (!containerRef.current) return;

    const isAtBottom = isNearBottom();
    if (isAtBottom && !isUserScrollingRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      if (newScrollHeight !== lastScrollHeightRef.current) {
        scrollToBottom();
      }
    }
  }, [isNearBottom, scrollToBottom]);

  useEffect(() => {
    handleMessagesUpdate();
  }, [messages, handleMessagesUpdate]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    return () => {
      if (debouncedScrollHandler.current) {
        clearTimeout(debouncedScrollHandler.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-[calc(100vh-80px)] sm:h-[550px] overflow-y-auto bg-gradient-to-br from-green-50 via-white to-purple-50 rounded-lg p-4 space-y-4 shadow-lg border border-green-200"
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Chat messages"
      onScroll={handleScroll}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(75, 134, 103, 0.5) transparent",
      }}
    >
      <div className="p-4 flex flex-col h-[calc(90vh-80px)] sm:h-[calc(90vh-120px)]">
        {messages.length === 0 ? (
          <div className="flex flex-col space-y-4">
            <div
              className="flex flex-col items-center justify-center p-4"
              role="region"
              aria-label="Welcome section"
            >
              <DefaultQuestions
                onQuestionSelect={handleQuestionSelect}
                className="w-full max-w-2xl mx-auto"
              />
            </div>
          </div>
        ) : (
          displayMessages.map((message, index) => (
            <Message
              key={index}
              type={message.type}
              content={message.content}
              messageType={message.messageType}
              isWelcomeMessage={message.isWelcomeMessage}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
