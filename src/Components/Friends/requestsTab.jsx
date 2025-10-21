import { useState } from 'react';
import { Bell, Check, X, Clock, User } from 'lucide-react';

export default function RequestsTab({ 
    pendingIncoming, 
    pendingOutgoing, 
    onAcceptRequest, 
    onDeclineRequest, 
    onCancelRequest, 
    loading 
}) {
    const [imageErrors, setImageErrors] = useState({});
    const [processingRequest, setProcessingRequest] = useState(null);

    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        return googlePicture
            .replace("s96-c", "s200-c")
            .replace("=s96", "=s200")
            .replace("sz=50", "sz=200");
    };

    const handleImageError = (userId) => {
        setImageErrors(prev => ({ ...prev, [userId]: true }));
    };

    const handleAccept = async (requestId) => {
        setProcessingRequest(requestId);
        try {
            await onAcceptRequest(requestId);
        } catch (error) {
            console.error('Failed to accept request:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleDecline = async (requestId) => {
        setProcessingRequest(requestId);
        try {
            await onDeclineRequest(requestId);
        } catch (error) {
            console.error('Failed to decline request:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleCancel = async (requestId) => {
        setProcessingRequest(requestId);
        try {
            await onCancelRequest(requestId);
        } catch (error) {
            console.error('Failed to cancel request:', error);
        } finally {
            setProcessingRequest(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-surface rounded-lg p-6 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Loading requests...</p>
            </div>
        );
    }

    if (pendingIncoming.length === 0 && pendingOutgoing.length === 0) {
        return (
            <div className="bg-surface rounded-lg p-8 text-center">
                <Bell size={48} className="text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary mb-2">No Friend Requests</h3>
                <p className="text-secondary">When someone sends you a friend request, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Incoming Requests */}
            {pendingIncoming.length > 0 && (
                <div className="bg-surface rounded-lg">
                    <div className="p-6 border-b border-background">
                        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                            <Bell size={20} />
                            Incoming Requests ({pendingIncoming.length})
                        </h3>
                    </div>
                    
                    <div className="space-y-3 p-4">
                        {pendingIncoming.map((request) => {
                            const userId = request.from?.id || request.from?._id;
                            const hasImageError = imageErrors[userId];
                            const profilePicture = getHighResProfilePicture(request.from?.picture);
                            const isProcessing = processingRequest === request._id;

                            return (
                                <div key={request._id} className="bg-background rounded-lg p-4 hover:bg-background/80 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-surface">
                                                {profilePicture && !hasImageError ? (
                                                    <img 
                                                        src={profilePicture}
                                                        alt={request.from?.displayName || request.from?.name}
                                                        className="w-full h-full object-cover"
                                                        onError={() => handleImageError(userId)}
                                                        crossOrigin="anonymous"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                        <User size={20} className="text-primary/50" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <p className="font-medium text-primary">
                                                    {request.from?.displayName || request.from?.name}
                                                </p>
                                                <p className="text-sm text-secondary">
                                                    @{request.from?.username || 'no-username'}
                                                </p>
                                                <p className="text-xs text-secondary mt-1">
                                                    Sent {new Date(request.sentAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAccept(request._id)}
                                                disabled={isProcessing}
                                                className="flex items-center gap-1 px-3 py-2 bg-green-400 hover:bg-green-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isProcessing ? (
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Check size={14} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDecline(request._id)}
                                                disabled={isProcessing}
                                                className="flex items-center gap-1 px-3 py-2 bg-red-400 hover:bg-red-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Outgoing Requests */}
            {pendingOutgoing.length > 0 && (
                <div className="bg-surface rounded-lg">
                    <div className="p-6 border-b border-background">
                        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                            <Clock size={20} />
                            Sent Requests ({pendingOutgoing.length})
                        </h3>
                    </div>
                    
                    <div className="space-y-3 p-4">
                        {pendingOutgoing.map((request) => {
                            const userId = request.to?.id || request.to?._id;
                            const hasImageError = imageErrors[userId];
                            const profilePicture = getHighResProfilePicture(request.to?.picture);
                            const isProcessing = processingRequest === request._id;

                            return (
                                <div key={request._id} className="bg-background rounded-lg p-4 hover:bg-background/80 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-surface">
                                                {profilePicture && !hasImageError ? (
                                                    <img 
                                                        src={profilePicture}
                                                        alt={request.to?.displayName || request.to?.name}
                                                        className="w-full h-full object-cover"
                                                        onError={() => handleImageError(userId)}
                                                        crossOrigin="anonymous"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                        <User size={20} className="text-primary/50" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <p className="font-medium text-primary">
                                                    {request.to?.displayName || request.to?.name}
                                                </p>
                                                <p className="text-sm text-secondary">
                                                    @{request.to?.username || 'no-username'}
                                                </p>
                                                <p className="text-xs text-secondary mt-1">
                                                    Sent {new Date(request.sentAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleCancel(request._id)}
                                            disabled={isProcessing}
                                            className="flex items-center gap-1 px-3 py-2 bg-background hover:bg-red-500 text-white border border-surface rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {isProcessing ? (
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <X size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
