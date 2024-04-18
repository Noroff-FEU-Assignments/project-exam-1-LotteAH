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
      blogTitleElement.textContent = `Blooms & Bounty | Blog | ${post.title.rendered}`; // Update title text
    }

    document.title = `Blooms & Bounty | Blog | ${post.title.rendered}`;

    const blogSpecificContainer = document.querySelector(".blog-specific-container");

    let postHTML = `
      <h1>${post.title.rendered}</h1>
      <div class="post-content">${post.content.rendered}</div>
    `;

    if (post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"].length > 0) {
      postHTML += '<div class="image-container">';
      post._embedded["wp:featuredmedia"].forEach((media) => {
        const imageUrl = media.source_url;
        postHTML += `<img src="${imageUrl}" class="post-image" alt="${media.alt_text}" data-image-url="${imageUrl}">`;
      });
      postHTML += '</div>';
    }

    blogSpecificContainer.innerHTML = postHTML;

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
        modalImg.src = image.src; 
        modal.style.display = 'block';
      });
    });

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        if (modal) {
          modal.style.display = 'none';
        }
      });
    }

    window.addEventListener('click', (event) => {
      const modal = document.getElementById('imageModal');
      if (modal && event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  getBlogPost();
});
