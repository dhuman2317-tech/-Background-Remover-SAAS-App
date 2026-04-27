import { useState } from "react";
import { assets, categories } from "../assets/assets.jsx";

const BgSlider = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [activeCategory, setCategory] = useState("People");

    const handleSliderChange = (e) => {
        setSliderPosition(Number(e.target.value));
    };

    return (
        <div className="mb-16 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Stunning quality.
            </h2>

            {/* Category Selector */}
            <div className="flex justify-center mb-10 flex-wrap">
                <div className="inline-flex gap-4 bg-gray-100 p-2 rounded-full flex-wrap justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${
                                activeCategory === category
                                    ? "bg-white text-gray-800 shadow-sm"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image comparison slider */}
            <div className="relative w-full max-w-4xl overflow-hidden m-auto rounded-xl shadow-lg">
                <img
                    src={assets.people_org}
                    alt="original image"
                    className="w-full h-full"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                />
                <img
                    src={assets.people}
                    alt="removed background image"
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={handleSliderChange}
                    className="absolute top-1/2 left-0 w-full opacity-0 cursor-ew-resize h-full"
                    style={{ transform: "translateY(-50%)" }}
                />
            </div>
        </div>
    );
};

export default BgSlider;