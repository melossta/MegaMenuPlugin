// import Plugin from 'src/plugin-system/plugin.class';
//
// export default class MegaMenuAjaxPlugin extends Plugin {
//     init() {
//         this._onEnter = this._onEnter.bind(this);
//
//         // Each top-level <li> we modified has this data attribute
//         const items = this.el.querySelectorAll('.nav-item[data-mega-menu-cat-id]');
//         items.forEach(item => {
//             item.addEventListener('mouseenter', this._onEnter);
//             item.addEventListener('focusin', this._onEnter);
//         });
//     }
//
//     async _onEnter(event) {
//         const li = event.currentTarget.closest('.nav-item[data-mega-menu-cat-id]');
//         if (!li) return;
//
//         const categoryId = li.dataset.megaMenuCatId;
//         const content = li.querySelector('.js-mega-menu-content');
//         if (!content || content.dataset.loaded === 'true') return;
//
//         try {
//             const res = await fetch(`/navigation/${categoryId}?depth=1`, {
//                 headers: { 'Accept': 'application/json' }
//             });
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
//             const data = await res.json();
//
//             const nodes = Array.isArray(data) ? data : (data.children || data.categories || []);
//             content.innerHTML = this._renderGrid(nodes);
//             content.dataset.loaded = 'true';
//         } catch (err) {
//             console.error('MegaMenu AJAX error', err);
//             content.innerHTML = `<div class="text-muted small">Couldn’t load menu.</div>`;
//         }
//     }
//
//
//     _renderGrid(children) {
//         if (!Array.isArray(children) || !children.length) {
//             return `<div class="text-muted small">No subcategories.</div>`;
//         }
//
//         return `
//             <div class="mega-menu-grid">
//                 ${children.map(c => {
//             const name = this._escape(c?.translated?.name || c?.name || '');
//             const url = this._buildUrl(c);
//             return `
//                         <div class="mega-menu-item">
//                             <a href="${url}">${name}</a>
//                         </div>
//                     `;
//         }).join('')}
//             </div>
//         `;
//     }
//
//     _buildUrl(cat) {
//         const raw =
//             (cat?.seoUrls && cat.seoUrls[0]?.seoPathInfo) ||
//             cat?.seoPathInfo ||
//             cat?.seoUrl ||
//             cat?.url ||
//             '';
//
//         if (!raw) return '#';
//         return raw.startsWith('http') || raw.startsWith('/') ? raw : `/${raw}`;
//     }
//
//     _escape(str) {
//         const div = document.createElement('div');
//         div.innerText = String(str);
//         return div.innerHTML;
//     }
// }
// src/Resources/app/storefront/src/plugin/ajax-loader.plugin.js










// //THISS WAS WORKING WITH FETCHINIG IT EVERYTIME THE MOSUE HOVERS
// import Plugin from 'src/plugin-system/plugin.class';
//
// export default class MegaMenuAjaxPlugin extends Plugin {
//     init() {
//         this._onEnter = this._onEnter.bind(this);
//
//         // All <li> that we extended with mega-menu support
//         const items = this.el.querySelectorAll('.nav-item[data-mega-menu-cat-id]');
//         items.forEach(item => {
//             item.addEventListener('mouseenter', this._onEnter);
//             item.addEventListener('focusin', this._onEnter);
//         });
//     }
//
//     async _onEnter(event) {
//         const li = event.currentTarget.closest('.nav-item[data-mega-menu-cat-id]');
//         if (!li) return;
//
//         const categoryId = li.dataset.megaMenuCatId;
//         const rootId = li.dataset.megaMenuRootId; // we add this in Twig
//         const content = li.querySelector('.js-mega-menu-content');
//         if (!content || content.dataset.loaded === 'true') return;
//
//         try {
//             content.innerHTML = '<div class="mega-menu-loading">Loading...</div>';
//
//             // Call the store-api navigation endpoint
//             const res = await fetch(`/store-api/navigation/${categoryId}/${categoryId}?depth=1`, {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'sw-access-key': window.salesChannelAccessKey
//                 },
//             });
//
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
//             const children = await res.json(); // array of subcategories
//
//             content.innerHTML = this._renderGrid(children);
//         } catch (err) {
//             console.error('MegaMenu AJAX error', err);
//             content.innerHTML = `<div class="text-muted small">Couldn’t load menu.</div>`;
//         }
//     }
//
//     _renderGrid(children) {
//         if (!Array.isArray(children) || !children.length) {
//             return `<div class="text-muted small">No subcategories.</div>`;
//         }
//
//         return `
//         <div class="mega-menu-grid">
//             ${children.map(c => {
//             const name = this._escape(c?.translated?.name || c?.name || '');
//             const url = this._buildUrl(c);
//             const img = c.media?.url
//                 ? `<img src="${c.media.url}" alt="${name}" class="mega-menu-thumb">`
//                 : '';
//             return `
//                     <div class="mega-menu-item">
//                         <a href="${url}">
//                             ${img}
//                             <span>${name}</span>
//                         </a>
//                     </div>
//                 `;
//         }).join('')}
//         </div>
//     `;
//     }
//
//
//     _buildUrl(cat) {
//         const raw =
//             (cat?.seoUrls && cat.seoUrls[0]?.seoPathInfo) ||
//             cat?.seoPathInfo ||
//             cat?.seoUrl ||
//             cat?.url ||
//             '';
//
//         if (!raw) return '#';
//         return raw.startsWith('http') || raw.startsWith('/') ? raw : `/${raw}`;
//     }
//
//     _escape(str) {
//         const div = document.createElement('div');
//         div.innerText = String(str);
//         return div.innerHTML;
//     }
// }
import Plugin from 'src/plugin-system/plugin.class';

export default class MegaMenuAjaxPlugin extends Plugin {
    init() {
        this._onEnter = this._onEnter.bind(this);

        // Attach only to the TOP-LEVEL LINKS (<a>) so moving inside dropdown won’t retrigger
        const items = this.el.querySelectorAll('.nav-item[data-mega-menu-cat-id] > a');
        items.forEach(item => {
            // Trigger only once per category
            item.addEventListener('mouseenter', this._onEnter, { once: true });
            item.addEventListener('focusin', this._onEnter, { once: true });
        });
    }

    async _onEnter(event) {
        const li = event.currentTarget.closest('.nav-item[data-mega-menu-cat-id]');
        if (!li) return;

        const categoryId = li.dataset.megaMenuCatId;
        const content = li.querySelector('.js-mega-menu-content');

        if (!content || content.dataset.loaded === 'true') return;

        try {
            content.innerHTML = '<div class="mega-menu-loading">Loading...</div>';

            const res = await fetch(`/store-api/navigation/${categoryId}/${categoryId}?depth=1`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'sw-access-key': window.salesChannelAccessKey
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const children = await res.json();

            content.innerHTML = this._renderGrid(children);
            content.dataset.loaded = 'true';

        } catch (err) {
            console.error('MegaMenu AJAX error', err);
            content.innerHTML = `<div class="text-muted small">Couldn’t load menu.</div>`;
        }
    }

    // _renderGrid(children) {
    //     if (!Array.isArray(children) || !children.length) {
    //         return `<div class="text-muted small">No subcategories.</div>`;
    //     }
    //
    //     return `
    //     <div class="mega-menu-grid">
    //         ${children.map(c => {
    //         const name = this._escape(c?.translated?.name || c?.name || '');
    //         const url = this._buildUrl(c);
    //         const img = c.media?.url
    //             ? `<img src="${c.media.url}" alt="${name}" class="mega-menu-thumb">`
    //             : '';
    //         return `
    //                 <div class="mega-menu-item">
    //                     <a href="${url}">
    //                         ${img}
    //                         <span>${name}</span>
    //                     </a>
    //                 </div>
    //             `;
    //     }).join('')}
    //     </div>
    //     `;
    // }
    _renderGrid(children) {
        if (!Array.isArray(children) || !children.length) {
            return `<div class="text-muted small">No subcategories.</div>`;
        }

        const itemsPerCol = 3; // 👈 change this number for different column size
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
            const url = this._buildUrl(c);
            const img = c.media?.url
                ? `<img src="${c.media.url}" alt="${name}" class="mega-menu-thumb">`
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

