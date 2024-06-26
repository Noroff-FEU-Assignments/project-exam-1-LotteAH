document.addEventListener("DOMContentLoaded", () => {
  const commentsUrl = "https://aasholtstudio.com/wp-json/wp/v2/comments/";
  const thankYouMessage = document.getElementById("thankYouMessage");

  async function fetchComments(postId) {}

  const commentForm = document.getElementById("commentForm");
  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("commentName").value;
    const email = document.getElementById("commentEmail").value;
    const content = document.getElementById("commentContent").value;
    const postId = new URLSearchParams(window.location.search).get("id");

    const username = "LotteAas";
    const password = "Zdxs ulVT wcUY WRZ3 9LwE EDAz";
    const auth = btoa(`${username}:${password}`);

    try {
      const response = await fetch(commentsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
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

      thankYouMessage.style.display = "block";
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  });

  const postId = new URLSearchParams(window.location.search).get("id");
  if (postId) {
    fetchComments(postId);
  }
});
