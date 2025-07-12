import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, SwapRequest, Rating, Message, Notification, AdminAnnouncement } from '../types';
import { authService, getAuthToken } from '../services';
import { userService } from '../services/userService';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'ADD_RATING'; payload: Rating }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_ANNOUNCEMENT'; payload: AdminAnnouncement }
  | { type: 'TOGGLE_ANNOUNCEMENT'; payload: string }
  | { type: 'BAN_USER'; payload: string }
  | { type: 'UNBAN_USER'; payload: string };

const initialState: AppState = {
  currentUser: null, // Start with no user logged in
  users: [],
  swapRequests: [],
  ratings: [],
  messages: [],
  notifications: [],
  announcements: [],
  theme: 'system'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
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
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        )
      };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
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

  // Check for existing auth token on app load
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Verify token and set current user
      authService.verifyToken()
                  .then(({ user }) => {
            dispatch({ type: 'SET_CURRENT_USER', payload: user });
            // Load all users for discovery
            userService.getUsers().then((users: User[]) => {
              dispatch({ type: 'SET_USERS', payload: users });
            }).catch(error => {
              console.error('Failed to load users:', error);
            });
          })
        .catch(() => {
          // Token is invalid, remove it
          authService.signOut();
        });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};