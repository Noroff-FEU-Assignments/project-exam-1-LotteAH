import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

document.addEventListener("DOMContentLoaded", () => {
  const postUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/posts/";

  async function getBlogPost() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('id');

      if (!postId) {
        throw new Error("No post ID provided");
      }

      showLoadingIndicator(); // Assuming these functions are defined in indicator.js
      const response = await fetch(`${postUrl}${postId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const post = await response.json();
      hideLoadingIndicator(); // Assuming these functions are defined in indicator.js
      displayBlogPost(post);
    } catch (error) {
      console.error("An error occurred:", error);
      hideLoadingIndicator(); // Assuming these functions are defined in indicator.js
    }
  }

  function displayBlogPost(post) {
    const blogSpecificContainer = document.querySelector(".blog-specific-container");

    let postHTML = `
      <h1>${post.title.rendered}</h1>
      <div class="post-content">${post.content.rendered}</div>
    `;

    // Check if _embedded property exists
    if (post._embedded && post._embedded["wp:featuredmedia"]) {
      // Add images with click handlers to open modal
      postHTML += '<div class="image-container">';
      post._embedded["wp:featuredmedia"].forEach((media) => {
        const imageUrl = media.source_url;
        postHTML += `<img src="${imageUrl}" class="post-image" alt="${media.alt_text}" data-image-url="${imageUrl}">`;
      });
      postHTML += '</div>';

      // Set inner HTML of blogSpecificContainer
      blogSpecificContainer.innerHTML = postHTML;

      // Get all images and add click event listeners to open modal
      const images = document.querySelectorAll('.post-image');
      images.forEach(image => {
        image.addEventListener('click', () => {
          const modal = document.getElementById('imageModal');
          const modalImg = modal.querySelector('.modal-content');
          modal.style.display = 'block'; // Show the modal
          modalImg.src = image.dataset.imageUrl; // Set modal image source to clicked image
        });
      });

      // Close the modal when the close button is clicked
      const closeBtn = document.querySelector('.close');
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        modal.style.display = 'none'; // Hide the modal
      });

      // Close the modal when clicking outside the modal content
      window.addEventListener('click', (event) => {
        const modal = document.getElementById('imageModal');
        if (event.target === modal) {
          modal.style.display = 'none'; // Hide the modal
        }
      });
    } else {
      // Handle case where no featured media is available
      blogSpecificContainer.innerHTML = postHTML + "<p>No featured media available.</p>";
    }
  }

  getBlogPost();
});
