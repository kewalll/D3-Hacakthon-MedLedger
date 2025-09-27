import { useState, useEffect } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { account, contract } = useBlockchain();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        dob: "",
        addressDetails: "",
        contactNumber: "",
        allergies: "",
        weight: "",
        height: "",
        passcode: "",
    });

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            if (!contract || !account) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const userRole = await contract.getRole(account);
                if (isMounted) setRole(userRole);

                try {
                    const data = await contract.patients(account);
                    if (data.fullName && isMounted) {
                        setPatient({
                            fullName: data.fullName,
                            dob: data.dob,
                            addressDetails: data.addressDetails,
                            contactNumber: data.contactNumber,
                            allergies: data.allergies,
                            weight: Number(data.weight),
                            height: Number(data.height),
                        });
                    }
                } catch (error) {
                    console.error("Error fetching patient data:", error);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [contract, account]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegister = async () => {
        if (!account || !contract) {
            alert("Connect Wallet First!");
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const tx = await contract.registerPatient(
                formData.fullName,
                formData.dob,
                formData.addressDetails,
                formData.contactNumber,
                formData.allergies,
                Number(formData.weight) || 0,
                Number(formData.height) || 0,
                Number(formData.passcode)
            );
            await tx.wait();
            alert("Registration successful!");

            try {
                const data = await contract.patients(account);
                if (data.fullName) {
                    setPatient({
                        fullName: data.fullName,
                        dob: data.dob,
                        addressDetails: data.addressDetails,
                        contactNumber: data.contactNumber,
                        allergies: data.allergies,
                        weight: Number(data.weight),
                        height: Number(data.height),
                    });
                }
            } catch (error) {
                console.error("Error fetching updated patient data:", error);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            alert(`Registration failed: ${error.message || "Check console for errors"}`);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!formData.fullName || !formData.dob || !formData.contactNumber) {
            alert("Please fill in all required fields");
            return false;
        }

        if (formData.passcode.length !== 6 || isNaN(Number(formData.passcode))) {
            alert("Passcode must be a 6-digit number");
            return false;
        }

        return true;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
            {/* Background gradient to match the Home page */}
            {/* Decorative background dots */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full opacity-50"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-green-400 rounded-full opacity-50"></div>
            <div className="absolute bottom-40 left-30 w-2 h-2 bg-green-400 rounded-full opacity-50"></div>

            <div className="max-w-lg mx-auto bg-[#1A1A1A] rounded-lg overflow-hidden border border-[#2A2A2A] shadow-xl">
                {/* Adjusted background and border to match Home page card style */}
                <div className="bg-[#2A2A2A] px-6 py-4 border-b border-[#2A2A2A]">
                    <h2 className="text-2xl font-bold">Profile</h2>
                </div>

                <div className="px-6 py-4 border-b border-[#2A2A2A]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0">
                            <span className="font-medium text-sm text-gray-400">Wallet Address</span>
                            <p className="text-gray-300 truncate max-w-xs">
                                {account || "Not connected"}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-green-500 text-black rounded-full text-sm font-medium">
                            {role || "No Role"}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {patient ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b border-[#2A2A2A] pb-2">
                                Patient Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ProfileField label="Full Name" value={patient.fullName} />
                                <ProfileField label="Date of Birth" value={patient.dob} />
                                <ProfileField
                                    label="Contact Number"
                                    value={patient.contactNumber}
                                />
                                <ProfileField label="Address" value={patient.addressDetails} />
                                <ProfileField label="Weight" value={`${patient.weight} kg`} />
                                <ProfileField label="Height" value={`${patient.height} cm`} />
                            </div>

                            <div className="mt-4">
                                <h4 className="text-md font-medium text-gray-300">
                                    Medical Information
                                </h4>
                                <ProfileField
                                    label="Allergies"
                                    value={patient.allergies || "None"}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">
                                    Register as Patient
                                </h3>
                                <p className="text-gray-400">
                                    Please enter your details to complete registration
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        type="text"
                                        name="fullName"
                                        label="Full Name"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormInput
                                        type="date"
                                        name="dob"
                                        label="Date of Birth"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormInput
                                        type="text"
                                        name="contactNumber"
                                        label="Contact Number"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                    <FormInput
                                        type="text"
                                        name="addressDetails"
                                        label="Address"
                                        placeholder="123 Main St, City"
                                        value={formData.addressDetails}
                                        onChange={handleChange}
                                    />
                                    <FormInput
                                        type="number"
                                        name="weight"
                                        label="Weight (kg)"
                                        placeholder="70"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                    <FormInput
                                        type="number"
                                        name="height"
                                        label="Height (cm)"
                                        placeholder="175"
                                        value={formData.height}
                                        onChange={handleChange}
                                    />
                                </div>

                                <FormInput
                                    type="text"
                                    name="allergies"
                                    label="Allergies"
                                    placeholder="List any allergies or write 'None'"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                />

                                <FormInput
                                    type="password"
                                    name="passcode"
                                    label="6-digit Passcode"
                                    placeholder="Enter a 6-digit number"
                                    maxLength="6"
                                    value={formData.passcode}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    onClick={handleRegister}
                                    disabled={!account || !contract}
                                    className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-full transition-colors duration-200 font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {role === "Admin" && (
                    <div className="px-6 py-4 bg-[#2A2A2A] border-t border-[#2A2A2A]">
                        <button
                            onClick={() => navigate("/add-doctor")}
                            className="w-full bg-green-500 hover:bg-green-600 text-black py-2 rounded-full transition font-medium"
                        >
                            Add Doctor
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileField = ({ label, value }) => (
    <div className="mb-2">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <p className="text-gray-300">{value}</p>
    </div>
);

const FormInput = ({ label, type, name, placeholder, value, onChange, required, maxLength }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
            {label} {required && <span className="text-green-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className="w-full p-2 bg-[#2A2A2A] text-white border border-[#444] rounded-md focus:ring-green-500 focus:border-green-500 transition-colors"
        />
    </div>
);

export default Profile;