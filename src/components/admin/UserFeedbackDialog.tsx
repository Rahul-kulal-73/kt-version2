'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { IUser } from '@/models/User';
import { IFeedback } from '@/models/Feedback';

interface UserFeedbackDialogProps {
  user: IUser | null;
  open: boolean;
  onClose: () => void;
}

const sentimentEmojis: Record<string, string> = {
  'Proud': '🦚',
  'Emotional': '🥹',
  'Neutral': '😐',
  'Confused': '🤔',
  'Frustrated': '😤',
};

export function UserFeedbackDialog({ user, open, onClose }: UserFeedbackDialogProps) {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchFeedbacks();
    }
  }, [open, user]);

  const fetchFeedbacks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/feedback/${user._id}`);
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (error) {
      console.error("Failed to fetch feedback", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Feedback</DialogTitle>
          <DialogDescription>
            Feedback history for {user?.first_name} {user?.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b7c7c]"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center p-8 text-slate-500">
              No feedback found for this user.
            </div>
          ) : (
            <div className="h-[400px] overflow-y-auto pr-4 space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback._id.toString()} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sentimentEmojis[feedback.sentiment]}</span>
                      <Badge variant="outline" className="font-medium">
                        {feedback.sentiment}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {feedback.message && (
                    <p className="text-sm text-slate-700 mt-2 bg-white p-3 rounded border border-slate-100">
                      {feedback.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
