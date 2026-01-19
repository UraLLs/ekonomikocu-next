'use client';

import { deletePost } from "@/actions/blog";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeletePostButton({ postId }: { postId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
            startTransition(async () => {
                await deletePost(postId);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 hover:bg-accent-red/10 rounded-lg text-text-muted hover:text-accent-red transition-colors disabled:opacity-50"
            title="Sil"
        >
            {isPending ? (
                <span className="w-4 h-4 flex items-center justify-center text-xs">⌛</span>
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
