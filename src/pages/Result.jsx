import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const Result = () => {
    const { image, resultImage } = useContext(AppContext);
    const navigate = useNavigate();

    // FIX: image is a File object — browsers cannot use File as <img src> directly.
    // We must create an object URL and revoke it on unmount to avoid memory leaks.
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!image) return;
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);

        // Cleanup: revoke the URL when the component unmounts or image changes
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [image]);

    return (
        <div className="mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                    <p className="font-semibold text-gray-600 mb-2">Original</p>
                    <img
                        src={previewUrl || undefined}
                        alt="Original"
                        className="rounded-md w-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-gray-600 mb-2">Background Removed</p>
                    <div className="rounded-md border border-gray-300 h-full bg-layer relative overflow-hidden">
                        <img
                            src={resultImage ? resultImage : ""}
                            alt="Background removed"
                            className="w-full object-cover"
                        />
                        {!resultImage && image && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="border-4 border-indigo-600 rounded-full h-12 w-12 border-t-transparent animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {resultImage && (
                <div className="flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-10">
                    <button
                        className="px-8 py-2.5 text-indigo-600 text-sm border border-indigo-600 rounded-full hover:scale-105 transition-all duration-700"
                        onClick={() => navigate("/")}
                    >
                        Try another image
                    </button>
                    <a
                        href={resultImage}
                        download
                        className="px-8 py-2.5 text-white text-sm bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full cursor-pointer hover:scale-105 transition-all duration-700"
                    >
                        Download Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default Result;