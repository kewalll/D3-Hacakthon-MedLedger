import { useState, useEffect } from "react";
import ConnectWallet from "../components/ConnectWallet";
import { Shield, Lock, Database, Cloud, ServerOff, Server, ChevronDown, ExternalLink } from "lucide-react";

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(null);

    useEffect(() => {
        setIsVisible(true);

        // For animated background
        const interval = setInterval(() => {
            const bg = document.querySelector('.animated-bg');
            if (bg) {
                const currentHue = parseInt(getComputedStyle(bg).getPropertyValue('--hue') || '240');
                bg.style.setProperty('--hue', `${(currentHue + 1) % 360}`);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const cloudPartners = [
        {
            name: "Amazon Web Services",
            icon: <Server size={20} className="mr-2 text-orange-400" />,
            alt: "AWS Logo"
        },
        {
            name: "Microsoft Azure",
            icon: <Cloud size={20} className="mr-2 text-blue-400" />,
            alt: "Azure Logo"
        },
        {
            name: "Google Cloud Platform",
            icon: <ServerOff size={20} className="mr-2 text-yellow-400" />,
            alt: "GCP Logo"
        }
    ];

    const scrollToFeatures = () => {
        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background gradient */}
            <div className="fixed inset-0 animated-bg opacity-10"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, hsl(var(--hue), 100%, 60%), transparent 80%)',
                    transition: 'all 0.5s ease',
                    '--hue': '240'
                }}></div>

            {/* Floating particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${Math.random() * 10 + 2}px`,
                            height: `${Math.random() * 10 + 2}px`,
                            background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, ${Math.random() * 155 + 100}, 0.7)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 15 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-3 py-10 relative z-10">
                {/* Hero Section */}
                <div className={`max-w-4xl mx-auto text-center relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="absolute inset-0 -z-10 opacity-20">
                    </div>

                    {/* Glowing accent */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-3 relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-500 animate-gradient-x">
                            Empowering Hospitals
                        </span> with Next-Gen<br />
                        Blockchain-Based Medical Records.
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                        Revolutionizing Healthcare Data Security with Uncompromising Privacy and Control.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 ">
                        <ConnectWallet />
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="max-w-5xl mx-auto mt-10 ">
                    <h3 className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-cyan-500">
                        Key Security Features
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Lock size={24} className="transition-all duration-300" />,
                                title: "End-to-End Encryption",
                                description: "Military-grade encryption for all patient data with zero-knowledge architecture.",
                                color: "from-blue-400 to-indigo-600"
                            },
                            {
                                icon: <Database size={24} className="transition-all duration-300" />,
                                title: "Immutable Records",
                                description: "Tamper-proof medical records with cryptographic verification and audit trails.",
                                color: "from-green-400 to-emerald-600"
                            },
                            {
                                icon: <Shield size={24} className="transition-all duration-300" />,
                                title: "HIPAA Compliant",
                                description: "Built from the ground up to exceed healthcare regulatory requirements.",
                                color: "from-purple-400 to-indigo-600"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="relative bg-gray-900 bg-opacity-70 backdrop-blur-sm p-5 rounded-xl border border-gray-800 transition-all duration-500 group hover:border-green-400 hover:shadow-lg"
                                onMouseEnter={() => setActiveFeature(index)}
                                onMouseLeave={() => setActiveFeature(null)}
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                    animation: 'fadeSlideUp 0.6s ease-out forwards',
                                    opacity: 0,
                                    transform: 'translateY(20px)'
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 rounded-xl transition-opacity duration-500 ${activeFeature === index ? 'opacity-5' : ''}`}></div>
                                <div className={`text-green-400 mb-3 p-2 rounded-lg inline-block bg-gray-800 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-gray-700`}>
                                    {feature.icon}
                                </div>
                                <h4 className="text-lg font-semibold mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 group-hover:w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800/50 mt-16 py-4 backdrop-blur-sm">
                <div className="container mx-auto px-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Shield className="text-green-400 mr-2" size={20} />
                            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-400">MedLedger</span>
                        </div>
                        <div className="text-gray-500 text-xs">
                            © 2025 MedLedger. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Add keyframe animations */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                    100% { transform: translateY(0) rotate(360deg); }
                }
                
                @keyframes fadeSlideUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes animate-gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: animate-gradient-x 15s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Home;