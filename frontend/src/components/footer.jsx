import React from 'react';
import { assets } from "../assets/allAssets";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const companyLinks = [
        { name: "About Us", href: "/about" },
        { name: "Our Services", href: "/services" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" }
    ];

    const supportLinks = [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" }
    ];

    const contactInfo = [
        { 
            type: "phone", 
            value: "+1 (555) 123-4567", 
            href: "tel:+15551234567",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            )
        },
        { 
            type: "email", 
            value: "hello@arhospital.com", 
            href: "mailto:hello@arhospital.com",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        { 
            type: "address", 
            value: "123 Healthcare Ave, Medical City, MC 12345", 
            href: "https://maps.google.com",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ];

    const socialLinks = [
        {
            name: "Facebook",
            href: "https://facebook.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            )
        },
        {
            name: "Twitter",
            href: "https://twitter.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184A4.92 4.92 0 0011.9 8.034a13.98 13.98 0 01-10.17-5.144 4.929 4.929 0 001.523 6.57 4.903 4.903 0 01-2.23-.614v.062a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.6 3.42 9.868 9.868 0 01-6.102 2.105c-.39 0-.78-.023-1.17-.067a13.99 13.99 0 007.557 2.213c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543l-.047-.02z"/>
                </svg>
            )
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            )
        },
        {
            name: "Instagram",
            href: "https://instagram.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.865 3.75 13.714 3.75 12.417s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
                </svg>
            )
        }
    ];

    return (
        <footer className="bg-white border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">AR</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                ARHospital
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            AR Hospital is committed to delivering quality healthcare with compassion and technology. 
                            Our team of expert doctors, advanced facilities, and patient-first approach ensure 
                            trusted care for every individual, every time.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors duration-200 group"
                                    aria-label={social.name}
                                >
                                    <div className="text-gray-500 group-hover:text-white transition-colors duration-200">
                                        {social.icon}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Support</h3>
                        <ul className="space-y-3">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Get In Touch</h3>
                        <ul className="space-y-4">
                            {contactInfo.map((contact, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5">
                                        {contact.icon}
                                    </div>
                                    <a 
                                        href={contact.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm leading-relaxed"
                                    >
                                        {contact.value}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Emergency Notice */}
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700 font-medium">
                                🚨 Emergency: Available 24/7
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Immediate medical assistance when you need it most
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {currentYear} AR Hospital. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span>Committed to Your Health</span>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>JCI Accredited</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;