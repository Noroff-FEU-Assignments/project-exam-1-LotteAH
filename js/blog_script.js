import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

const resultsContainer = document.getElementById("blogPosts");
const loadingIndicator = document.querySelector(".loader");
const postUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/posts";
const mediaUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/media";
let currentPage = 1; // Track the current page

async function getBlogPosts(page = 1) {
  try {
    showLoadingIndicator();
    const response = await fetch(`${postUrl}?page=${page}&per_page=10`); // Fetch 10 posts per page

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

      // Wrap each blog post item with an additional container
      const postContainer = document.createElement('div');
      postContainer.classList.add('blogpost-container'); // Add a class for styling

      const postHTML = `
        <section class="blogpost" data-id="${post.id}">
          <div class="inner-container">
            <div class="blogpost-content">
              <img src="${featuredMediaUrl}" alt="${post.title.rendered}" class="blogpost-img"/>
              <div class="blogpost-text">
                <h2>${post.title.rendered}</h2>
              </div>
            </div>
          </div>
        </section>
      `;
      
      postContainer.innerHTML = postHTML;
      postContainer.addEventListener('click', () => {
        window.location.href = `blog_specific.html?id=${post.id}`;
      });
      
      resultsContainer.appendChild(postContainer);
    }

    createPaginationButtons(posts.length); // Create pagination buttons based on the number of posts
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

function createPaginationButtons(postsCount) {
  const totalPages = Math.ceil(postsCount / 10); // Assuming 10 posts per page
  const paginationContainer = document.querySelector('.pagination');

  paginationContainer.innerHTML = ""; // Clear existing pagination buttons

  if (totalPages > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        getBlogPosts(currentPage);
      }
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        getBlogPosts(currentPage);
      }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);
  }
}

getBlogPosts();
