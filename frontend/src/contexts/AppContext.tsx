import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, SwapRequest, Rating, Message, AdminAnnouncement } from '../types';
import { mockUsers, mockSwapRequests, mockRatings, mockMessages, mockAnnouncements } from '../data/mockData';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'ADD_RATING'; payload: Rating }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'ADD_ANNOUNCEMENT'; payload: AdminAnnouncement }
  | { type: 'TOGGLE_ANNOUNCEMENT'; payload: string }
  | { type: 'BAN_USER'; payload: string }
  | { type: 'UNBAN_USER'; payload: string };

const initialState: AppState = {
  currentUser: mockUsers[0], // Demo user
  users: mockUsers,
  swapRequests: mockSwapRequests,
  ratings: mockRatings,
  messages: mockMessages,
  announcements: mockAnnouncements,
  theme: 'system'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    
    case 'ADD_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: [...state.swapRequests, action.payload]
      };
    
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        )
      };
    
    case 'ADD_RATING':
      return {
        ...state,
        ratings: [...state.ratings, action.payload]
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case 'MARK_MESSAGE_READ':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload ? { ...message, isRead: true } : message
        )
      };
    
    case 'ADD_ANNOUNCEMENT':
      return {
        ...state,
        announcements: [...state.announcements, action.payload]
      };
    
    case 'TOGGLE_ANNOUNCEMENT':
      return {
        ...state,
        announcements: state.announcements.map(announcement =>
          announcement.id === action.payload 
            ? { ...announcement, isActive: !announcement.isActive }
            : announcement
        )
      };
    
    case 'BAN_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload ? { ...user, isBanned: true } : user
        )
      };
    
    case 'UNBAN_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload ? { ...user, isBanned: false } : user
        )
      };
    
    default:
      return state;
  }
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};