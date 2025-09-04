import Plugin from 'src/plugin-system/plugin.class';

export default class MegaMenuAjaxPlugin extends Plugin {
    init() {
        this._onEnter = this._onEnter.bind(this);

        const items = this.el.querySelectorAll('.nav-item[data-mega-menu-cat-id] > a');
        items.forEach(item => {
            item.addEventListener('mouseenter', this._onEnter, { once: true });
            item.addEventListener('focusin', this._onEnter, { once: true });
        });
    }

    async _onEnter(event) {
        const li = event.currentTarget.closest('.nav-item[data-mega-menu-cat-id]');
        if (!li) return;

        const categoryId  = li.dataset.megaMenuCatId;
        const accessKey   = li.dataset.swAccessKey;
        const itemsPerCol = parseInt(li.dataset.itemsPerCol, 10) || 3;
        const imageSize   = li.dataset.imageSize || 'm';
        const content     = li.querySelector('.js-mega-menu-content');

        if (!content || content.dataset.loaded === 'true') return;

        try {
            content.innerHTML = '<div class="mega-menu-loading">Loading...</div>';

            const res = await fetch(`/store-api/navigation/${categoryId}/${categoryId}?depth=1`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'sw-access-key': accessKey
                },
                body: JSON.stringify({
                    includes: {
                        category: ['id', 'name', 'translated', 'seoUrl', 'media'],
                        media: ['url', 'alt', 'title']
                    }
                })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const children = await res.json();

            content.innerHTML = this._renderGrid(children, itemsPerCol, imageSize);
            content.dataset.loaded = 'true';

        } catch (err) {
            console.error('MegaMenu AJAX error', err);
            content.innerHTML = `<div class="text-muted small">Couldn’t load menu.</div>`;
        }
    }

    _renderGrid(children, itemsPerCol = 3, imageSize = 'm') {
        if (!Array.isArray(children) || !children.length) {
            return `<div class="text-muted small">No subcategories.</div>`;
        }

        const columns = [];
        for (let i = 0; i < children.length; i += itemsPerCol) {
            columns.push(children.slice(i, i + itemsPerCol));
        }

        return `
        <div class="mega-menu-grid">
            ${columns.map(col => `
                <div class="mega-menu-column">
                    ${col.map(c => {
            const name = this._escape(c?.translated?.name || c?.name || '');
            const url  = this._buildUrl(c);
            const img  = c.media?.url
                ? `<img src="${c.media.url}" alt="${name}" class="mega-menu-thumb mega-menu-thumb--${imageSize}" loading="lazy">`
                : '';
            return `
                            <div class="mega-menu-item">
                                <a href="${url}">
                                    ${img}
                                    <span>${name}</span>
                                </a>
                            </div>
                        `;
        }).join('')}
                </div>
            `).join('')}
        </div>
    `;
    }

    _buildUrl(cat) {
        const raw =
            (cat?.seoUrls && cat.seoUrls[0]?.seoPathInfo) ||
            cat?.seoPathInfo ||
            cat?.seoUrl ||
            cat?.url ||
            '';
        if (!raw) return '#';
        return raw.startsWith('http') || raw.startsWith('/') ? raw : `/${raw}`;
    }

    _escape(str) {
        const div = document.createElement('div');
        div.innerText = String(str);
        return div.innerHTML;
    }
}
