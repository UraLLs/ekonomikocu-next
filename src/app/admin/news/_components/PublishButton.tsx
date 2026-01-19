'use client';

import { publishNewsWithAI } from "@/actions/news";
import { Sparkles, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PublishButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handlePublish = () => {
        startTransition(async () => {
            try {
                await publishNewsWithAI(id);
                // Success - Router refresh will update the UI via revalidatePath
            } catch (error) {
                alert("Yayınlama başarısız oldu.");
            }
        });
    };

    return (
        <button
            onClick={handlePublish}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            title="Yapay Zeka ile İşleyip Yayınla"
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <Sparkles className="w-3.5 h-3.5" />
            )}
            {isPending ? "İşleniyor..." : "AI ile Yayınla"}
        </button>
    );
}
