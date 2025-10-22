
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import AddFriendModal from './addFriendModal.jsx';

export default function FriendsHeader({ user, onSendFriendRequest, loading }) {
    const [showAddFriend, setShowAddFriend] = useState(false);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-primary">Friends & Leaderboard</h1>
                <button
                    onClick={() => setShowAddFriend(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <UserPlus size={18} />
                    Add
                </button>
            </div>

            {showAddFriend && (
                <AddFriendModal 
                    user={user}
                    onClose={() => setShowAddFriend(false)}
                    onSendFriendRequest={onSendFriendRequest}
                />
            )}
        </>
    );
}
