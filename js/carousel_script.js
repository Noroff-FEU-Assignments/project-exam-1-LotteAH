document.addEventListener("DOMContentLoaded", function () {
    const carouselContent = document.querySelector(".carousel-content");
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");

    let currentIndex = 0;
    let posts = [];

    async function fetchPosts() {
        try {
            const response = await fetch("http://blooms-and-bounty.local/wp-json/wp/v2/posts");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            posts = await response.json();
            displayPost(currentIndex);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    async function fetchFeaturedImage(post) {
        try {
            const featuredMediaId = post.featured_media;
            let featuredMediaUrl = "";

            if (featuredMediaId) {
                const mediaResponse = await fetch(`http://blooms-and-bounty.local/wp-json/wp/v2/media/${featuredMediaId}`);
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

    async function displayPost(index) {
        const post = posts[index];
        const featuredImageURL = await fetchFeaturedImage(post);

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

            carouselContent.innerHTML = "";
            carouselContent.appendChild(image);
            carouselContent.appendChild(textContainer);
        } else {
            carouselContent.innerHTML = "Featured image not available";
        }
    }

    arrowLeft.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + posts.length) % posts.length;
        displayPost(currentIndex);
    });

    arrowRight.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % posts.length;
        displayPost(currentIndex);
    });

    fetchPosts();
});
