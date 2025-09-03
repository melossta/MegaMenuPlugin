// import Plugin from 'src/plugin-system/plugin.class';
//
// export default class MegaMenuAjaxLoader extends Plugin {
//     init() {
//         this.el.addEventListener('mouseenter', this.onHover.bind(this));
//     }
//
//     async onHover() {
//         const categoryId = this.el.dataset.categoryId;
//         const rootId = this.el.dataset.rootId;
//         const container = this.el.querySelector('.mega-menu-container');
//
//         if (!container || container.dataset.loaded === 'true') {
//             return;
//         }
//
//         try {
//             container.innerHTML = '<div class="mega-menu-loading">Loading...</div>';
//
//             const response = await fetch(`/store-api/navigation/${categoryId}/${rootId}?depth=1`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'sw-access-key': window.accessKey
//                 },
//                 method: 'POST'
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP ${response.status}`);
//             }
//
//             const data = await response.json();
//
//             // Find the hovered category node in the response
//             const node = data.find(cat => cat.id === categoryId);
//
//             const children = node && node.children ? node.children : [];
//
//             if (!children.length) {
//                 container.innerHTML = '<div class="mega-menu-empty">No subcategories</div>';
//                 return;
//             }
//
//             container.innerHTML = `
//             <div class="mega-menu-grid">
//                 ${children.map(child => `
//                     <div class="mega-menu-item">
//                         <a href="${child.seoUrl}">${child.translated.name}</a>
//                     </div>
//                 `).join('')}
//             </div>
//         `;
//
//             container.dataset.loaded = 'true';
//         } catch (e) {
//             container.innerHTML = '<div class="mega-menu-error">Could not load menu</div>';
//             console.error('MegaMenu AJAX error:', e);
//         }
//     }
//
//
// }
