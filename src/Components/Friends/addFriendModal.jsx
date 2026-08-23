import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, Send, AlertCircle, User } from "lucide-react";

export default function AddFriendModal({ user, onClose, onSendFriendRequest }) {
  const [friendCode, setFriendCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [closing, setClosing] = useState(false);
  const modalRef = useRef(null);

  const myFriendCode = user?.username || "Set username in profile";

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 140);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalStyle;
    };
  }, [handleClose]);

  const copyFriendCode = async () => {
    if (!user?.username) {
      setMessage("Please set a username in your profile first");
      setMessageType("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(user.username);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setMessage("Failed to copy code to clipboard");
      setMessageType("error");
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!friendCode.trim()) {
      setMessage("Please enter a friend code");
      setMessageType("error");
      return;
    }

    if (friendCode.toLowerCase() === user?.username?.toLowerCase()) {
      setMessage("You can't add yourself as a friend!");
      setMessageType("error");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const result = await onSendFriendRequest(friendCode.trim());

      if (result.success) {
        setMessage(result.message || "Friend request sent successfully!");
        setMessageType("success");
        setFriendCode("");

        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setMessage(result.error || "Failed to send friend request");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Send friend request error:", error);
      setMessage("Failed to send friend request. Please try again.");
      setMessageType("error");
    } finally {
      setSending(false);
    }
  };

  return createPortal(
    <div className={`fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${closing ? "animate-backdrop-out" : "animate-backdrop-in"}`}>
      <div 
        ref={modalRef}
        className={`bg-background rounded-2xl shadow-2xl w-full max-w-md border border-primary/20 overflow-hidden ${closing ? "animate-modal-out" : "animate-modal-in"}`}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-accent/5 to-primary/15"></div>
          <div className="relative flex justify-between items-center p-5 border-b border-primary/10">
            <h3 className="text-base font-bold text-primary flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent text-invert shadow-md">
                <User size={16} />
              </div>
              <span>Add Friend</span>
            </h3>
            <button
              onClick={handleClose}
              className="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface rounded-lg"
              disabled={sending}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-primary mb-2.5 uppercase tracking-wider">
              Your Username
            </h4>
            <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-surface/50">
              <div className="flex-1 px-3 py-2 bg-background rounded-lg border border-surface/20">
                <code className="text-primary font-mono text-sm font-semibold">
                  {myFriendCode}
                </code>
              </div>
              <button
                onClick={copyFriendCode}
                className={`p-3 rounded-xl border transition-all hover:scale-[1.03] ${
                  user?.username
                    ? "bg-primary text-invert hover:opacity-95 border-primary shadow-sm"
                    : "bg-surface text-secondary border-surface/30 cursor-not-allowed"
                }`}
                title={
                  user?.username
                    ? "Copy your friend code"
                    : "Set username first"
                }
                disabled={!user?.username}
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-secondary/80 mt-2 font-medium">
              Share this with friends so they can add you.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary mb-2.5 uppercase tracking-wider">
              Add a Friend
            </h4>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div className="flex gap-2 bg-surface p-2 rounded-xl border border-surface/50 focus-within:border-primary/30 transition-all">
                <input
                  type="text"
                  placeholder="Enter friend's username"
                  value={friendCode}
                  onChange={(e) => {
                    setFriendCode(e.target.value);
                    setMessage("");
                  }}
                  className="flex-1 px-3 py-2 bg-background border border-surface/20 rounded-lg text-primary placeholder-secondary/70 focus:outline-none font-medium text-sm"
                  disabled={sending}
                  maxLength={20}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-primary text-invert rounded-xl hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-semibold text-sm"
                  disabled={!friendCode.trim() || sending}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-invert border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {!sending && <span>Send</span>}
                </button>
              </div>
              <p className="text-xs text-secondary/80 font-medium">
                Enter your friend's exact username to send them a friend request.
              </p>

              {message && (
                <div
                  className={`p-3.5 rounded-xl flex items-center gap-2.5 border animate-fade-in ${
                    messageType === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  <AlertCircle
                    size={16}
                    className="flex-shrink-0"
                  />
                  <p className="text-xs font-semibold leading-relaxed">
                    {message}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
