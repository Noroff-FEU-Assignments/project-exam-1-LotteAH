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

      showLoadingIndicator();
      const response = await fetch(`${postUrl}${postId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const post = await response.json();
      hideLoadingIndicator();
      displayBlogPost(post);
    } catch (error) {
      console.error("An error occurred:", error);
      hideLoadingIndicator();
    }
  }

  function displayBlogPost(post) {
    const blogTitleElement = document.getElementById('blogTitle');
    if (blogTitleElement) {
      blogTitleElement.textContent = `Blog | ${post.title.rendered}`; // Update title text
    }

    const blogSpecificContainer = document.querySelector(".blog-specific-container");

    let postHTML = `
      <h1>${post.title.rendered}</h1>
      <div class="post-content">${post.content.rendered}</div>
    `;

    // Check if _embedded property exists and featured media is available
    if (post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"].length > 0) {
      // Add images with click handlers to open modal
      postHTML += '<div class="image-container">';
      post._embedded["wp:featuredmedia"].forEach((media) => {
        const imageUrl = media.source_url;
        postHTML += `<img src="${imageUrl}" class="post-image" alt="${media.alt_text}" data-image-url="${imageUrl}">`;
      });
      postHTML += '</div>';
    }

    // Set inner HTML of blogSpecificContainer
    blogSpecificContainer.innerHTML = postHTML;

    // Get all images within the post content and add click event listeners to open modal
    const images = blogSpecificContainer.querySelectorAll('.post-content img');
    images.forEach(image => {
      image.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        if (!modal) {
          console.error("Modal not found");
          return;
        }
        const modalImg = modal.querySelector('.modal-content');
        if (!modalImg) {
          console.error("Modal image not found");
          return;
        }
        modalImg.src = image.src; // Set modal image source to clicked image source
        modal.style.display = 'block'; // Show the modal
      });
    });

    // Close the modal when the close button is clicked
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        if (modal) {
          modal.style.display = 'none'; // Hide the modal
        }
      });
    }

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('imageModal');
      if (modal && event.target === modal) {
        modal.style.display = 'none'; // Hide the modal
      }
    });
  }

  getBlogPost();
});
