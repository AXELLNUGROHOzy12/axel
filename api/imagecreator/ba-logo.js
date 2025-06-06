// BA Logo Generator - Fixed version
const BA_LOGO_API = 'https://lab.nulla.top/ba-logo';

class BALogoGenerator {
  constructor() {
    this.apiUrl = BA_LOGO_API;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updatePreview();
  }

  setupEventListeners() {
    // Get input elements
    const blueInput = document.getElementById('blue-text') || document.querySelector('input[name="blue"]');
    const archiveInput = document.getElementById('archive-text') || document.querySelector('input[name="archive"]');
    const transparentToggle = document.getElementById('transparent') || document.querySelector('input[name="transparent"]');
    const saveBtn = document.getElementById('save-btn') || document.querySelector('.save-btn');
    const copyBtn = document.getElementById('copy-btn') || document.querySelector('.copy-btn');

    // Add event listeners
    if (blueInput) {
      blueInput.addEventListener('input', () => this.updatePreview());
    }
    
    if (archiveInput) {
      archiveInput.addEventListener('input', () => this.updatePreview());
    }
    
    if (transparentToggle) {
      transparentToggle.addEventListener('change', () => this.updatePreview());
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveLogo());
    }
    
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyLogo());
    }
  }

  getInputValues() {
    const blueInput = document.getElementById('blue-text') || document.querySelector('input[name="blue"]');
    const archiveInput = document.getElementById('archive-text') || document.querySelector('input[name="archive"]');
    const transparentToggle = document.getElementById('transparent') || document.querySelector('input[name="transparent"]');

    return {
      blue: blueInput ? blueInput.value || 'Blue' : 'Blue',
      archive: archiveInput ? archiveInput.value || 'Archive' : 'Archive',
      transparent: transparentToggle ? transparentToggle.checked : false
    };
  }

  buildApiUrl(params) {
    const url = new URL(this.apiUrl);
    url.searchParams.append('blue', params.blue);
    url.searchParams.append('archive', params.archive);
    
    if (params.transparent) {
      url.searchParams.append('transparent', 'true');
    }
    
    return url.toString();
  }

  updatePreview() {
    const params = this.getInputValues();
    const logoUrl = this.buildApiUrl(params);
    
    // Update preview image
    const previewImg = document.getElementById('logo-preview') || document.querySelector('.logo-preview img');
    if (previewImg) {
      previewImg.src = logoUrl;
      previewImg.alt = `${params.blue}${params.archive} Logo`;
    }
  }

  async saveLogo() {
    try {
      const params = this.getInputValues();
      const logoUrl = this.buildApiUrl(params);
      
      // Show loading state
      this.setLoadingState(true);
      
      // Fetch the image
      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${params.blue}${params.archive}-logo.png`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Logo saved successfully!');
      
    } catch (error) {
      console.error('Error saving logo:', error);
      alert('Failed to save logo. Please try again.');
    } finally {
      this.setLoadingState(false);
    }
  }

  async copyLogo() {
    try {
      const params = this.getInputValues();
      const logoUrl = this.buildApiUrl(params);
      
      // Show loading state
      this.setLoadingState(true);
      
      // Fetch the image
      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Copy to clipboard
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('Logo copied to clipboard!');
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(logoUrl);
        alert('Logo URL copied to clipboard!');
      }
      
      console.log('Logo copied successfully!');
      
    } catch (error) {
      console.error('Error copying logo:', error);
      alert('Failed to copy logo. Your browser may not support this feature.');
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    const saveBtn = document.getElementById('save-btn') || document.querySelector('.save-btn');
    const copyBtn = document.getElementById('copy-btn') || document.querySelector('.copy-btn');
    
    if (saveBtn) {
      saveBtn.disabled = loading;
      saveBtn.textContent = loading ? 'SAVING...' : 'SAVE';
    }
    
    if (copyBtn) {
      copyBtn.disabled = loading;
      copyBtn.textContent = loading ? 'COPYING...' : 'COPY';
    }
  }

  // Public method to generate logo URL
  generateLogoUrl(blue = 'Blue', archive = 'Archive', transparent = false) {
    return this.buildApiUrl({ blue, archive, transparent });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.baLogoGenerator = new BALogoGenerator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BALogoGenerator;
}
