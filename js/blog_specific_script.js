import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

document.addEventListener("DOMContentLoaded", () => {
  const postUrl = "https://aasholtstudio.com/wp-json/wp/v2/posts/";

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
      // Update breadcrumb with clickable links and classes
      blogTitleElement.innerHTML = `
        <a href="index.html">Blooms & Bounty | Home |</a>
        <a href="blog.html"> Blog |</a>
        <span class="post-title">${post.title.rendered}</span>
      `;
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
      // Handle both click and touch events for opening the modal
      image.addEventListener('click', openModal);
    });

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', outsideModalClick);
  }

  function openModal(event) {
    event.preventDefault(); // Prevent the default behavior of the anchor link
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
    modalImg.src = this.src; // 'this' refers to the clicked image
    modal.style.display = 'block';
  }

  function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function outsideModalClick(event) {
    const modal = document.getElementById('imageModal');
    if (modal && event.target === modal) {
      modal.style.display = 'none';
    }
  }

  getBlogPost();
});
