document.addEventListener("DOMContentLoaded", () => {
  // Display saved posts when the popup loads
  displayPosts();

  // Add event listener to save post button
  document.getElementById("savePost").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractPostURL" },
        (response) => {
          if (response && response.url) {
            const title = prompt("Enter a title for this post:");
            if (title && title.trim() !== "") {
              chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
                const posts = result.leetcodePosts;

                // Check if the URL already exists
                const exists = posts.some((post) => post.url === response.url);
                if (!exists) {
                  posts.push({ name: title.trim(), url: response.url });
                  chrome.storage.local.set({ leetcodePosts: posts }, () => {
                    displayPosts();
                  });
                } else {
                  alert("Post link already saved!");
                }
              });
            }
          }
        }
      );
    });
  });
});

// Function to display saved posts
function displayPosts() {
  chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
    const posts = result.leetcodePosts;
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ""; // Clear previous posts

    posts.forEach((post, index) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      const postLink = document.createElement("a");
      postLink.classList.add("postname");
      postLink.href = post.url;
      postLink.textContent = post.name; // Display the title as the link text
      postLink.target = "_blank";

      const removeButton = document.createElement("button");
      removeButton.className = "remove-button";

      const img = document.createElement("img");
      img.src = "icons/delete.png"; // Replace with the path to your PNG file
      img.alt = "Remove";

      removeButton.appendChild(img);
      removeButton.addEventListener("click", () => {
        removePost(index);
      });

      postDiv.appendChild(postLink);
      postDiv.appendChild(removeButton);
      postsContainer.appendChild(postDiv);
    });
  });
}

// Function to remove a post
function removePost(index) {
  chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
    const posts = result.leetcodePosts;
    posts.splice(index, 1); // Remove post at the given index
    chrome.storage.local.set({ leetcodePosts: posts }, () => {
      displayPosts(); // Refresh the displayed posts
    });
  });
}
