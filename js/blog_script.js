import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

const resultsContainer = document.getElementById("blogPosts");
const loadingIndicator = document.querySelector(".loader");
const postUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/posts";
const mediaUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/media";
let currentPage = 1; // Track the current page
let totalPages = 1; // Track the total number of pages

async function getBlogPosts(page = 1) {
  try {
    showLoadingIndicator();
    const response = await fetch(`${postUrl}?page=${page}&per_page=10`); // Fetch 10 posts per page

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();

    if (page === 1) {
      // If this is the first page, update the total pages count
      const headers = response.headers;
      const totalCount = headers.get("X-WP-Total");
      totalPages = Math.ceil(totalCount / 10); // Assuming 10 posts per page
    }

    resultsContainer.innerHTML = "";
    hideLoadingIndicator();

    displayPosts(posts);
    createPaginationButtons();
  } catch (error) {
    console.error("An error occurred:", error);

    const errorMessage = document.createElement("div");
    errorMessage.textContent = "An error occurred. Please try again later.";
    errorMessage.classList.add("error-message");

    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(errorMessage);
    hideLoadingIndicator();
  }
}

function displayPosts(posts) {
  posts.forEach(post => {
    const featuredMediaId = post.featured_media;
    let featuredMediaUrl = "";

    // Fetch the details of the featured image
    if (featuredMediaId) {
      fetch(`${mediaUrl}/${featuredMediaId}`)
        .then(mediaResponse => mediaResponse.json())
        .then(mediaData => {
          featuredMediaUrl = mediaData.source_url;

          const postContainer = document.createElement("div");
          postContainer.classList.add("blogpost-container");

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
          postContainer.addEventListener("click", () => {
            window.location.href = `blog_specific.html?id=${post.id}`;
          });

          resultsContainer.appendChild(postContainer);
        })
        .catch(error => console.error("Error fetching media data:", error));
    }
  });
}

function createPaginationButtons() {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      getBlogPosts(currentPage);
    }
  });

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      getBlogPosts(currentPage);
    }
  });

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(nextButton);
}

getBlogPosts();
