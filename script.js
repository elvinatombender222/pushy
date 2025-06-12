let currentDirectory = 'statuses';
let previousFiles = [];
let allStatusesData = [];
let currentGroupFilter = 'all';

const hamburgerIcon = document.getElementById('hamburger-icon');
const sideMenu = document.getElementById('side-menu');
const mainContentWrapper = document.getElementById('main-content-wrapper');
const appTitleElement = document.getElementById('app-title');
const viewSelector = document.getElementById('view-selector');
const deleteAllBtn = document.getElementById('delete-all-btn');
const actionTitle = document.querySelectorAll('.menu-section-title')[2]; // "Actions" title

function updateAppTitle(groupName) {
    let title = 'Pushy';
    if (currentDirectory === 'statuses/saved') title += ' - Archive';
    else if (currentDirectory === 'statuses/trash') title += ' - Trash';
    if (groupName && groupName !== 'all') title += ` - ${groupName}`;
    appTitleElement.textContent = title;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

hamburgerIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    hamburgerIcon.classList.toggle('open');
    mainContentWrapper.classList.toggle('menu-open');
});

document.addEventListener('click', (event) => {
    if (!sideMenu.contains(event.target) && !hamburgerIcon.contains(event.target) && sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
        hamburgerIcon.classList.remove('open');
        mainContentWrapper.classList.remove('menu-open');
    }
});

async function checkFlagFile() {
    const presenceIcon = document.getElementById('presence-icon');
    try {
        const response = await fetch(`/Pushy/on_the_road.flg?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache', 'Expires': '0' },
            cache: 'no-store'
        });
        presenceIcon.style.display = response.ok ? 'inline-block' : 'none';
    } catch {
        presenceIcon.style.display = 'none';
    }
}

viewSelector.addEventListener('change', () => {
    switchDirectory(viewSelector.value);
});

document.getElementById('group-filter').addEventListener('change', (event) => {
    currentGroupFilter = event.target.value;
    const text = event.target.options[event.target.selectedIndex].textContent;
    updateAppTitle(currentGroupFilter === 'all' ? null : text);
    updateContent(filterStatusesByGroup(allStatusesData, currentGroupFilter));
    sideMenu.classList.remove('open');
    hamburgerIcon.classList.remove('open');
    mainContentWrapper.classList.remove('menu-open');
});

function switchDirectory(directory) {
    currentDirectory = directory;
    viewSelector.value = directory;
    currentGroupFilter = 'all';
    document.getElementById('group-filter').value = 'all';
    updateViewVisibility();
    updateAppTitle(null);
    window.scrollTo(0, 0);
    loadStatuses();
    sideMenu.classList.remove('open');
    hamburgerIcon.classList.remove('open');
    mainContentWrapper.classList.remove('menu-open');
}

function updateViewVisibility() {
    const isTrash = currentDirectory === 'statuses/trash';
    deleteAllBtn.style.display = isTrash ? 'block' : 'none';
    if (actionTitle) actionTitle.style.display = isTrash ? 'block' : 'none';
}

function formatDateTime(epoch) {
    const date = new Date(epoch);
    return `${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}-${date.getFullYear()} ${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;
}

function createFlexContainer(data, file) {
    const epoch = parseInt(file.replace('.json', ''));
    const box = document.createElement('div');

    if (data.containerType === 'new_state' && data.details) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.details;
        const images = tempDiv.getElementsByTagName('img');
        for (let img of images) {
            const src = img.getAttribute('src');
            if (/\/[A-Z]{2}\.(webp|png)$/.test(src)) {
                data.containerType = 'new_county';
                break;
            }
        }
    }

    box.className = `flex-container ${data.containerType}`;
    box.dataset.filename = file;

    if (data.containerType === 'current_location') {
        box.innerHTML = `
            <div class="content-column">
                <div class="details">${data.details || ''}</div>
            </div>`;
        return box;
    }

    let innerHtml = '';

    if (data.containerType === 'routine' && data.image) {
        innerHtml += `
            <div class="image-column">
                <img src="./images/${data.image}?t=${Date.now()}">
            </div>`;
    }

    const source =
        currentDirectory === 'statuses/saved' ? 'saved' :
        currentDirectory === 'statuses/trash' ? 'trash' : 'statuses';

    let actionButtonsHTML = '';

    if (currentDirectory === 'statuses') {
        actionButtonsHTML = `
            <button class="delete-btn" onclick="moveJSON('${file}', 'trash', '${source}')">Delete</button>
            <button class="archive-btn" onclick="moveJSON('${file}', 'saved', '${source}')">Archive</button>`;
    } else if (currentDirectory === 'statuses/saved') {
        actionButtonsHTML = `
            <button class="delete-btn" onclick="moveJSON('${file}', 'trash', '${source}')">Delete</button>`;
    }

    innerHtml += `
        <div class="content-column">
            <div class="subtitle">${data.subtitle || ''}</div>
            <div class="details">${data.details || ''}</div>
            <div class="datetime">${formatDateTime(epoch)}</div>
        </div>
        <div class="action-buttons">
            ${actionButtonsHTML}
        </div>`;

    box.innerHTML = innerHtml;
    box.addEventListener('click', (event) => {
        const buttons = box.querySelector('.action-buttons');
        if (event.target.tagName !== 'BUTTON') {
            buttons.style.display = buttons.style.display === 'flex' ? 'none' : 'flex';
        }
    });
    return box;
}

function populateGroupFilter(statuses) {
    const select = document.getElementById('group-filter');
    const uniqueGroups = new Set();
    statuses.forEach(status => { if (status.data.group) uniqueGroups.add(status.data.group); });
    select.innerHTML = '<option value="all">All Groups</option>';
    Array.from(uniqueGroups).sort().forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        select.appendChild(option);
    });
    select.value = currentGroupFilter;
    updateAppTitle(currentGroupFilter === 'all' ? null : select.options[select.selectedIndex].textContent);
}

function filterStatusesByGroup(statuses, groupName) {
    if (groupName === 'all') return statuses;
    return statuses.filter(status => status.data.group === groupName);
}

async function updateContent(filteredStatuses) {
    const container = document.getElementById('status-container');
    container.innerHTML = '';

    const pinned = filteredStatuses.find(s => s.data.containerType === 'current_location');
    const rest = filteredStatuses.filter(s => s.data.containerType !== 'current_location');

    if (pinned) {
        const pinnedBox = createFlexContainer(pinned.data, pinned.file);
        container.appendChild(pinnedBox);
    }

    for (const { data, file } of rest) {
        const flex = createFlexContainer(data, file);
        container.appendChild(flex);
    }
}

async function loadStatuses() {
    try {
        const response = await fetch(`/Pushy/${currentDirectory}/?t=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache', 'Expires': '0' },
            cache: 'no-store'
        });
        const text = await response.text();
        const files = [...new Set(Array.from(text.matchAll(/(\d+\.json)/g)).map(m => m[1]))];
        files.sort((a, b) => parseInt(b) - parseInt(a));

        if (JSON.stringify(files) !== JSON.stringify(previousFiles)) {
            previousFiles = files;
            const fetchedData = await Promise.all(files.map(async (file) => {
                try {
                    const res = await fetch(`/Pushy/${currentDirectory}/${file}?t=${Date.now()}`, {
                        headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache', 'Expires': '0' },
                        cache: 'no-store'
                    });
                    const data = await res.json();
                    return { data, file };
                } catch (error) {
                    console.error(`Error fetching file ${file}:`, error);
                    return null;
                }
            }));
            allStatusesData = fetchedData.filter(Boolean);
            populateGroupFilter(allStatusesData);
            updateContent(filterStatusesByGroup(allStatusesData, currentGroupFilter));
        }
    } catch (error) {
        console.error(`Error loading statuses:`, error);
    }
}

async function moveJSON(filename, targetDir, source) {
    try {
        const response = await fetch('/Pushy/move_json.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            cache: 'no-store',
            body: new URLSearchParams({ action: targetDir, filename, source })
        });

        const result = await response.json();
        if (result.status === 'success') {
            await loadStatuses();
            const filtered = filterStatusesByGroup(allStatusesData, currentGroupFilter);
            if (filtered.length === 0 && currentGroupFilter !== 'all') {
                currentGroupFilter = 'all';
                document.getElementById('group-filter').value = 'all';
                updateAppTitle(null);
                updateContent(allStatusesData);
                showToast("Group is now empty — showing all");
            } else {
                updateContent(filtered);
            }
        } else {
            console.error('Error moving file:', result.message);
        }
    } catch (error) {
        console.error('Error moving file:', error);
    }
}

deleteAllBtn.addEventListener('click', async () => {
    if (currentDirectory !== 'statuses/trash') {
        showToast("Delete All only available in Trash view.");
        return;
    }

    const confirmDelete = confirm('Permanently delete all visible trash items?');
    if (!confirmDelete) return;

    const toDelete = filterStatusesByGroup(allStatusesData, currentGroupFilter);
    let successCount = 0;

    for (const status of toDelete) {
        try {
            const res = await fetch('/Pushy/move_json.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                cache: 'no-store',
                body: new URLSearchParams({ action: 'delete', filename: status.file, source: 'trash' })
            });
            const result = await res.json();
            if (result.status === 'success') successCount++;
        } catch (error) {
            console.error(`Error deleting file ${status.file}:`, error);
        }
    }

    if (successCount > 0) {
        showToast(`Permanently deleted ${successCount} item(s).`);
        await loadStatuses();
        const filtered = filterStatusesByGroup(allStatusesData, currentGroupFilter);
        if (filtered.length === 0 && currentGroupFilter !== 'all') {
            currentGroupFilter = 'all';
            document.getElementById('group-filter').value = 'all';
            updateAppTitle(null);
            updateContent(allStatusesData);
            showToast("Group is now empty — showing all");
        } else {
            updateContent(filtered);
        }
    } else {
        showToast("No items deleted or error occurred.");
    }

    sideMenu.classList.remove('open');
    hamburgerIcon.classList.remove('open');
    mainContentWrapper.classList.remove('menu-open');
});

loadStatuses();
checkFlagFile();
document.addEventListener('DOMContentLoaded', updateViewVisibility);
setInterval(() => {
    loadStatuses();
    checkFlagFile();
}, 5000);

