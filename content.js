const BATCH_SIZE = 20;
let allArticles = [];
let currentOffset = 0;
let showMoreButton = null;

function updateArticleList() {
    allArticles = Array.from(
        document.querySelectorAll('article[data-testid^="conversation-turn-"]')
    );
}

function trimMessages() {
    updateArticleList();

    const total = allArticles.length;
    const visibleCount = Math.min((currentOffset + 1) * BATCH_SIZE, total);
    const hiddenCount = total - visibleCount;
    const firstVisibleIndex = total - visibleCount;

    allArticles.forEach((article, index) => {
        article.style.display = (index >= firstVisibleIndex) ? '' : 'none';
    });

    insertOrMoveShowMoreButton(firstVisibleIndex, hiddenCount, total, visibleCount);
}

function insertOrMoveShowMoreButton(beforeIndex, hidden, total, visible) {
    if (showMoreButton) {
        showMoreButton.remove();
        showMoreButton = null;
    }

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.margin = '16px 0';

    const button = document.createElement('button');
    button.style.padding = '8px 14px';
    button.style.backgroundColor = '#10a37f';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';

    if (visible >= total) {

        button.innerText = 'Show only latest messages';
        button.onclick = () => {
            currentOffset = 0;
            trimMessages();
        };
        wrapper.appendChild(button);
        allArticles[0].parentNode.insertBefore(wrapper, allArticles[0]);
    } else {

        const toShowNow = Math.min(BATCH_SIZE, hidden);
        button.innerText = `Show ${toShowNow} more messages (${hidden} hidden)`;
        button.onclick = () => {
            currentOffset++;
            trimMessages();
        };
        const target = allArticles[beforeIndex];
        if (target && target.parentNode) {
            wrapper.appendChild(button);
            target.parentNode.insertBefore(wrapper, target);
        }
    }

    showMoreButton = wrapper;
}

setInterval(trimMessages, 3000);
