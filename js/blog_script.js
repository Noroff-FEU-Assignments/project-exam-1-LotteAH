import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

const resultsContainer = document.getElementById("blogPosts");
const loadingIndicator = document.querySelector(".loader");
const postUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/posts";
const mediaUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/media";

async function getBlogPosts() {
  try {
    showLoadingIndicator();
    const response = await fetch(postUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();

    resultsContainer.innerHTML = "";
    hideLoadingIndicator();
    
    for (const post of posts) {
      const featuredMediaId = post.featured_media;
      let featuredMediaUrl = "";

      // Fetch the details of the featured image
      if (featuredMediaId) {
        const mediaResponse = await fetch(`${mediaUrl}/${featuredMediaId}`);
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          featuredMediaUrl = mediaData.source_url;
        }
      }

      const postHTML = `
        <section class="blogpost" data-id="${post.id}">
          <div class="blogpost-container">
            <div class="blogpost-content">
              <img src="${featuredMediaUrl}" alt="${post.title.rendered}" class="blogpost-img"/>
              <div class="blogpost-text">
                <h2>${post.title.rendered}</h2>
              </div>
            </div>
          </div>
        </section>
      `;
      
      const postElement = document.createElement('div');
      postElement.innerHTML = postHTML;
      postElement.addEventListener('click', () => {
        window.location.href = `blog_specific.html?id=${post.id}`;
      });
      
      resultsContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error("An error occurred:", error);

    const errorMessage = document.createElement('div');
    errorMessage.textContent = "An error occurred. Please try again later.";
    errorMessage.classList.add('error-message');
  
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(errorMessage);
    hideLoadingIndicator();
  }
}

getBlogPosts();
