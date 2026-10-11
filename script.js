function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active-page');
  });

  // Remove active state from nav buttons
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active-page');
  }

  // Set active nav button
  const activeBtn = Array.from(navBtns).find(btn => 
    btn.getAttribute('onclick').includes(pageId)
  );
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Lightbox (gallery image preview)
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

// Gallery auto-loader: checks assets/example.png, then example1.png, example2.png, ...
// with a forgiving check that scans up to GALLERY_MAX_IMAGES without breaking on gaps.
const GALLERY_MAX_IMAGES = 30;
const GALLERY_PATH = 'assets/example';
const GALLERY_EXT = '.png';

function checkImageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const found = [];

  // First image has no number: example.png
  const firstSrc = `${GALLERY_PATH}${GALLERY_EXT}`;
  if (await checkImageExists(firstSrc)) {
    found.push(firstSrc);
  }

  // Remaining images: example1.png, example2.png, ... up to GALLERY_MAX_IMAGES
  for (let i = 1; i <= GALLERY_MAX_IMAGES; i++) {
    const src = `${GALLERY_PATH}${i}${GALLERY_EXT}`;
    if (await checkImageExists(src)) {
      found.push(src);
    }
  }

  grid.innerHTML = found.map(src => `
    <div class="gallery-card">
      <div class="gallery-image" style="background-image: url('${src}');" onclick="openLightbox('${src}')"></div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', buildGallery);
