import React from 'react';
import PageHeader from '../components/PageHeader';
import { Smartphone, ShieldCheck, Globe } from 'lucide-react';

const About = () => {
    return (
        <main className="bg-white">
            <PageHeader
                title="Empowering Local Commerce"
                subtitle="Vanigan is dedicated to building the digital future for local businesses in Tamil Nadu, fostering growth and connecting communities since 2012."
            />

            {/* AI Platform Section */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h4 className="text-primary text-xs font-black uppercase tracking-widest mb-4">India's Leading</h4>
                            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
                                India’s Leading <span className="text-primary italic">AI-Powered</span> Business Intelligence Platform
                            </h2>
                            <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-lg">
                                Vanigan directory based platform provides you with an AI based insights that will help you monitor and track your business.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { title: 'Multi-Platform Access', icon: Smartphone, desc: 'Install our app from play store for daily usage and quick checkouts.' },
                                    { title: 'Verified Business Intelligence', icon: ShieldCheck, desc: 'Check reviews and ratings from our experts before you contact any service providers.' },
                                    { title: 'Digital Visibility', icon: Globe, desc: 'Spread your business name around tamil nadu and get more views for your shop/services.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary shrink-0">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-50 rounded-[3rem] p-4 border border-slate-100 shadow-2xl">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
                                <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center italic text-slate-300">
                                    [App Screenshot Placeholder]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Core Values */}
            <section className="py-24 bg-slate-50/50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">Our Core Values</h2>
                        <p className="text-slate-500">The standards that guide our every step.</p>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Innovation', desc: 'We constantly strive to develop new solutions that help our local businesses grow in the digital age.' },
                            { title: 'Trust', desc: 'Authenticity is at our core. We ensure every listing meets our high standards of verification.' },
                            { title: 'Community', desc: 'Our platform is built by the community, for the community. Your growth is our growth.' }
                        ].map((val, i) => (
                            <div key={i} className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm text-center">
                                <h4 className="text-xl font-black text-slate-900 mb-4">{val.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The People Behind Vanigan */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">The People Behind Vanigan</h2>
                        <p className="text-slate-500">Driven leaders in technology and business development.</p>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { name: 'Sathish Kumar', role: 'CEO & Founder' },
                            { name: 'Priya Rajan', role: 'Chief Operating Officer' },
                            { name: 'Arun Vijay', role: 'Head of Marketing' },
                            { name: 'Meera Nair', role: 'Public Relations' }
                        ].map((person, i) => (
                            <div key={i} className="text-center">
                                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-300 italic font-bold">Photo</div>
                                <h4 className="font-black text-slate-900 mb-1">{person.name}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase">{person.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
