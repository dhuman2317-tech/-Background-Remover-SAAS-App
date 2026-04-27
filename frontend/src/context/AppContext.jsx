import { createContext, useState } from "react";
import axios from "axios";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [credits, setCredits] = useState(0);
    const { getToken } = useAuth();
    const [image, setImage] = useState(false);
    const [resultImage, setResultImage] = useState(false);

    // FIX: use useAuth for isSignedIn (consistent with rest of app)
    const { isSignedIn } = useAuth();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();

    // FIX: renamed to loadUserCredits and also exposed as loadCredits alias below
    const loadUserCredits = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(backendUrl + "/api/users/credits", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setCredits(response.data.data.credits);
            } else {
                toast.error(response.data.data);
            }
        } catch (error) {
            toast.error("Error loading credits");
        }
    };

    const removeBg = async (selectedImage) => {
        try {
            if (!isSignedIn) {
                return openSignIn();
            }
            setImage(selectedImage);
            setResultImage(false);
            navigate("/result");

            const token = await getToken();
            const formData = new FormData();
            selectedImage && formData.append("file", selectedImage);

            const { data: base64Image } = await axios.post(
                backendUrl + "/api/images/remove-background",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResultImage(`data:image/png;base64,${base64Image}`);
            setCredits((prev) => prev - 1);
        } catch (error) {
            console.log(error);
            toast.error("Error while removing background image.");
        }
    };

    const contextValue = {
        credits,
        setCredits,
        image,
        setImage,
        resultImage,
        setResultImage,
        backendUrl,
        loadUserCredits,
        loadCredits: loadUserCredits, // FIX: alias so BuyCredits/Pricing don't break
        removeBg,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;