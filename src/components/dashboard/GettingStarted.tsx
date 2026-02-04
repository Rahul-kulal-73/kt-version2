import { Book, Lightbulb, Map } from 'lucide-react';

const GettingStarted = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Book className="h-5 w-5 text-amber-600" />
          Getting Started
        </h3>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                <Lightbulb className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">Quick Tip</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Start with yourself as the root person, then add parents and siblings one by one.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                <Map className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">Research Step</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ask elderly family members about their parents' names and birth places to fill gaps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
