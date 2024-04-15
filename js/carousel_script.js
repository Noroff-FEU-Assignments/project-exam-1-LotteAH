document.addEventListener("DOMContentLoaded", function () {
    const carouselContents = document.querySelectorAll(".carousel-content");
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");

    let startIndex = 0;
    const postsPerPage = 3; // Number of posts to display per page
    let posts = [];

    async function fetchPosts() {
        try {
            const response = await fetch("http://blooms-and-bounty.local/wp-json/wp/v2/posts");
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

                carouselItem.innerHTML = ""; // Clear existing content
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

    fetchPosts();
});
