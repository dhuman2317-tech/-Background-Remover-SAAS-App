import { plans } from "../assets/assets.jsx";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { placeOrder } from "../service/OrderService.js";

const BuyCredits = () => {
    const { isSignedIn, getToken } = useAuth();
    const { openSignIn } = useClerk();

    // FIX: was 'loadCredits' (undefined) — now correctly mapped via context alias
    const { loadCredits, backendUrl } = useContext(AppContext);

    // FIX: renamed to handleOrder (was handlerOrder) for consistency
    const handleOrder = async (planId) => {
        if (!isSignedIn) {
            return openSignIn();
        }
        placeOrder({
            planId,
            getToken,
            onSuccess: () => {
                loadCredits();
            },
            backendUrl,
        });
    };

    return (
        <div className="py-10 md:px-10 lg:px-20">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                        Choose your perfect plan
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                        Select from our carefully curated packages designed to meet your specific needs and budget
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative pt-6 p-6 bg-[#1A1A1A] hover:transform hover:-translate-y-2 transition-all duration-300 ${
                                plan.popular
                                    ? "backdrop-blur-lg rounded-2xl border border-purple-600"
                                    : "border border-gray-800 rounded-xl"
                            }`}
                        >
                            {/* FIX: onClick (not onCLick), handleOrder (not handleOrder) */}
                            {plan.popular && (
                                <div
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-4 py-1 text-sm font-semibold text-white cursor-pointer"
                                    onClick={() => handleOrder(plan.id)}
                                >
                                    Most Popular
                                </div>
                            )}

                            {/* FIX: Added actual card content */}
                            <div className="flex flex-col h-full">
                                <h3 className="text-white text-xl font-bold mb-1">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    <span className="text-white text-4xl font-extrabold">
                                        ₹{plan.price}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-1">/ one-time</span>
                                </div>

                                <div className="flex items-center gap-2 mb-8">
                                    <span className="text-purple-400 font-semibold text-lg">
                                        {plan.credits}
                                    </span>
                                    <span className="text-gray-400 text-sm">included</span>
                                </div>

                                <button
                                    onClick={() => handleOrder(plan.id)}
                                    className={`mt-auto w-full py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                                        plan.popular
                                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                                            : "bg-gray-700 hover:bg-gray-600 text-white"
                                    }`}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuyCredits;