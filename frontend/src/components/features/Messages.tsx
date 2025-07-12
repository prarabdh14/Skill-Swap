import React, { useState } from 'react';
import { Send, Search, MoreVertical } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Message } from '../../types';

export const Messages: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const myMessages = state.messages.filter(message => 
    message.senderId === state.currentUser?.id || message.receiverId === state.currentUser?.id
  );

  // Group messages by conversation (other user)
  const conversations = myMessages.reduce((acc, message) => {
    const otherUserId = message.senderId === state.currentUser?.id ? message.receiverId : message.senderId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  // Sort conversations by latest message
  const sortedConversations = Object.entries(conversations).sort(([, messagesA], [, messagesB]) => {
    const latestA = Math.max(...messagesA.map(m => m.timestamp.getTime()));
    const latestB = Math.max(...messagesB.map(m => m.timestamp.getTime()));
    return latestB - latestA;
  });

  const selectedConversation = selectedUserId ? conversations[selectedUserId] || [] : [];
  const selectedUser = selectedUserId ? state.users.find(u => u.id === selectedUserId) : null;

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUserId || !state.currentUser) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: state.currentUser.id,
      receiverId: selectedUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    };

    dispatch({ type: 'ADD_MESSAGE', payload: message });
    setNewMessage('');
  };

  const markAsRead = (messageId: string) => {
    dispatch({ type: 'MARK_MESSAGE_READ', payload: messageId });
  };

  const getUnreadCount = (userId: string) => {
    return conversations[userId]?.filter(m => !m.isRead && m.receiverId === state.currentUser?.id).length || 0;
  };

  const getLastMessage = (userId: string) => {
    const messages = conversations[userId];
    return messages[messages.length - 1];
  };

  const filteredConversations = sortedConversations.filter(([userId]) => {
    const user = state.users.find(u => u.id === userId);
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-[600px] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <Card className="h-full rounded-r-none">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={setSearchQuery}
              icon={Search}
            />
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto">
            <div className="space-y-1">
              {filteredConversations.map(([userId]) => {
                const user = state.users.find(u => u.id === userId);
                const lastMessage = getLastMessage(userId);
                const unreadCount = getUnreadCount(userId);
                const isSelected = selectedUserId === userId;

                if (!user) return null;

                return (
                  <button
                    key={userId}
                    onClick={() => {
                      setSelectedUserId(userId);
                      // Mark unread messages as read
                      conversations[userId]
                        ?.filter(m => !m.isRead && m.receiverId === state.currentUser?.id)
                        .forEach(m => markAsRead(m.id));
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={user.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {unreadCount > 0 && (
                          <Badge variant="error" size="sm" className="absolute -top-1 -right-1 min-w-[20px] h-5">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lastMessage?.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        <Card className="h-full rounded-l-none">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedUser.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {selectedUser.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUser.location || 'Online'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={MoreVertical} />
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {selectedConversation.map((message) => {
                  const isOwnMessage = message.senderId === state.currentUser?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={setNewMessage}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    size="md"
                    icon={Send}
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  />
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Send size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};