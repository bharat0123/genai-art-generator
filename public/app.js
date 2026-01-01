// API Base URL
const API_BASE = '/api/images';

// DOM Elements
const promptInput = document.getElementById('promptInput');
const sizeSelect = document.getElementById('sizeSelect');
const generateBtn = document.getElementById('generateBtn');
const resultContainer = document.getElementById('resultContainer');
const generatedImage = document.getElementById('generatedImage');
const promptDisplay = document.getElementById('promptDisplay');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const downloadBtn = document.getElementById('downloadBtn');
const saveBtn = document.getElementById('saveBtn');
const gallery = document.getElementById('gallery');
const refreshGalleryBtn = document.getElementById('refreshGalleryBtn');

let currentImageId = null;

// Generate image
generateBtn.addEventListener('click', handleGenerate);
promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleGenerate();
    }
});

async function handleGenerate() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showError('Please enter a prompt to generate artwork');
        return;
    }

    // Hide previous results and errors
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';

    // Show loading state
    setLoading(true);

    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                size: sizeSelect.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate image');
        }

        // Display result
        currentImageId = data.imageId;
        generatedImage.src = data.imageUrl;
        promptDisplay.textContent = `"${data.prompt}"`;
        resultContainer.style.display = 'block';
        
        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Refresh gallery
        loadGallery();
    } catch (error) {
        console.error('Generation error:', error);
        showError(error.message || 'Failed to generate image. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Download image
downloadBtn.addEventListener('click', () => {
    if (currentImageId) {
        window.location.href = `${API_BASE}/${currentImageId}/download`;
    }
});

// Save to gallery (already saved, just refresh)
saveBtn.addEventListener('click', () => {
    if (currentImageId) {
        loadGallery();
        showSuccess('Artwork saved to gallery!');
    }
});

// Load gallery
refreshGalleryBtn.addEventListener('click', loadGallery);

async function loadGallery() {
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load gallery');
        }

        displayGallery(data.images || []);
    } catch (error) {
        console.error('Gallery load error:', error);
        gallery.innerHTML = `<p class="empty-state">Error loading gallery: ${error.message}</p>`;
    }
}

function displayGallery(images) {
    if (images.length === 0) {
        gallery.innerHTML = '<p class="empty-state">No artwork generated yet. Create your first masterpiece!</p>';
        return;
    }

    gallery.innerHTML = images.map(image => `
        <div class="gallery-item">
            <img src="${API_BASE}/${image.id}" alt="${escapeHtml(image.prompt)}" />
            <div class="gallery-item-info">
                <p class="gallery-item-prompt">${escapeHtml(image.prompt)}</p>
                <div class="gallery-item-actions">
                    <button onclick="downloadImage('${image.id}')">⬇️ Download</button>
                    <button onclick="viewImage('${image.id}')">👁️ View</button>
                </div>
            </div>
        </div>
    `).join('');
}

function downloadImage(imageId) {
    window.location.href = `${API_BASE}/${imageId}/download`;
}

function viewImage(imageId) {
    const imageUrl = `${API_BASE}/${imageId}`;
    window.open(imageUrl, '_blank');
}

function setLoading(loading) {
    generateBtn.disabled = loading;
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoader = generateBtn.querySelector('.btn-loader');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorContainer.style.display = 'block';
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccess(message) {
    // Simple success notification (could be enhanced with a toast library)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load gallery on page load
loadGallery();

