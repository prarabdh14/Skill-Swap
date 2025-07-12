import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, MessageSquare, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { SwapRequest, Rating } from '../../types';

export const SwapManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'active' | 'completed'>('pending');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const mySwaps = state.swapRequests.filter(request => 
    request.requesterId === state.currentUser?.id || request.receiverId === state.currentUser?.id
  );

  const pendingSwaps = mySwaps.filter(swap => swap.status === 'pending');
  const activeSwaps = mySwaps.filter(swap => swap.status === 'accepted');
  const completedSwaps = mySwaps.filter(swap => swap.status === 'completed');

  const getSwapTitle = (swap: SwapRequest) => {
    const isRequester = swap.requesterId === state.currentUser?.id;
    const otherUser = state.users.find(user => 
      user.id === (isRequester ? swap.receiverId : swap.requesterId)
    );
    return `${isRequester ? 'To' : 'From'} ${otherUser?.name || 'Unknown User'}`;
  };

  const getSwapDescription = (swap: SwapRequest) => {
    const isRequester = swap.requesterId === state.currentUser?.id;
    return isRequester 
      ? `${swap.requesterSkill.name} ↔ ${swap.receiverSkill.name}`
      : `${swap.receiverSkill.name} ↔ ${swap.requesterSkill.name}`;
  };

  const handleSwapAction = (swapId: string, action: 'accept' | 'reject' | 'complete' | 'cancel') => {
    const swap = state.swapRequests.find(s => s.id === swapId);
    if (!swap) return;

    let newStatus: SwapRequest['status'];
    switch (action) {
      case 'accept':
        newStatus = 'accepted';
        break;
      case 'reject':
      case 'cancel':
        newStatus = 'cancelled';
        break;
      case 'complete':
        newStatus = 'completed';
        setSelectedSwap(swap);
        setShowRatingModal(true);
        return;
      default:
        return;
    }

    const updatedSwap = { ...swap, status: newStatus, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: updatedSwap });
  };

  const submitRating = () => {
    if (!selectedSwap || !state.currentUser) return;

    const isRequester = selectedSwap.requesterId === state.currentUser.id;
    const ratedUserId = isRequester ? selectedSwap.receiverId : selectedSwap.requesterId;

    const newRating: Rating = {
      id: Date.now().toString(),
      swapId: selectedSwap.id,
      raterId: state.currentUser.id,
      ratedUserId,
      rating,
      feedback: feedback.trim() || undefined,
      createdAt: new Date()
    };

    // Update swap status to completed
    const updatedSwap = { ...selectedSwap, status: 'completed' as const, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: updatedSwap });
    dispatch({ type: 'ADD_RATING', payload: newRating });

    setShowRatingModal(false);
    setSelectedSwap(null);
    setRating(5);
    setFeedback('');
  };

  const getStatusColor = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'primary';
      case 'completed': return 'success';
      case 'cancelled':
      case 'rejected': return 'error';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return Calendar;
      case 'completed': return CheckCircle;
      case 'cancelled':
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const tabs = [
    { id: 'pending' as const, label: 'Pending', count: pendingSwaps.length },
    { id: 'active' as const, label: 'Active', count: activeSwaps.length },
    { id: 'completed' as const, label: 'Completed', count: completedSwaps.length }
  ];

  const getCurrentSwaps = () => {
    switch (selectedTab) {
      case 'pending': return pendingSwaps;
      case 'active': return activeSwaps;
      case 'completed': return completedSwaps;
      default: return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                  selectedTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Swap List */}
      <div className="space-y-4">
        {getCurrentSwaps().map((swap) => {
          const isRequester = swap.requesterId === state.currentUser?.id;
          const otherUser = state.users.find(user => 
            user.id === (isRequester ? swap.receiverId : swap.requesterId)
          );
          const StatusIcon = getStatusIcon(swap.status);

          return (
            <Card key={swap.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={otherUser?.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={otherUser?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {getSwapTitle(swap)}
                        </h3>
                        <Badge variant={getStatusColor(swap.status)} size="sm">
                          <StatusIcon size={12} className="mr-1" />
                          {swap.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400">
                        {getSwapDescription(swap)}
                      </p>
                      
                      {swap.message && (
                        <div className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <MessageSquare size={16} className="text-gray-400 mt-0.5" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {swap.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created {swap.createdAt.toLocaleDateString()}</span>
                        {swap.scheduledDate && (
                          <span>Scheduled for {swap.scheduledDate.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {swap.status === 'pending' && !isRequester && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSwapAction(swap.id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwapAction(swap.id, 'reject')}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    
                    {swap.status === 'pending' && isRequester && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSwapAction(swap.id, 'cancel')}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    {swap.status === 'accepted' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSwapAction(swap.id, 'complete')}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {getCurrentSwaps().length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Clock size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {selectedTab} swaps
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTab === 'pending' && "You don't have any pending swap requests."}
              {selectedTab === 'active' && "You don't have any active swaps."}
              {selectedTab === 'completed' && "You haven't completed any swaps yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="Rate Your Experience"
        size="md"
      >
        {selectedSwap && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How was your swap with{' '}
                {state.users.find(u => u.id === (selectedSwap.requesterId === state.currentUser?.id ? selectedSwap.receiverId : selectedSwap.requesterId))?.name}?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {getSwapDescription(selectedSwap)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="primary" onClick={submitRating} className="flex-1">
                Submit Rating
              </Button>
              <Button variant="outline" onClick={() => setShowRatingModal(false)}>
                Skip
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};