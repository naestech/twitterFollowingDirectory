// Add a small delay to ensure following.js is loaded
setTimeout(() => {
    const followingList = document.getElementById('followingList');
    const savedData = JSON.parse(localStorage.getItem('twitterFollowingData') || '{}');

    // Add sort buttons to headers
    const headers = document.querySelectorAll('th');
    headers[0].innerHTML = `Username <button class="sortBtn" onclick="sortTable(0)">↕️</button>`;
    headers[2].innerHTML = `Tags <button class="sortBtn" onclick="sortTable(2)">↕️</button>`;

    // Debug: Check if data is loaded
    console.log('Following Data:', followingData);
    
    // Check if data exists
    if (!followingData) {
        console.error('Following data not loaded properly');
        return;
    }

    // Process following data
    followingData.forEach((item, index) => {
        // Debug: Log each item
        console.log('Processing item:', item);
        
        const row = document.createElement('tr');
        const userLink = item.following.userLink;
        
        // Create cells
        const usernameCell = document.createElement('td');
        const urlCell = document.createElement('td');
        const tagsCell = document.createElement('td');

        // Create input for username
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.value = savedData[userLink]?.username || '';
        usernameInput.placeholder = 'Enter username';
        usernameInput.dataset.url = userLink;
        usernameInput.addEventListener('change', saveData);

        // Create URL link
        const urlLink = document.createElement('a');
        urlLink.href = userLink;
        urlLink.textContent = userLink;
        urlLink.target = '_blank';

        // Create input for tags
        const tagsInput = document.createElement('input');
        tagsInput.type = 'text';
        tagsInput.value = savedData[userLink]?.tags || '';
        tagsInput.placeholder = 'Enter tags';
        tagsInput.dataset.url = userLink;
        tagsInput.addEventListener('change', saveData);

        // Append elements
        usernameCell.appendChild(usernameInput);
        urlCell.appendChild(urlLink);
        tagsCell.appendChild(tagsInput);

        row.appendChild(usernameCell);
        row.appendChild(urlCell);
        row.appendChild(tagsCell);

        followingList.appendChild(row);
    });
});

function saveData(event) {
    const url = event.target.dataset.url;
    const savedData = JSON.parse(localStorage.getItem('twitterFollowingData') || '{}');
    
    if (!savedData[url]) {
        savedData[url] = {};
    }

    const row = event.target.closest('tr');
    savedData[url] = {
        username: row.querySelector('input[placeholder="Enter username"]').value,
        tags: row.querySelector('input[placeholder="Enter tags"]').value
    };

    localStorage.setItem('twitterFollowingData', JSON.stringify(savedData));
}

// Add this new sorting function
function sortTable(columnIndex) {
    const table = document.getElementById('followingTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    let sortDirection = tbody.dataset.sortDir === 'asc' ? 'desc' : 'asc';
    
    rows.sort((a, b) => {
        const aValue = a.querySelectorAll('input')[columnIndex === 0 ? 0 : 1].value.toLowerCase();
        const bValue = b.querySelectorAll('input')[columnIndex === 0 ? 0 : 1].value.toLowerCase();
        
        // Empty values go to the top when ascending, bottom when descending
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortDirection === 'asc' ? -1 : 1;
        if (!bValue) return sortDirection === 'asc' ? 1 : -1;
        
        return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    // Update the DOM
    rows.forEach(row => tbody.appendChild(row));
    tbody.dataset.sortDir = sortDirection;
} 