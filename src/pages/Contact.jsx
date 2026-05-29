import React from 'react';
import PageHeader from '../components/PageHeader';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <main className="bg-white min-h-screen">
            <PageHeader
                title="Contact Our Team"
                subtitle="We're here to support your business journey. Reach out to us for any queries or partnerships."
            />

            <section className="py-24">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-20">
                        {/* Form Area */}
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 mb-12">Send us a message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:border-primary transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:border-primary transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Subject</label>
                                    <input type="text" placeholder="How can we help?" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:border-primary transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Message</label>
                                    <textarea rows="6" placeholder="Your message here..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold focus:bg-white focus:border-primary transition-all" />
                                </div>
                                <button className="w-full md:w-auto px-10 py-4 bg-[#FF3D4D] text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-[#E63946] transition-all">
                                    🚀 Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info Area matching screenshot */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-900 mb-12">Contact Information</h2>

                            {[
                                { title: 'Our Office', icon: MapPin, text: '50, Surya Avenue Main Road, Kuruniji Nagar Ext, Chrompet, Chennai - 600044', color: 'bg-red-50 text-red-500' },
                                { title: 'Call Us', icon: Phone, text: '+91 93601 92042', color: 'bg-rose-50 text-rose-500' },
                                { title: 'Email Us', icon: Mail, text: 'support@vanigan.org', color: 'bg-pink-50 text-pink-500' },
                                { title: 'Business Hours', icon: Clock, text: 'Mon - Sat: 9:00 AM - 6:00 PM', color: 'bg-orange-50 text-orange-500' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex gap-6 items-center">
                                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-slate-400 text-sm font-bold">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section matching screenshot placeholder */}
            <section className="container-custom pb-24">
                <div className="aspect-[21/9] bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-xl relative group">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center italic text-slate-300 font-bold">
                        Interactive Google Map Placeholder
                    </div>
                    <div className="absolute top-8 left-8 bg-white px-6 py-3 rounded-xl shadow-lg border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all cursor-pointer">
                        <p className="font-black text-sm">Open in Maps ↗</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
