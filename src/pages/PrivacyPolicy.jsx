import React from 'react';
import SectionTitle from '../components/SectionTitle';

const PrivacyPolicy = () => {
    const sections = [
        { id: "collect", title: "1. Information We Collect", content: "We collect information that you provide directly to us when you register a business, create an account, or contact us. This may include your name, email address, phone number, and business details." },
        { id: "use", title: "2. How We Use Your Information", content: "We use the information we collect to provide and maintain our services, to verify business listings, to communicate with you about your account, and to show your business to potential customers." },
        { id: "cookies", title: "3. Cookies Policy", content: "We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier." },
        { id: "sharing", title: "4. Data Sharing", content: "We do not sell your personal data to third parties. We may share your information with service providers who perform services for us, or when required by law to protect our rights or the safety of others." },
        { id: "security", title: "5. Data Security", content: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your personal information." },
        { id: "rights", title: "6. Your Rights", content: "You have the right to access, update, or delete the information we have on you. You can do this by contacting us at support@vanigan.org. We will respond to your request within a reasonable timeframe." },
        { id: "contact", title: "7. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at support@vanigan.org or visit us at 50, Surya Avenue Main Road, Kuruniji Nagar Ext, Chrompet, Chennai - 600044." }
    ];

    return (
        <main style={{ paddingTop: '120px', paddingBottom: '5rem' }}>
            <div className="container">
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
                    {/* Sidebar */}
                    <aside style={{ width: '300px', position: 'sticky', top: '120px', display: 'none' }} className="desktop-toc">
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>On This Page</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sections.map(s => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}>
                                        {s.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        <SectionTitle title="Privacy Policy" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }}>
                            {sections.map(s => (
                                <section key={s.id} id={s.id}>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>{s.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{s.content}</p>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        @media (min-width: 992px) {
          .desktop-toc { display: block !important; }
        }
      `}</style>
        </main>
    );
};

export default PrivacyPolicy;
