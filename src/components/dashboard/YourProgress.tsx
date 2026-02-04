import { Clock, Users, Crown, AlertCircle } from 'lucide-react';

interface YourProgressProps {
  familyMembersCount: number;
  user: any;
}

const YourProgress = ({ familyMembersCount, user }: YourProgressProps) => {
  const limit = user?.tree_limit || 100;
  const remaining = Math.max(0, limit - familyMembersCount);
  const percentage = Math.min(100, (familyMembersCount / limit) * 100);

  const isNearLimit = percentage > 80;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5 sm:p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
          <Clock className="h-5 w-5 text-[#64303A]" />
          Tree Progress
        </h3>
        {user?.plan_type !== 'pro' && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
            Free Plan
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Storage Used</span>
            <span className={`${isNearLimit ? 'text-amber-600' : 'text-gray-500'}`}>
              {Math.round(percentage)}%
            </span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isNearLimit ? 'bg-amber-500' : 'bg-[#64303A]'
                }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-[#64303A]/5 transition-colors">
            <Users className="h-5 w-5 text-gray-400 group-hover:text-[#64303A] mb-2 transition-colors" />
            <div className="text-xl font-bold text-gray-900">{familyMembersCount}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">Members</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-[#64303A]/5 transition-colors">
            <Crown className="h-5 w-5 text-gray-400 group-hover:text-[#64303A] mb-2 transition-colors" />
            <div className="text-xl font-bold text-gray-900">{limit}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">Total Limit</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center group hover:bg-amber-50 transition-colors">
            <AlertCircle className="h-5 w-5 text-gray-400 group-hover:text-amber-500 mb-2 transition-colors" />
            <div className="text-xl font-bold text-gray-900">{remaining}</div>
            <div className="text-xs font-medium text-gray-500 mt-1">Remaining</div>
          </div>
        </div>

        {isNearLimit && user?.plan_type !== 'pro' && (
          <div className="flex items-center gap-3 p-3 text-sm bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
            <div className="shrink-0 p-1.5 bg-amber-100 rounded-full">
              <Crown className="h-3.5 w-3.5 text-amber-700" />
            </div>
            <p className="font-medium">
              Running out of space? Upgrade to Pro for unlimited members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourProgress;