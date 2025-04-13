import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

const ChatComponent = ({ appId, apiToken, userId, nickname }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [channel, setChannel] = useState(null);
  const [sb, setSb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  // Log actual app ID for debugging
  console.log("Using Sendbird appId:", appId);

  // Initialize Sendbird chat
  useEffect(() => {
    if (!appId) {
      console.error('Sendbird App ID is missing');
      setIsLoading(false);
      setConnectionError('Configuration missing');
      return;
    }

    let sendbirdChat;
    try {
      // Create Sendbird instance with modules
      sendbirdChat = SendbirdChat.init({
        appId: appId,
        modules: [new GroupChannelModule()]
      });
      
      // Connect to Sendbird
      sendbirdChat.connect(userId)
        .then((user) => {
          console.log('Connected to Sendbird as:', user);
          setSb(sendbirdChat);
          
          // Define a safe channel URL (no special chars)
          const channelUrl = `support_channel_${userId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
          
          // Try to get the channel if it exists
          return sendbirdChat.groupChannel.getChannel(channelUrl)
            .catch((error) => {
              console.log('Channel not found, creating new one:', error);
              
              // Create a new channel with fixed parameters
              return sendbirdChat.groupChannel.createChannel({
                name: 'Customer Support',
                channelUrl: channelUrl,
                userIds: [userId, 'admin'],
                isDistinct: true
              });
            });
        })
        .then((groupChannel) => {
          console.log('Channel ready:', groupChannel);
          setChannel(groupChannel);
          
          // Load previous messages
          const messageListParams = {};
          messageListParams.nextLimit = 20;
          return groupChannel.getMessagesByTimestamp(Date.now(), messageListParams);
        })
        .then((messages) => {
          console.log('Loaded messages count:', messages?.length);
          setMessages(messages || []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Sendbird connection error:', error);
          setConnectionError(error.message || 'Connection failed');
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Sendbird initialization error:', error);
      setConnectionError(error.message || 'Initialization failed');
      setIsLoading(false);
    }

    return () => {
      if (sendbirdChat) {
        sendbirdChat.disconnect();
      }
    };
  }, [appId, userId]);

  // Set up message handler
  useEffect(() => {
    if (!sb || !channel) return;
    
    console.log('Setting up message handler');
    
    try {
      // Get the channel handler collection
      const channelHandlerCollection = sb.groupChannel;
      
      if (!channelHandlerCollection) {
        console.error('Channel handler collection is undefined');
        return;
      }
      
      // Check if addGroupChannelHandler method exists
      if (typeof channelHandlerCollection.addGroupChannelHandler === 'function') {
        // For newer Sendbird versions
        const handler = {
          onMessageReceived: (targetChannel, message) => {
            console.log('Message received:', message);
            if (targetChannel.url === channel.url) {
              setMessages(prev => [...prev, message]);
            }
          }
        };
        
        channelHandlerCollection.addGroupChannelHandler('chat-handler', handler);
        
        return () => {
          channelHandlerCollection.removeGroupChannelHandler('chat-handler');
        };
      } else if (typeof channelHandlerCollection.addChannelHandler === 'function') {
        // For older Sendbird versions
        const handler = {
          onMessageReceived: (targetChannel, message) => {
            console.log('Message received (old API):', message);
            if (targetChannel.url === channel.url) {
              setMessages(prev => [...prev, message]);
            }
          }
        };
        
        channelHandlerCollection.addChannelHandler('chat-handler', handler);
        
        return () => {
          channelHandlerCollection.removeChannelHandler('chat-handler');
        };
      } else {
        console.error('No compatible channel handler method found');
      }
    } catch (error) {
      console.error('Error setting up message handler:', error);
    }
  }, [sb, channel]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isLoading]);

  // Manual send message function
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !channel || isSending) {
      console.log("Can't send: empty message, no channel, or already sending");
      return;
    }

    try {
      console.log('Trying to send message:', inputMessage);
      setIsSending(true);
      
      channel.sendUserMessage({
        message: inputMessage.trim()
      })
      .then((message) => {
        console.log('Message sent successfully:', message);
        setMessages(prev => [...prev, message]);
        setInputMessage('');
        setIsSending(false);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        setIsSending(false);
      });
    } catch (error) {
      console.error('Exception in send message:', error);
      setIsSending(false);
    }
  };

  // Handle form submission (prevent default)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Handle keyboard enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-spice-primary hover:bg-spice-secondary rounded-full w-14 h-14 flex items-center justify-center shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-7 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 rounded-lg overflow-hidden shadow-lg bg-white"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{ width: "350px", height: "500px" }}
          >
            <div className="flex flex-col h-full">
              {/* Chat header */}
              <div className="bg-spice-primary text-white p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Chat Support</h3>
                  <p className="text-xs opacity-75">We typically reply within minutes</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Messages area */}
              <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spice-primary"></div>
                  </div>
                ) : connectionError ? (
                  <div className="flex flex-col justify-center items-center h-full text-center px-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 text-red-500 mb-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <p className="text-red-600 font-medium mb-2">Connection Error</p>
                    <p className="text-gray-600 text-sm">{connectionError}</p>
                    <p className="text-gray-500 text-xs mt-4">Please try again later or contact support</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Start your conversation</p>
                    <p className="text-sm">Our team will respond as soon as possible</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-2 max-w-[80%] ${msg.sender?.userId === userId ? 'ml-auto' : 'mr-auto'}`}
                    >
                      <div 
                        className={`rounded-lg px-3 py-2 break-words ${
                          msg.sender?.userId === userId 
                            ? 'bg-spice-primary text-white rounded-tr-none' 
                            : 'bg-gray-200 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div 
                        className={`text-xs mt-1 ${
                          msg.sender?.userId === userId ? 'text-right' : 'text-left'
                        } text-gray-500`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input area - using a form for better submission handling */}
              <form onSubmit={handleFormSubmit} className="p-3 border-t">
                <div className="flex">
                  <input
                    type="text"
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-spice-primary"
                    disabled={isLoading || !channel || !!connectionError || isSending}
                  />
                  <button
                    type="submit"
                    ref={buttonRef}
                    className={`px-4 py-2 rounded-r-lg flex items-center justify-center ${
                      !isLoading && channel && !connectionError && !isSending
                        ? 'bg-spice-primary text-white hover:bg-spice-secondary'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={isLoading || !channel || !!connectionError || isSending}
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="font-medium">Send</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatComponent;