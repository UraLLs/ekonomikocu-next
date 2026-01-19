import { getPostById } from "@/services/blogService";
import BlogForm from "../_components/BlogForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const post = await getPostById(id);

        if (!post) {
            notFound();
        }

        return <BlogForm post={post} />;
    } catch (error) {
        notFound();
    }
}
