import React from 'react';
import {assets} from "../assets/allAssets";
const Footer = () => {
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-9 mt-40 text-sm">
                <div>
                <span className="ml-2 font-bold text-2xl text-blue-900">
                  ARHospital
                </span>
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">
                       AR Hospital is committed to delivering quality healthcare with compassion and technology. Our team of expert doctors, advanced facilities, and patient-first approach ensure trusted care for every individual, every time.
                    </p>

                </div>
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Private Policy</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>7986836479</li>
                        <li>rahuljajoria2412@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr/>
                <p className="py-5 text-center text-sm">Copyright 2025 @ RahulRadha.dev - All Right Reserved.</p>
            </div>
        </div>
    );
};

export default Footer;