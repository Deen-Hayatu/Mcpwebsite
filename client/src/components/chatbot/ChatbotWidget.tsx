import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

type MessageRole = "user" | "assistant" | "system";

type Message = {
  role: MessageRole;
  content: string;
};

type ChatbotProps = {
  initialMessage?: string;
  systemPrompt?: string;
};

const ChatbotWidget = ({ initialMessage = "How can I help you today?", systemPrompt }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant" as const, content: initialMessage }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = { 
      role: "user" as MessageRole, 
      content: inputMessage 
    };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      // We need to properly format messages for Perplexity API
      // It requires alternating user/assistant messages
      let formattedMessages: Message[] = [];
      
      // Add latest user message
      formattedMessages.push(userMessage);
      
      // Process messages in reverse order (newest first) 
      // Add one prev assistant and one prev user message if available
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        
        // Skip system messages
        if (msg.role === "system") continue;
        
        // If we already have 2 messages before the latest user message, stop
        if (formattedMessages.length >= 3) break;
        
        // Add message
        formattedMessages.unshift(msg);
      }
            
      // Send to API
      const response = await apiRequest("POST", "/api/chatbot", {
        messages: formattedMessages,
        systemPrompt
      });
      
      const data = await response.json();
      
      if (data.success && data.response) {
        // Add bot response to chat
        setMessages(prev => [
          ...prev, 
          { 
            role: "assistant" as const, 
            content: data.response.content 
          }
        ]);
      } else {
        // Add error message
        setMessages(prev => [
          ...prev, 
          { role: "assistant" as const, content: "Sorry, I encountered an error. Please try again." }
        ]);
      }
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      setMessages(prev => [
        ...prev, 
        { role: "assistant" as const, content: "Sorry, there was an error connecting to the chatbot service. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Chatbot Button */}
      {!isOpen && (
        <Button 
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 text-white"
          onClick={toggleChatbot}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      
      {/* Chatbot Panel */}
      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-xl overflow-hidden flex flex-col w-full sm:w-[350px] transition-all duration-300 border border-slate-200 ${
            isMinimized ? 'h-14' : 'h-[500px]'
          }`}
        >
          {/* Chatbot Header */}
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-medium">MPC Assistant</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:text-white hover:bg-primary/80"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-white hover:text-white hover:bg-primary/80"
                onClick={toggleChatbot}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Messages Container - Only shown when not minimized */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "flex flex-row-reverse" : "flex"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === "user" ? (
                        <>
                          <span className="font-semibold">You</span>
                          <User className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <Bot className="h-3 w-3" />
                          <span className="font-semibold">MPC Assistant</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex mb-4">
                  <div className="bg-gray-200 p-3 rounded-lg rounded-tl-none">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <span className="font-semibold">MPC Assistant</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Input Form - Only shown when not minimized */}
          {!isMinimized && (
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={handleInputChange}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !inputMessage.trim()}
                className={`${
                  isLoading || !inputMessage.trim() 
                    ? 'bg-gray-200 text-gray-500' 
                    : 'bg-primary text-white'
                }`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;