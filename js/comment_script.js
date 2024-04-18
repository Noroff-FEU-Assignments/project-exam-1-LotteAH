document.addEventListener("DOMContentLoaded", () => {
  const commentsUrl = "http://blooms-and-bounty.local/wp-json/wp/v2/comments/";
  const thankYouMessage = document.getElementById('thankYouMessage');
  const commentsContainer = document.getElementById('commentsContainer');

  async function fetchComments(postId) {
    try {
      const response = await fetch(`${commentsUrl}?post=${postId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch comments. Status: ${response.status}`);
      }
      const comments = await response.json();
      displayComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  function displayComments(comments) {
    commentsContainer.innerHTML = ''; // Clear previous comments
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
        <strong>${comment.author_name}</strong>
        <p>${comment.content.rendered}</p>
      `;
      commentsContainer.appendChild(commentElement);
    });
  }

  const commentForm = document.getElementById('commentForm');
  commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('commentName').value;
    const email = document.getElementById('commentEmail').value;
    const content = document.getElementById('commentContent').value;
    const postId = new URLSearchParams(window.location.search).get('id');

    const username = 'LotteAas';
    const password = 'Zdxs ulVT wcUY WRZ3 9LwE EDAz';
    const auth = btoa(`${username}:${password}`);

    try {
      const response = await fetch(commentsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          post: postId,
          author_name: name,
          author_email: email,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post comment. Status: ${response.status}`);
      }

      commentForm.reset();

      thankYouMessage.style.display = 'block';

      // Fetch updated comments after posting
      fetchComments(postId);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  });

  const postId = new URLSearchParams(window.location.search).get('id');
  if (postId) {
    fetchComments(postId);
  }
});
