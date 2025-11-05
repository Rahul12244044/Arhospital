import React from 'react';
import { assets } from "../assets/allAssets";
import Footer from "../components/footer";

const About = () => {
    const features = [
        {
            icon: "⚡",
            title: "EFFICIENCY",
            description: "Streamlined appointment scheduling that fits into your busy lifestyle with minimal wait times.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: "🕒",
            title: "CONVENIENCE",
            description: "Access to a network of trusted healthcare professionals in your area, available 24/7.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: "🎯",
            title: "PERSONALIZATION",
            description: "Tailored recommendations and reminders to help you stay on top of your health goals.",
            color: "from-purple-500 to-pink-500"
        }
    ];

    const stats = [
        { number: "10K+", label: "Patients Served" },
        { number: "500+", label: "Expert Doctors" },
        { number: "50+", label: "Specialities" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            

            {/* Mission Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Image */}
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <img 
                                    className="w-full rounded-2xl shadow-lg"
                                    src={assets.about_image} 
                                    alt="Prescripto Healthcare Team"
                                />
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500 rounded-2xl rotate-12 opacity-90"></div>
                                <div className="absolute -top-6 -left-6 w-20 h-20 bg-green-400 rounded-2xl -rotate-12 opacity-80"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:w-1/2">
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                        Welcome to Prescripto
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                        Your trusted partner in managing healthcare needs conveniently and efficiently. 
                                        We understand the challenges individuals face when scheduling doctor appointments 
                                        and managing health records in today's fast-paced world.
                                    </p>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Prescripto is committed to excellence in healthcare technology. We continuously 
                                        strive to enhance our platform, integrating the latest advancements to improve 
                                        user experience and deliver superior service.
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                                                {stat.number}
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            
            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose <span className="text-blue-600">Prescripto</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience healthcare that's designed around your needs and schedule
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                
                                {/* Icon */}
                                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    {feature.icon}
                                </div>
                                
                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {feature.description}
                                </p>
                                
                                {/* Hover Border Effect */}
                                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            
            <Footer />
        </div>
    );
};

export default About;