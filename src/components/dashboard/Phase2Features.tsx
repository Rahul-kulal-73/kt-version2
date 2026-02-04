import {
  BookOpen,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const Phase2Features = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-50 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
        <h3 className="flex items-center gap-2.5 text-lg font-bold text-gray-900">
          <Sparkles className="h-5 w-5 text-[#64303A]" />
          New: Your Legacy Features
        </h3>
        <p className="text-sm text-gray-600 mt-1 font-medium">
          Transform your family tree into an emotional, story-driven legacy
        </p>
      </div>
      <div className="p-5 sm:p-6">
        <div className="space-y-3">
          <Link href="/story" className="block group">
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">AI Life Story</h4>
                    <ArrowRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Generate a beautiful narrative from your profile data. No invented facts, just your story.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/timeline" className="block group">
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">Timeline & Maps</h4>
                    <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Visualize your life&apos;s journey across time and places. See where you&apos;ve been.
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/profile" className="block group">
            <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#64303A]/30 hover:bg-[#64303A]/5 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-gray-500 group-hover:text-[#64303A] transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900">Complete Your Profile</h4>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#64303A] group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Add your details to unlock all features
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Phase2Features;
