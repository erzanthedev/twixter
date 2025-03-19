import twixsData from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

// Utitlty Functions
const checkLocalStorage = () => {
  const storedData = JSON.parse(localStorage.getItem("twixs"));
  if (storedData) {
    twixsData.length = 0; // Clear original Array
    twixsData.push(...storedData);
  }
};

const updateLocalStorage = () => {
  localStorage.setItem("twixs", JSON.stringify(twixsData));
};

const getReplyHtml = (repliesArr) => {
  return repliesArr
    .map((reply) => {
      const { profilePic, handle, twixText } = reply;
      return `
          <div class='tweet-reply'>
            <div class="tweet-inner">
              <img src="${profilePic}" class="profile-pic">
              <div>
                  <p class="handle">${handle}</p>
                  <p class="tweet-text">${twixText}</p>
              </div>
            </div>
          </div>
`;
    })
    .join("");
};

const getFeedHtml = () => {
  return twixsData
    .map((twix) => {
      const { profilePic, handle, twixText, replies, likes, retweets, uuid } =
        twix;

      const likedIconClass = twix.isLiked ? "liked" : "";
      const retweetedIconClass = twix.isRetweeted ? "retweeted" : "";
      const repliesHtml = replies.length > 0 ? getReplyHtml(replies) : "";

      return `
      <div class='tweet'>
        <div class='tweet-inner'>
          <img src='${profilePic}'class='profile-pic' />
          <div>
            <p class='handle'>${handle}</p>
            <p class='tweet-text'>${twixText}</p>
            <div class='tweet-details'>
              <span class='tweet-detail'>
                <i class='fa-regular fa-comment-dots' data-reply=${uuid} ></i>
                ${replies.length}
              </span>
              <span class='tweet-detail'>
                <i class='fa-solid fa-heart ${likedIconClass} ' data-like=${uuid} ></i>
                ${likes}
              </span>
              <span class='tweet-detail'>
                <i class='fa-solid fa-retweet ${retweetedIconClass} ' data-retweet=${uuid}></i>
                ${retweets}
              </span>
            </div>
          </div>
        </div>
        <div id='replies-${uuid}' class='hidden'>
          ${repliesHtml}
          <div class='reply-input-area'>
            <textarea class='reply-input' placeholder="Add a comment...."></textarea>
            <button class='reply-btn'>Reply</button>
          </div>
        </div>
      </div>
`;
    })
    .join("");
};

const render = () => {
  checkLocalStorage();
  document.getElementById("feed").innerHTML = getFeedHtml();
};

// Event Handlers
const handleTwixClick = () => {
  const twixInput = document.getElementById("twix-input");

  if (twixInput.value) {
    twixsData.unshift({
      handle: `@erzanthedev 👨‍💻`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      twixText: twixInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    twixInput.value = "";
    updateLocalStorage();
    render();
  }
};

const handleLikeClick = (twixId) => {
  const twixTargetObj = twixsData.filter((twix) => {
    const { uuid } = twix;
    return uuid === twixId;
  })[0];

  twixTargetObj.isLiked ? twixTargetObj.likes-- : twixTargetObj.likes++;
  twixTargetObj.isLiked = !twixTargetObj.isLiked;

  updateLocalStorage();
  render();
};

const handleRetweetClick = (twixId) => {
  const twixTargetObj = twixsData.filter((twix) => {
    const { uuid } = twix;
    return uuid === twixId;
  })[0];

  twixTargetObj.isRetweeted
    ? twixTargetObj.retweets--
    : twixTargetObj.retweets++;

  twixTargetObj.isRetweeted = !twixTargetObj.isRetweeted;

  updateLocalStorage();
  render();
};

const handleReplyClick = (twixId) => {
  document.getElementById(`replies-${twixId}`).classList.toggle("hidden");
};

// Event Listeners
document.addEventListener("click", (e) => {
  if (e.target.id === "twix-btn") {
    handleTwixClick(e.target.id);
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  }
});

render();
