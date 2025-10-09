// hooks/useFriendsActions.js - WITH COMPREHENSIVE DEBUG
import { useDispatch } from 'react-redux';
import { 
  setLoading, 
  setError, 
  setFriends, 
  setPendingIncoming, 
  setPendingOutgoing,
  addPendingOutgoing,
  removeFriend,
  acceptFriendRequest,
  removePendingIncoming,
  removePendingOutgoing,
  setFriendsInitialized
} from '../store/slices/friendsSlice';
import apiService from '../services/api.js';

export const useFriendsActions = () => {
  const dispatch = useDispatch();

  const fetchFriendsData = async () => {
    console.log('🚀 fetchFriendsData starting...');
    
    const token = localStorage.getItem("token");
    console.log('🔐 Token check:', {
      exists: !!token,
      length: token ? token.length : 0,
      preview: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    if (!token) {
      console.log('❌ No token found, clearing friends data');
      dispatch(setFriends([]));
      dispatch(setPendingIncoming([]));
      dispatch(setPendingOutgoing([]));
      return;
    }

    try {
      console.log('⏳ Setting loading to true');
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      console.log('📡 About to call apiService.getFriends()...');
      console.log('📡 API service object:', apiService);
      console.log('📡 getFriends method exists:', typeof apiService.getFriends);
      
      const friendsData = await apiService.getFriends();
      
      console.log('✅ Friends API response received:', {
        success: !!friendsData,
        type: typeof friendsData,
        keys: friendsData ? Object.keys(friendsData) : 'no keys',
        friendsCount: friendsData?.friends?.length || 0,
        incomingCount: friendsData?.incomingRequests?.length || 0,
        outgoingCount: friendsData?.outgoingRequests?.length || 0
      });
      
      console.log('📊 Full friends response:', friendsData);
      
      dispatch(setFriends(friendsData.friends || []));
      dispatch(setPendingIncoming(friendsData.incomingRequests || []));
      dispatch(setPendingOutgoing(friendsData.outgoingRequests || []));
      dispatch(setFriendsInitialized(true));
      
      console.log('✅ All dispatch calls completed successfully');
      
    } catch (error) {
      console.error('❌ fetchFriendsData error caught:');
      console.error('❌ Error object:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error name:', error.name);
      
      dispatch(setError("Backend unavailable - showing basic friends page"));
      dispatch(setFriends([]));
      dispatch(setPendingIncoming([]));
      dispatch(setPendingOutgoing([]));
    } finally {
      console.log('🏁 Setting loading to false (finally block)');
      dispatch(setLoading(false));
      console.log('🏁 fetchFriendsData completed');
    }
  };

  const sendFriendRequest = async (friendCode) => {
    console.log('📤 Sending friend request to:', friendCode);
    try {
      dispatch(setLoading(true));
      
      const response = await apiService.sendFriendRequest(friendCode);
      console.log('✅ Friend request response:', response);
      dispatch(addPendingOutgoing(response.request));
      
      return { success: true, message: "Friend request sent!" };
    } catch (error) {
      console.error("❌ Failed to send friend request:", error);
      return { 
        success: false, 
        error: error.message || "Failed to send request" 
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeFriendAction = async (friendId) => {
    console.log('🗑️ Removing friend:', friendId);
    try {
      await apiService.removeFriend(friendId);
      dispatch(removeFriend(friendId));
      console.log('✅ Friend removed successfully');
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to remove friend:", error);
      throw error;
    }
  };

  const acceptRequest = async (requestId) => {
    console.log('✅ Accepting friend request:', requestId);
    try {
      const response = await apiService.acceptFriendRequest(requestId);
      console.log('✅ Accept request response:', response);
      
      dispatch(acceptFriendRequest({
        requestId,
        friend: response.friend
      }));
      
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to accept friend request:", error);
      return { success: false, error: error.message };
    }
  };

  const declineRequest = async (requestId) => {
    console.log('❌ Declining friend request:', requestId);
    try {
      await apiService.declineFriendRequest(requestId);
      dispatch(removePendingIncoming(requestId));
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to decline friend request:", error);
      dispatch(removePendingIncoming(requestId));
      return { success: false, error: error.message };
    }
  };

  const cancelRequest = async (requestId) => {
    console.log('🚫 Canceling friend request:', requestId);
    try {
      await apiService.cancelFriendRequest(requestId);
      dispatch(removePendingOutgoing(requestId));
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to cancel friend request:", error);
      dispatch(removePendingOutgoing(requestId));
      return { success: false, error: error.message };
    }
  };

  return {
    fetchFriendsData,
    sendFriendRequest,
    removeFriendAction,
    acceptRequest,
    declineRequest,
    cancelRequest
  };
};
