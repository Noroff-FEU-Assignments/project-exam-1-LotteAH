document.addEventListener("DOMContentLoaded", function () {
    const carouselContents = document.querySelectorAll(".carousel-content");
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");

    let startIndex = 0;
    const postsPerPage = 3;
    let posts = [];

    async function fetchPosts() {
        try {
            const response = await fetch("https://aasholtstudio.com/wp-json/wp/v2/posts");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            posts = await response.json();
            displayPosts();
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    async function fetchFeaturedImage(post) {
        try {
            const featuredMediaId = post.featured_media;
            let featuredMediaUrl = "";

            if (featuredMediaId) {
                const mediaResponse = await fetch(`https://aasholtstudio.com/wp-json/wp/v2/media/${featuredMediaId}`);
                if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    featuredMediaUrl = mediaData.source_url;
                }
            }

            return featuredMediaUrl;
        } catch (error) {
            console.error("Error fetching featured image:", error);
            return "";
        }
    }

    async function displayPosts() {
        carouselContents.forEach(async (carouselContent, index) => {
            const postIndex = (startIndex + index) % posts.length;
            const post = posts[postIndex];
            const featuredImageURL = await fetchFeaturedImage(post);

            const carouselItem = carouselContent.querySelector(".carousel-item");
            if (featuredImageURL) {
                const image = document.createElement("img");
                image.src = featuredImageURL;
                image.alt = post.title.rendered;
                image.classList.add("carousel-img");

                const textContainer = document.createElement("div");
                textContainer.classList.add("carousel-text");
                const title = document.createElement("h2");
                title.textContent = post.title.rendered;
                textContainer.appendChild(title);

                const postLink = document.createElement("a");
                postLink.href = `blog_specific.html?id=${post.id}`;
                postLink.appendChild(image);
                postLink.appendChild(textContainer);

                carouselItem.innerHTML = "";
                carouselItem.appendChild(postLink);
            } else {
                carouselItem.innerHTML = "Featured image not available";
            }
        });
    }

    arrowLeft.addEventListener("click", function () {
        startIndex = (startIndex - postsPerPage + posts.length) % posts.length;
        displayPosts();
    });

    arrowRight.addEventListener("click", function () {
        startIndex = (startIndex + postsPerPage) % posts.length;
        displayPosts();
    });

    // Touch event handling for swipe gestures
    let startX = null;
    let startY = null;
    let swipeThreshold = 50; // Adjust this threshold as needed
    let touchStartX = null;

    document.querySelector(".carousel-container").addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        touchStartX = startX;
    });

    document.querySelector(".carousel-container").addEventListener("touchmove", (e) => {
        if (startX === null || startY === null) {
            return;
        }

        const diffX = e.touches[0].clientX - startX;
        const diffY = e.touches[0].clientY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault(); // Prevent vertical scrolling
        }
    });

    document.querySelector(".carousel-container").addEventListener("touchend", (e) => {
        if (startX === null || startY === null) {
            return;
        }

        const diffX = e.changedTouches[0].clientX - touchStartX;

        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                startIndex = (startIndex - postsPerPage + posts.length) % posts.length;
            } else {
                startIndex = (startIndex + postsPerPage) % posts.length;
            }
            displayPosts();
        }

        startX = null;
        startY = null;
        touchStartX = null;
    });

    fetchPosts();
});
