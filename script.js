// DOM이 로드된 후 실행될 코드
document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript loaded');

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Twitter API configuration
    const TWITTER_BEARER_TOKEN = 'YOUR_BEARER_TOKEN'; // Replace with your Twitter API Bearer Token

    // Function to fetch tweets with #chillguy hashtag
    async function fetchTweets() {
        try {
            const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=%23chillguy&tweet.fields=created_at,public_metrics,author_id&expansions=author_id&user.fields=profile_image_url', {
                headers: {
                    'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching tweets:', error);
            return null;
        }
    }

    // Function to create a tweet card
    function createTweetCard(tweet, user) {
        const card = document.createElement('div');
        card.className = 'twitter-card';
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        cardContent.innerHTML = `
            <div class="tweet-header">
                <img src="${user.profile_image_url}" alt="${user.username}" class="profile-image">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <span>@${user.username}</span>
                </div>
            </div>
            <p class="tweet-text">${tweet.text}</p>
            <div class="tweet-metrics">
                <span>❤️ ${tweet.public_metrics.like_count}</span>
                <span>🔄 ${tweet.public_metrics.retweet_count}</span>
            </div>
            <div class="tweet-date">${new Date(tweet.created_at).toLocaleDateString()}</div>
        `;
        
        card.appendChild(cardContent);
        return card;
    }

    // Function to initialize Twitter cards
    async function initTwitterCards() {
        const twitterCardsContainer = document.getElementById('twitterCards');
        if (!twitterCardsContainer) return;

        const tweetsData = await fetchTweets();
        if (!tweetsData) return;

        const { data: tweets, includes: { users } } = tweetsData;
        
        tweets.forEach(tweet => {
            const user = users.find(u => u.id === tweet.author_id);
            const card = createTweetCard(tweet, user);
            twitterCardsContainer.appendChild(card);
        });
    }

    // Initialize when DOM is loaded
    initTwitterCards();

    // Add scroll event listener for header blur effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 0) {
            header.classList.add('blur');
        } else {
            header.classList.remove('blur');
        }
    });

    // Falling Hearts Animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '💗';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 7 + 's'; // 7-12초로 증가
        heart.style.opacity = Math.random() * 0.4 + 0.2; // 0.2-0.6
        heart.style.fontSize = Math.random() * 15 + 15 + 'px'; // 15-30px

        document.getElementById('hearts-container').appendChild(heart);

        // 애니메이션이 끝나면 하트 요소 제거
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // 하트 생성 간격 1.5초로 증가
    const HEART_INTERVAL = 1500;

    // 페이지 로드시 하트 애니메이션 시작
    setInterval(createHeart, HEART_INTERVAL);
});
