// saved-posts.js

// Function to load saved posts from local storage
function loadPosts() {
  chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
    const posts = result.leetcodePosts;
    const postsList = document.getElementById("postsList");

    posts.forEach((url) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.textContent = url;
      link.target = "_blank";
      listItem.appendChild(link);
      postsList.appendChild(listItem);
    });
  });
}

// Load posts when the page loads
document.addEventListener("DOMContentLoaded", loadPosts);
