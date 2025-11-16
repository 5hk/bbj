// Releases functionality
(function() {
    'use strict';

    // State
    let allReleases = [];
    let filteredReleases = [];
    let currentFilter = 'featured';
    let panelFilter = 'all';
    let panelSort = 'popularity';
    let searchQuery = '';

    // DOM Elements
    const releasesGrid = document.getElementById('releases-grid');
    const releasesFilterSelect = document.getElementById('releases-filter-select');
    const viewAllBtn = document.getElementById('view-all-btn');
    const releasesPanel = document.getElementById('releases-panel');
    const releasesPanelOverlay = document.getElementById('releases-panel-overlay');
    const panelCloseBtn = document.getElementById('panel-close-btn');
    const releasesPanelGrid = document.getElementById('releases-panel-grid');
    const panelSearchInput = document.getElementById('panel-search-input');
    const panelSortSelect = document.getElementById('panel-sort-select');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Initialize
    function init() {
        loadReleases();
        attachEventListeners();
    }

    // Load releases data from embedded data
    function loadReleases() {
        try {
            // Check if RELEASES_DATA is available (from releases-data.js)
            if (typeof RELEASES_DATA === 'undefined') {
                throw new Error('RELEASES_DATA not found. Make sure releases-data.js is loaded.');
            }
            
            if (!RELEASES_DATA || !RELEASES_DATA.releases || !Array.isArray(RELEASES_DATA.releases)) {
                throw new Error('Invalid data format');
            }
            
            allReleases = RELEASES_DATA.releases;
            console.log(`Loaded ${allReleases.length} releases`);
            
            // Update release count in UI
            updateReleaseCount();
            
            renderMainGrid();
            renderPanelGrid();
        } catch (error) {
            console.error('Error loading releases:', error);
            console.error('Error details:', error.message);
            
            // Show error message to user
            if (releasesGrid) {
                releasesGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-gray);">
                        <p style="margin-bottom: 1rem;">Unable to load releases.</p>
                        <p style="font-size: 0.875rem; margin-top: 0.5rem;">Error: ${error.message}</p>
                    </div>
                `;
            }
            
            // Fallback to empty state
            allReleases = [];
        }
    }

    // Update release count in UI
    function updateReleaseCount() {
        const totalCount = allReleases.length;
        
        // Update "View All Releases" button count
        const releasesCountSpan = document.querySelector('.releases-count');
        if (releasesCountSpan) {
            releasesCountSpan.textContent = `(${totalCount})`;
        }
        
        // Update panel header count
        const releasesTotalSpan = document.querySelector('.releases-total');
        if (releasesTotalSpan) {
            releasesTotalSpan.textContent = `(${totalCount})`;
        }
    }

    // Attach event listeners
    function attachEventListeners() {
        // Main filter select
        if (releasesFilterSelect) {
            releasesFilterSelect.addEventListener('change', handleMainFilterChange);
        }

        // View all button
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', openPanel);
        }

        // Panel close
        if (panelCloseBtn) {
            panelCloseBtn.addEventListener('click', closePanel);
        }

        // Panel overlay close
        if (releasesPanelOverlay) {
            releasesPanelOverlay.addEventListener('click', closePanel);
        }

        // Escape key to close panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && releasesPanel.classList.contains('active')) {
                closePanel();
            }
        });

        // Panel search
        if (panelSearchInput) {
            panelSearchInput.addEventListener('input', handlePanelSearch);
        }

        // Panel filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', handlePanelFilterClick);
        });

        // Panel sort
        if (panelSortSelect) {
            panelSortSelect.addEventListener('change', handlePanelSort);
        }

        // Window resize - re-render grid on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                renderMainGrid();
            }, 250); // Debounce resize events
        });
    }

    // Main grid filter change
    function handleMainFilterChange(e) {
        // Handle both native select and custom select events
        currentFilter = e.detail ? e.detail.value : e.target.value;
        renderMainGrid();
    }

    // Get number of items to display based on screen size
    function getDisplayCount() {
        // Check if mobile (768px breakpoint matches CSS)
        return window.innerWidth <= 768 ? 8 : 24;
    }

    // Render main grid (Featured section)
    function renderMainGrid() {
        if (!releasesGrid) return;

        const displayCount = getDisplayCount();
        let releasesToShow = [];

        switch (currentFilter) {
            case 'featured':
                releasesToShow = allReleases
                    .filter(r => r.featured)
                    .sort((a, b) => a.popularity - b.popularity)  // Lower number = higher popularity (ranking system)
                    .slice(0, displayCount);
                break;
            case 'latest':
                releasesToShow = allReleases
                    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
                    .slice(0, displayCount);
                break;
            case 'albums':
                releasesToShow = allReleases
                    .filter(r => r.type === 'album')
                    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
                    .slice(0, displayCount);
                break;
            case 'singles':
                releasesToShow = allReleases
                    .filter(r => r.type === 'single')
                    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
                    .slice(0, displayCount);
                break;
            default:
                releasesToShow = allReleases.slice(0, displayCount);
        }

        releasesGrid.innerHTML = releasesToShow.map(release => createReleaseCard(release)).join('');
    }

    // Create release card for main grid
    function createReleaseCard(release) {
        const formattedDate = formatDate(release.releaseDate);
        
        return `
            <div class="release-card">
                <div class="release-cover">
                    <img alt="${release.title}" src="${release.coverImage}" loading="lazy" width="500" height="500"/>
                    <div class="release-overlay">
                        <div class="release-info">
                            <h3>${release.title}</h3>
                            <p>${release.artist} &middot; ${formattedDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Open side panel
    function openPanel() {
        if (releasesPanel) {
            releasesPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
            panelSearchInput.focus();
        }
    }

    // Close side panel
    function closePanel() {
        if (releasesPanel) {
            releasesPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Handle panel search
    function handlePanelSearch(e) {
        searchQuery = e.target.value.toLowerCase();
        renderPanelGrid();
    }

    // Handle panel filter button click
    function handlePanelFilterClick(e) {
        const btn = e.target;
        panelFilter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderPanelGrid();
    }

    // Handle panel sort
    function handlePanelSort(e) {
        // Handle both native select and custom select events
        panelSort = e.detail ? e.detail.value : e.target.value;
        renderPanelGrid();
    }

    // Render panel grid (All releases)
    function renderPanelGrid() {
        if (!releasesPanelGrid) return;

        // Filter releases
        filteredReleases = allReleases.filter(release => {
            // Type filter
            if (panelFilter !== 'all' && release.type !== panelFilter) {
                return false;
            }

            // Search filter
            if (searchQuery) {
                const searchableText = `${release.title} ${release.titleEn} ${release.artist}`.toLowerCase();
                if (!searchableText.includes(searchQuery)) {
                    return false;
                }
            }

            return true;
        });

        // Sort releases
        switch (panelSort) {
            case 'latest':
                filteredReleases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'oldest':
                filteredReleases.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
                break;
            case 'popularity':
                filteredReleases.sort((a, b) => a.popularity - b.popularity);  // Lower number = higher popularity (ranking system)
                break;
            case 'title':
                filteredReleases.sort((a, b) => a.titleEn.localeCompare(b.titleEn));
                break;
        }

        // Render
        if (filteredReleases.length === 0) {
            releasesPanelGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: var(--text-gray);">
                    <p>No releases found.</p>
                </div>
            `;
        } else {
            releasesPanelGrid.innerHTML = filteredReleases.map(release => createPanelReleaseCard(release)).join('');
        }
    }

    // Create release card for panel grid
    function createPanelReleaseCard(release) {
        const formattedDate = formatDate(release.releaseDate);
        const typeLabel = release.type.charAt(0).toUpperCase() + release.type.slice(1);
        const albumName = release.albumName || '-';

        return `
            <div class="panel-release-card">
                <div class="panel-release-cover">
                    <img alt="${release.title}" src="${release.coverImage}" loading="lazy" width="300" height="300"/>
                </div>
                <div class="panel-release-details">
                    <h4>${release.title}</h4>
                    <p class="artist">${release.artist}</p>
                    <p class="album-name">${albumName}</p>
                    <p class="date">${formattedDate}</p>
                    <span class="type-badge">${typeLabel}</span>
                </div>
            </div>
        `;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

