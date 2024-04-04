import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

const loadingIndicator = document.querySelector(".loader");
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
  const blogSpecificContainer = document.querySelector(".blog-specific-container");
  
  let postHTML = `
    <h1>${post.title.rendered}</h1>
    <div class="post-content">${post.content.rendered}</div>
  `;
  
  blogSpecificContainer.innerHTML = postHTML;
}

getBlogPost();
