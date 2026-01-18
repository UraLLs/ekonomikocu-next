import { STREAM_SCHEDULE } from "@/data/live";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function Schedule() {
    return (
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-bg-elevated/50 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent-green" />
                <h3 className="font-bold text-lg text-text-primary">Haftalık Yayın Akışı</h3>
            </div>
            <div className="divide-y divide-border-subtle">
                {STREAM_SCHEDULE.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-bg-surface-hover transition-colors group">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8 flex-1">
                            <div className="w-24 font-bold text-accent-blue">{item.day}</div>
                            <div className="flex-1">
                                <div className="font-medium text-text-primary group-hover:text-accent-green transition-colors">{item.title}</div>
                                <div className="text-xs text-text-muted">{item.host}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-mono text-text-secondary bg-bg-elevated px-2 py-1 rounded">
                            <ClockIcon className="w-4 h-4" />
                            {item.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
