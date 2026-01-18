import { STREAM_SCHEDULE } from "@/data/live";
import { CalendarIcon, ClockIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Schedule() {
    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green border border-accent-green/20">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-100">Yayın Akışı</h3>
                        <p className="text-xs text-gray-500">Bu haftanın programı</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-accent-green hover:bg-accent-green/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-accent-green/30">
                    Tümünü Gör
                </button>
            </div>

            <div className="p-2 space-y-2">
                {STREAM_SCHEDULE.map((item, index) => (
                    <div key={index} className="group flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden">

                        {/* Time Column */}
                        <div className="flex flex-col items-center justify-center w-16 h-14 bg-white/5 rounded-lg border border-white/5 shrink-0 group-hover:bg-accent-blue/10 group-hover:border-accent-blue/30 transition-colors">
                            <span className="text-xs font-bold text-gray-400 group-hover:text-accent-blue">{item.day.slice(0, 3)}</span>
                            <span className="text-sm font-black text-gray-200">{item.time.split(':')[0]}:{item.time.split(':')[1]}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-bold text-gray-200 truncate group-hover:text-accent-blue transition-colors">
                                    {item.title}
                                </h4>
                                {index === 0 && (
                                    <span className="px-1.5 py-0.5 bg-accent-red/20 text-accent-red text-[9px] font-bold rounded uppercase border border-accent-red/20">
                                        Sonraki
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-accent-blue transition-colors"></span>
                                    {item.host}
                                </span>
                            </div>
                        </div>

                        {/* Action */}
                        <button className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                            <BellIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
