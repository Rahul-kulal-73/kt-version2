import {
  Users,
  Plus,
  BookOpen,
  MapPin,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
  familyTree: any;
}

const QuickActions = ({ familyTree }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Link href={familyTree ? `/tree/${familyTree.id}` : "#"} className="group block">
        <button
          className="w-full h-full p-6 text-left rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden"
          disabled={!familyTree}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-24 w-24 text-[#64303A]" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="p-3 bg-rose-50 rounded-xl w-fit">
              <Plus className="h-6 w-6 text-[#64303A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Add Member</h3>
              <p className="text-sm text-gray-500 font-medium">Grow your family tree</p>
            </div>
          </div>
        </button>
      </Link>

      <Link href="/story" className="group block">
        <button className="w-full h-full p-6 text-left rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <BookOpen className="h-24 w-24 text-white" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl w-fit">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">My Story</h3>
              <p className="text-sm text-blue-100 font-medium">Record your journey</p>
            </div>
          </div>
        </button>
      </Link>

      <Link href="/timeline" className="group block">
        <button className="w-full h-full p-6 text-left rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MapPin className="h-24 w-24 text-emerald-600" />
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl w-fit">
              <MapPin className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Timeline</h3>
              <p className="text-sm text-gray-500 font-medium">View family history</p>
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
};

export default QuickActions;
