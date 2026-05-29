import React from 'react';
import SectionTitle from '../components/SectionTitle';

const TermsAndConditions = () => {
    const sections = [
        { id: "intro", title: "1. Introduction", content: "Welcome to Vanigan.org. By accessing our website, you agree to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Vanigan's relationship with you in relation to this website." },
        { id: "use", title: "2. Use of Service", content: "The content of the pages of this website is for your general information and use only. It is subject to change without notice. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense." },
        { id: "listings", title: "3. Business Listings Policy", content: "Businesses listed on Vanigan.org must provide accurate and verifiable information. We reserve the right to remove any listing that is found to be fraudulent, misleading, or in violation of our community guidelines without prior notice." },
        { id: "resposibility", title: "4. User Responsibilities", content: "As a user, you are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account or password." },
        { id: "property", title: "5. Intellectual Property", content: "This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice." },
        { id: "liability", title: "6. Limitation of Liability", content: "Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements." },
        { id: "changes", title: "7. Changes to Terms", content: "Vanigan.org reserves the right to revise these terms and conditions at any time. By using this website, you are expected to review these terms on a regular basis to ensure you understand all terms and conditions governing the use of this website." },
        { id: "contact", title: "8. Contact Information", content: "If you have any questions about these Terms and Conditions, please contact us at support@vanigan.org or visit us at 50, Surya Avenue Main Road, Kuruniji Nagar Ext, Chrompet, Chennai - 600044." }
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
                        <SectionTitle title="Terms and Conditions" />
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

export default TermsAndConditions;
