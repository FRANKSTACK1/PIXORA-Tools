/* ============================================
   PIXORA TOOLS — Shared JavaScript
   ============================================ */

// ── Header scroll state ──────────────────────
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Active nav link ──────────────────────────
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Mobile drawer ────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mobileDrawer = document.querySelector('.mobile-drawer');
const drawerClose = document.querySelector('.drawer-close');

function openDrawer() {
  mobileOverlay.style.display = 'block';
  mobileDrawer.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    mobileOverlay.classList.add('visible');
    mobileDrawer.classList.add('open');
    hamburger.classList.add('active');
  });
}

function closeDrawer() {
  mobileOverlay.classList.remove('visible');
  mobileDrawer.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    mobileOverlay.style.display = 'none';
    mobileDrawer.style.display = 'none';
  }, 400);
}

if (hamburger) hamburger.addEventListener('click', openDrawer);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

// ── Drag & drop upload zones ─────────────────
document.querySelectorAll('.upload-zone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length) handleFileUpload(zone, files);
  });
  const input = zone.querySelector('input[type="file"]');
  if (input) {
    input.addEventListener('change', () => {
      if (input.files.length) handleFileUpload(zone, input.files);
    });
  }
});

function handleFileUpload(zone, files) {
  const file = files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = zone.closest('.tool-workspace')?.querySelector('.uploaded-preview');
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      const placeholder = zone.closest('.tool-workspace')?.querySelector('.preview-placeholder');
      if (placeholder) placeholder.style.display = 'none';
    }
    // Update zone UI
    zone.querySelector('h3').textContent = file.name;
    zone.querySelector('p').textContent = formatBytes(file.size) + ' — Ready';
    zone.style.borderStyle = 'solid';
    zone.style.borderColor = 'var(--teal)';
  };
  reader.readAsDataURL(file);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// ── Slider value display ─────────────────────
document.querySelectorAll('input[type="range"]').forEach(slider => {
  const display = document.getElementById(slider.id + '-val');
  if (display) {
    display.textContent = slider.value + (slider.dataset.unit || '');
    slider.addEventListener('input', () => {
      display.textContent = slider.value + (slider.dataset.unit || '');
    });
  }
});

// ── Color swatches ───────────────────────────
document.querySelectorAll('.swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    sw.closest('.color-swatches').querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
  });
});

// ── Aspect ratio toggle ──────────────────────
const lockToggle = document.getElementById('aspect-lock');
const widthInput = document.getElementById('img-width');
const heightInput = document.getElementById('img-height');
let aspectRatio = null;

if (widthInput && heightInput) {
  aspectRatio = parseInt(widthInput.value) / parseInt(heightInput.value);
  widthInput.addEventListener('input', () => {
    if (lockToggle && lockToggle.checked && aspectRatio) {
      heightInput.value = Math.round(parseInt(widthInput.value) / aspectRatio);
    }
  });
  heightInput.addEventListener('input', () => {
    if (lockToggle && lockToggle.checked && aspectRatio) {
      widthInput.value = Math.round(parseInt(heightInput.value) * aspectRatio);
    }
  });
}

// ── Bulk renamer preview ─────────────────────
const patternInput = document.getElementById('rename-pattern');
const previewList = document.getElementById('rename-preview');
const bulkFileInput = document.getElementById('bulk-files');
let bulkFiles = [];

if (bulkFileInput) {
  bulkFileInput.addEventListener('change', () => {
    bulkFiles = Array.from(bulkFileInput.files);
    updateBulkPreview();
  });
}

if (patternInput) {
  patternInput.addEventListener('input', updateBulkPreview);
}

function updateBulkPreview() {
  if (!previewList || bulkFiles.length === 0) return;
  const pattern = patternInput ? patternInput.value || 'image_{n}' : 'image_{n}';
  const ext = bulkFiles[0].name.split('.').pop();
  previewList.innerHTML = bulkFiles.slice(0, 5).map((f, i) => {
    const newName = pattern.replace('{n}', String(i + 1).padStart(2, '0')) + '.' + ext;
    return `<div class="rename-row"><span class="old-name">${f.name}</span><span class="arrow-icon">→</span><span class="new-name">${newName}</span></div>`;
  }).join('');
  if (bulkFiles.length > 5) {
    previewList.innerHTML += `<div class="rename-row muted">…and ${bulkFiles.length - 5} more</div>`;
  }
}

// ── Smooth section reveal ────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));