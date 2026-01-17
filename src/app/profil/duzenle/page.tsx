import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default async function ProfileEditPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/giris');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-2xl mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Profili Düzenle</h1>
                    <p className="text-text-secondary">Hesap bilgilerinizi ve görünümünüzü güncelleyin.</p>
                </div>

                <ProfileEditForm user={user} profile={profile || {}} />
            </div>

            <Footer />
        </main>
    );
}
