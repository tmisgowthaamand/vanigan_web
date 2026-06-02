import React from 'react';
import PageHeader from '../components/PageHeader';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <main className="bg-[#1C1813] min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <PageHeader
                title="Contact Our Team"
                subtitle="We're here to support your business journey. Reach out to us for any queries or partnerships."
            />

            <section className="py-24">
                <div className="max-w-[1280px] mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20">
                        {/* Form Area */}
                        <div>
                            <h2 className="text-[32px] md:text-[40px] font-extrabold text-(--ks-champagne) tracking-[-0.01em] mb-12">Send us a message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-bold uppercase tracking-widest text-(--ks-text-muted)">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full bg-[#14110D] border border-(--ks-rule) rounded-xl p-4 text-[15px] font-medium text-(--ks-champagne) focus:bg-[#1C1813] focus:border-[#E87722]/50 outline-none transition-all placeholder:text-(--ks-text-faint)" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-bold uppercase tracking-widest text-(--ks-text-muted)">Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full bg-[#14110D] border border-(--ks-rule) rounded-xl p-4 text-[15px] font-medium text-(--ks-champagne) focus:bg-[#1C1813] focus:border-[#E87722]/50 outline-none transition-all placeholder:text-(--ks-text-faint)" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase tracking-widest text-(--ks-text-muted)">Subject</label>
                                    <input type="text" placeholder="How can we help?" className="w-full bg-[#14110D] border border-(--ks-rule) rounded-xl p-4 text-[15px] font-medium text-(--ks-champagne) focus:bg-[#1C1813] focus:border-[#E87722]/50 outline-none transition-all placeholder:text-(--ks-text-faint)" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold uppercase tracking-widest text-(--ks-text-muted)">Message</label>
                                    <textarea rows="6" placeholder="Your message here..." className="w-full bg-[#14110D] border border-(--ks-rule) rounded-xl p-4 text-[15px] font-medium text-(--ks-champagne) focus:bg-[#1C1813] focus:border-[#E87722]/50 outline-none transition-all placeholder:text-(--ks-text-faint)" />
                                </div>
                                <button className="w-full md:w-auto px-10 py-4 bg-[#E87722] text-white rounded-xl font-bold text-[15px] shadow-[0_10px_20px_rgba(232,119,34,0.2)] flex items-center justify-center gap-2 hover:bg-[#D36B1E] transition-all">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info Area */}
                        <div className="space-y-6">
                            <h2 className="text-[32px] md:text-[40px] font-extrabold text-(--ks-champagne) tracking-[-0.01em] mb-12">Contact Information</h2>

                            {[
                                { title: 'Our Office', icon: MapPin, text: '50, Surya Avenue Main Road, Kuruniji Nagar Ext, Chrompet, Chennai - 600044' },
                                { title: 'Call Us', icon: Phone, text: '+91 93601 92042' },
                                { title: 'Email Us', icon: Mail, text: 'support@vanigan.org' },
                                { title: 'Business Hours', icon: Clock, text: 'Mon - Sat: 9:00 AM - 6:00 PM' }
                            ].map((item, i) => (
                                <div key={i} className="bg-[#1C1813] p-8 rounded-[20px] border border-(--ks-rule) shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex gap-6 items-center hover:shadow-md transition-shadow">
                                    <div className="w-14 h-14 rounded-2xl bg-[#252019] text-[#E87722] flex items-center justify-center shrink-0">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-(--ks-champagne) text-[18px] mb-1">{item.title}</h4>
                                        <p className="text-(--ks-text-muted) text-[15px] font-medium leading-[1.6]">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="max-w-[1280px] mx-auto px-6 pb-24">
                <div className="aspect-[21/9] bg-[#14110D] rounded-[36px] overflow-hidden border border-(--ks-rule) shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative group">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.756247493208!2d80.1260481!3d12.9234191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525f0535e5d36b%3A0xe7f9b88a853e30f!2sChromepet%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1717056000000!5m2!1sen!2sin"
                        className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=50,+Surya+Avenue+Main+Road,+Kuruniji+Nagar+Ext,+Chrompet,+Chennai+-+600044"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-8 left-8 bg-[#1C1813] px-6 py-3 rounded-full flex items-center gap-2 shadow-lg border border-(--ks-rule) hover:bg-[#E87722] hover:text-white hover:border-[#E87722] transition-colors font-bold text-[13px] text-(--ks-champagne)"
                    >
                        Open in Maps <MapPin size={14} />
                    </a>
                </div>
            </section>
        </main>
    );
};

export default Contact;
