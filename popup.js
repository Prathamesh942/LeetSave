document.addEventListener("DOMContentLoaded", () => {
  displayPosts();

  const savePostButton = document.getElementById("savePost");
  savePostButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "extractPostURL" },
        (response) => {
          if (response && response.url) {
            if (response.url.startsWith("https://leetcode.com/discuss")) {
              const title = prompt("Enter a title for this post:");
              if (title && title.trim() !== "") {
                chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
                  const posts = result.leetcodePosts;
                  const exists = posts.some(
                    (post) => post.url === response.url
                  );
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
            } else {
              alert("This URL is not a valid LeetCode discussion post URL.");
            }
          }
        }
      );
    });
  });

  savePostButton.disabled = true;
  savePostButton.classList.add("disabled");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    if (url.startsWith("https://leetcode.com/discuss")) {
      savePostButton.disabled = false;
      savePostButton.classList.remove("disabled");
    } else {
      savePostButton.disabled = true;
      savePostButton.classList.add("disabled");
    }
  });
});

function displayPosts() {
  chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
    const posts = result.leetcodePosts;
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";

    posts.forEach((post, index) => {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      const postLink = document.createElement("a");
      postLink.classList.add("postname");
      postLink.href = post.url;
      postLink.textContent = post.name;
      postLink.target = "_blank";

      const removeButton = document.createElement("button");
      removeButton.className = "remove-button";

      const img = document.createElement("img");
      img.src = "icons/delete.png";
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

function removePost(index) {
  chrome.storage.local.get({ leetcodePosts: [] }, (result) => {
    const posts = result.leetcodePosts;
    posts.splice(index, 1);
    chrome.storage.local.set({ leetcodePosts: posts }, () => {
      displayPosts();
    });
  });
}
