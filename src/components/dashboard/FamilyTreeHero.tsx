import {
  TreePine,
  Star,
  Plus,
  ArrowRight,
  GitFork,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

import { calculateGenerations } from '@/utils/treeUtils';

interface FamilyTreeHeroProps {
  familyTree: any;
  familyMembers: any[];
  relationships: any[];
  loading: boolean;
  onCreateTree: () => void;
}

const FamilyTreeHero = ({ familyTree, familyMembers, relationships, loading, onCreateTree }: FamilyTreeHeroProps) => {
  const generationCount = calculateGenerations(familyMembers, relationships || []);
  if (loading) {
    return (
      <div className="w-full h-64 rounded-2xl bg-gray-100 animate-pulse border border-gray-200" />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#64303A] text-white shadow-lg">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative p-6 sm:p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium border border-white/20">
              <Star className="h-3 w-3 text-amber-300" />
              <span>Primary Family Tree</span>
            </div>

            <div>
              {familyTree ? (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                    {familyTree.name}
                  </h2>
                  <p className="text-blue-100 text-lg opacity-90 max-w-lg">
                    {familyTree.description || 'Explore and grow your family heritage through generations.'}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
                    Start Your Journey
                  </h2>
                  <p className="text-blue-100 text-lg opacity-90">
                    Create your first family tree and begin preserving your history today.
                  </p>
                </>
              )}
            </div>

            {familyTree && (
              <div className="flex flex-wrap gap-4 sm:gap-8 pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <TreePine className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{familyMembers.length}</div>
                    <div className="text-xs text-blue-200 font-medium">Members</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <GitFork className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{generationCount}</div>
                    <div className="text-xs text-blue-200 font-medium">Generations</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{new Date().getFullYear()}</div>
                    <div className="text-xs text-blue-200 font-medium">Last Updated</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            {familyTree ? (
              <Link href={`/tree/${familyTree.id}`} className="w-full">
                <button className="group w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#64303A] rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                  View Tree
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <button
                onClick={onCreateTree}
                disabled={loading}
                className="group w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#64303A] rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                Create Tree
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeHero;
