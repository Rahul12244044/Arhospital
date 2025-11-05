import React from 'react';
import {assets} from "../assets/allAssets";
import Footer from "../components/footer";
const Contact = () => {
    return (
        <div>
            <div className="text-center text-gray-400 text-2xl">
                <p>CONTACT <span className="text-gray-800 font-semibold">US</span></p>
            </div>
            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
                <img className="w-full md:max-w-[370px]" src={assets.contact_image} alt=""/>
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
                    <p className="text-gray-500">00000 Willms Station <br/> Suite 000, Washington, USA</p>
                    <p className="text-gray-500">Tel: (000) 000-0000 <br/> Email:rahuljajoria2412@gmail.com</p>
                    <p className="font-semibold text-lg text-gray-600">CAREERS AT ARhospital</p>
                    <p className="text-gray-500">Learn more about our teams and job openings.</p>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 cursor-pointer">Explore Jobs</button>
                </div>
                
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Emergency Contact</h3>
                        <p className="text-gray-600 mb-4">24/7 emergency services</p>
                        <p className="text-2xl font-bold text-green-600">(555) 911-HELP</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Opening Hours</h3>
                        <p className="text-gray-600 mb-2">Mon - Fri: 8:00 AM - 8:00 PM</p>
                        <p className="text-gray-600">Sat - Sun: 9:00 AM - 6:00 PM</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Online Support</h3>
                        <p className="text-gray-600 mb-4">Live chat available</p>
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                            Start Chat
                        </button>
                    </div>
                </div>
            <Footer/>
        </div>
    );
};

export default Contact;