'use client';

import { Settings, Globe, Bell, Key, Shield, Save, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Ayarlar</h1>
                    <p className="text-text-secondary">Platform ayarlarını yönet</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${saved
                        ? 'bg-accent-green text-white'
                        : 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/20'
                        }`}
                >
                    {saved ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Kaydedildi
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Kaydet
                        </>
                    )}
                </button>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <SettingsSection
                        icon={Globe}
                        title="Genel Ayarlar"
                        description="Platform temel ayarları"
                    >
                        <SettingItem label="Site Adı">
                            <input
                                type="text"
                                defaultValue="Ekonomi Koçu"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50"
                            />
                        </SettingItem>
                        <SettingItem label="Site Açıklaması">
                            <textarea
                                rows={3}
                                defaultValue="Türkiye'nin Finansal Sosyal Platformu"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50 resize-none"
                            />
                        </SettingItem>
                        <SettingItem label="İletişim E-postası">
                            <input
                                type="email"
                                defaultValue="info@ekonomikocu.com"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50"
                            />
                        </SettingItem>
                    </SettingsSection>

                    {/* Notification Settings */}
                    <SettingsSection
                        icon={Bell}
                        title="Bildirim Ayarları"
                        description="E-posta ve push bildirimleri"
                    >
                        <ToggleSetting
                            label="Yeni Kullanıcı Bildirimi"
                            description="Yeni bir kullanıcı kayıt olduğunda e-posta al"
                            defaultChecked={true}
                        />
                        <ToggleSetting
                            label="Hata Bildirimleri"
                            description="Sistem hatalarında anında bildirim al"
                            defaultChecked={true}
                        />
                        <ToggleSetting
                            label="Haftalık Rapor"
                            description="Platform istatistiklerini haftalık olarak al"
                            defaultChecked={false}
                        />
                    </SettingsSection>

                    {/* API Settings */}
                    <SettingsSection
                        icon={Key}
                        title="API Ayarları"
                        description="Harici servis entegrasyonları"
                    >
                        <SettingItem label="Google API Key">
                            <input
                                type="password"
                                defaultValue="••••••••••••••••"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50"
                            />
                        </SettingItem>
                        <SettingItem label="Yahoo Finance API">
                            <input
                                type="password"
                                defaultValue="••••••••••••••••"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50"
                            />
                        </SettingItem>
                    </SettingsSection>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Security Section */}
                    <div className="bg-gradient-to-br from-accent-orange/10 to-transparent border border-accent-orange/20 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-accent-orange/20 text-accent-orange">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-white">Güvenlik</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-text-secondary hover:text-white transition-colors">
                                Şifre Değiştir
                            </button>
                            <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-text-secondary hover:text-white transition-colors">
                                İki Faktörlü Doğrulama
                            </button>
                            <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-text-secondary hover:text-white transition-colors">
                                Aktif Oturumlar
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-gradient-to-br from-accent-red/10 to-transparent border border-accent-red/20 rounded-2xl p-5">
                        <h3 className="font-bold text-accent-red mb-4">Tehlikeli Bölge</h3>
                        <p className="text-sm text-text-muted mb-4">
                            Bu işlemler geri alınamaz. Dikkatli olun.
                        </p>
                        <button className="w-full py-2.5 bg-accent-red/20 hover:bg-accent-red/30 text-accent-red font-medium rounded-xl transition-colors text-sm">
                            Cache Temizle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsSection({ icon: Icon, title, description, children }: any) {
    return (
        <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-text-muted">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="text-xs text-text-muted">{description}</p>
                </div>
            </div>
            <div className="p-5 space-y-5">
                {children}
            </div>
        </div>
    );
}

function SettingItem({ label, children }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
            {children}
        </div>
    );
}

function ToggleSetting({ label, description, defaultChecked }: any) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl">
            <div>
                <div className="font-medium text-white text-sm">{label}</div>
                <div className="text-xs text-text-muted">{description}</div>
            </div>
            <button
                onClick={() => setChecked(!checked)}
                className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-brand-primary' : 'bg-white/10'
                    }`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'left-7' : 'left-1'
                    }`} />
            </button>
        </div>
    );
}
