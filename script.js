const API_KEY = '46365118-ed894d2ad940828a76c463144';
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const gallery = document.getElementById('gallery');
const errorMessage = document.getElementById('error-message');
const loadMoreButton = document.getElementById('load-more');

let currentPage = 1; // To keep track of the current page
let currentQuery = ''; // To store the current search query
let currentImageUrl = ''; // To store the current image URL for download/save

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        currentQuery = query; // Store current query
        currentPage = 1; // Reset page to 1
        gallery.innerHTML = ''; // Clear previous results
        loadMoreButton.style.display = 'none'; // Hide load more button
        fetchImages(query);
        errorMessage.textContent = ''; // Clear previous error message
    } else {
        errorMessage.textContent = 'Please enter a search term.';
    }
});

loadMoreButton.addEventListener('click', () => {
    fetchImages(currentQuery);
});

function fetchImages(query) {
    fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20&page=${currentPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayImages(data.hits);
            currentPage++; // Increment page number for next fetch
        })
        .catch(error => {
            console.error('Error fetching images:', error);
            errorMessage.textContent = 'Error fetching images. Please try again later.';
        });
}

function displayImages(images) {
    if (images.length === 0) {
        gallery.innerHTML = '<p>No images found.</p>';
        loadMoreButton.style.display = 'none'; // Hide button if no images
        return;
    }
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags;
        imgElement.addEventListener('click', () => {
            currentImageUrl = image.webformatURL; // Store image URL
            document.getElementById('modal-image').src = currentImageUrl; // Set modal image source
            document.getElementById('image-message').textContent = `Long press on the image and then click on download image to download it.`;
            openModal(); // Open modal to show instructions
        });
        gallery.appendChild(imgElement);
    });
    loadMoreButton.style.display = 'block'; // Show load more button after images are added
}

// Modal functions
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('myModal').style.display = 'none';
});
