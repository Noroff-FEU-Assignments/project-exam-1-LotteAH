import { showLoadingIndicator, hideLoadingIndicator } from "./indicator.js";

const resultsContainer = document.getElementById("blogPosts");
const loadingIndicator = document.querySelector(".loader");
const postUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/posts";
const mediaUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/media";
let currentPage = 1; 
let totalPosts = 0; 
const postsPerPage = 10; 

async function getBlogPosts() {
  try {
    showLoadingIndicator();
    const response = await fetch(`${postUrl}?per_page=${postsPerPage}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const totalCount = response.headers.get("X-WP-Total");
    totalPosts = parseInt(totalCount);

    const posts = await response.json();

    resultsContainer.innerHTML = "";
    hideLoadingIndicator();

    displayPosts(posts);
    createLoadMoreButton();
  } catch (error) {
    console.error("An error occurred:", error);

    const errorMessage = document.createElement("div");
    errorMessage.textContent = "An error occurred. Please try again later.";
    errorMessage.classList.add("error-message");
    errorMessage.style.color = "red";

    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(errorMessage);
    hideLoadingIndicator();
  }
}

function displayPosts(posts) {
  posts.forEach(post => {
    const featuredMediaId = post.featured_media;
    let featuredMediaUrl = "";

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

async function loadMorePosts() {
  try {
    showLoadingIndicator();
    const response = await fetch(`${postUrl}?page=${currentPage + 1}&per_page=${postsPerPage}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();
    currentPage++;

    hideLoadingIndicator();

    if (posts.length === 0) {
      removeLoadMoreButton();
      return;
    }

    displayPosts(posts);

    if ((currentPage * postsPerPage) >= totalPosts) {
      removeLoadMoreButton();
    }
  } catch (error) {
    console.error("An error occurred:", error);
    hideLoadingIndicator();
  }
}

function createLoadMoreButton() {
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.textContent = "LOAD MORE";
  loadMoreBtn.classList.add("load-more-btn");
  loadMoreBtn.addEventListener("click", loadMorePosts);
  resultsContainer.insertAdjacentElement("afterend", loadMoreBtn);
}

function removeLoadMoreButton() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.remove();
  }
}

getBlogPosts();
