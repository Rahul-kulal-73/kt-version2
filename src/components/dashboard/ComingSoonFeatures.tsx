import {
  Camera,
  Search,
  Calendar,
  Book,
  Sparkles,
} from 'lucide-react';

const ComingSoonFeatures = () => {
  const features = [
    { icon: Camera, label: 'Photo Albums', desc: 'Securely store memories' },
    { icon: Search, label: 'Records Search', desc: 'Find ancestors' },
    { icon: Calendar, label: 'Cultural Events', desc: 'Family celebrations' },
    { icon: Book, label: 'AI Stories', desc: 'Generate narratives' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Sparkles className="h-5 w-5 text-[#64303A]" />
          Coming Soon
        </h3>
        <p className="text-sm text-gray-500 mt-1 font-medium">New features on the horizon</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#64303A]/5 group-hover:bg-[#64303A]/10 transition-colors">
                <feature.icon className="h-5 w-5 text-[#64303A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{feature.label}</p>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
              <span className="shrink-0 px-2 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonFeatures;
