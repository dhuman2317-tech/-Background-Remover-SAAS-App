import logo from "./logo.png";
import video_banner from "./home-page-banner.mp4";
import people from "./people.png";
import people_org from "./people-org.png";
import credits from "./credits.png";

export const assets = {
    logo,
    video_banner,
    people,
    people_org,
    credits, // ✅ add this
};

export const steps = [
    {
        step: "Step 1",
        title: "Select an image",
        description: (
            <>
                First, choose the image you want to remove the background from by clicking{" "}
                <strong>"Start from a photo"</strong>.<br />
                Supported formats: <strong>PNG</strong> or <strong>JPG</strong>.<br />
                All image dimensions are supported.
            </>
        ),
    },
    {
        step: "Step 2",
        title: "Let AI remove the background",
        description: (
            <>
                Our AI automatically removes the background from your image in seconds.<br />
                Next, choose a new background — white, transparent, a solid color, or even another image.
            </>
        ),
    },
    {
        step: "Step 3",
        title: "Download your image",
        description: (
            <>
                Once you're happy with the result, download your photo instantly.<br />
                You can also save it to your Photoroom account for future edits by creating a free account.
            </>
        ),
    },
];

export const categories = ["People", "Products", "Animals", "Cars", "Graphics"];

export const plans = [
    {
        id: "Basics",
        name: "Basic Package",
        price: 499,
        credits: "100 credits",
        description: "Best for personal use",
        popular: false,
    },
    {
        id: "Premium",
        name: "Premium Package",
        price: 899,
        credits: "250 credits",
        description: "Best for business use",
        popular: true,
    },
    {
        id: "Ultimate",
        name: "Ultimate Package",
        price: 1499,
        credits: "10000 credits",
        description: "Best for enterprise use",
        popular: false,
    },
];

export const testimonials = [
    {
        id: 1,
        quote: "We are impressed by the AI and think it's the best choice on the market",
        author: "Anthony Walker",
        handle: "@_webarchitect",
    },
    {
        id: 2,
        quote: "remove.bg is leaps and bounds ahead of the competition, a thousand times better. It simplified the whole process",
        author: "Sarah Johnson",
        handle: "@techlead_sarah",
    },
    {
        id: 3,
        quote: "We were impressed by its ability to account for pesky, feathery hair without making an image look jagged",
        author: "Michael Chen",
        handle: "@coding_newbie",
    },
];

export const FOOTER_CONSTANTS = [
    {
        url: "https://facebook.com",
        logo: "https://img.icons8.com/fluent/30/000000/facebook-new.png",
    },
    {
        url: "https://linkedin.com",
        logo: "https://img.icons8.com/fluent/30/000000/linkedin-2.png",
    },
    {
        url: "https://instagram.com",
        logo: "https://img.icons8.com/fluent/30/000000/instagram-new.png",
    },
    {
        url: "https://twitter.com",
        logo: "https://img.icons8.com/fluent/30/000000/twitter.png",
    },
];