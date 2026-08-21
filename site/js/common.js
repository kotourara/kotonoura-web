(() => {
    "use strict";

    const NAV_ITEMS = [
        { id: "gallery", label: "作品", href: "gallery.html" },
        { id: "order", label: "ご依頼", href: "order.html" },
        { id: "music", label: "音楽", href: "music.html" },
        { id: "diary", label: "日記", href: "diary.html" },
        { id: "profile", label: "人物", href: "profile.html" }
    ];

    const ICON_BASE = "images/top/contents";
    const PRESS_SELECTOR = ".site-header__logo, .site-nav__item";

    function createNavItem(item, isCurrent) {
        const currentAttribute = isCurrent ? ' aria-current="page"' : "";
        const currentClass = isCurrent ? " is-current" : "";

        return `
            <a class="site-nav__item${currentClass}" href="${item.href}"${currentAttribute}>
                <span class="site-nav__icon" aria-hidden="true">
                    <span class="site-nav__icon-part site-nav__icon-part--pic"
                        style="mask-image:url('${ICON_BASE}/icon-${item.id}-pic.svg');-webkit-mask-image:url('${ICON_BASE}/icon-${item.id}-pic.svg');"></span>
                    <span class="site-nav__icon-part site-nav__icon-part--odd"
                        style="mask-image:url('${ICON_BASE}/icon-${item.id}-odd.svg');-webkit-mask-image:url('${ICON_BASE}/icon-${item.id}-odd.svg');"></span>
                    <span class="site-nav__icon-part site-nav__icon-part--even"
                        style="mask-image:url('${ICON_BASE}/icon-${item.id}-even.svg');-webkit-mask-image:url('${ICON_BASE}/icon-${item.id}-even.svg');"></span>
                </span>
                <span class="visually-hidden">${item.label}</span>
            </a>
        `;
    }

    function renderHeader() {
        const mount = document.getElementById("site-header");
        if (!mount || mount.dataset.rendered === "true") return;

        const currentPage = document.body.dataset.page || "";
        const activeIndex = Math.max(0, NAV_ITEMS.findIndex((item) => item.id === currentPage));
        const currentItem = NAV_ITEMS[activeIndex] || NAV_ITEMS[0];

        mount.className = "site-header";
        mount.innerHTML = `
            <div class="site-header__frame">
                <div class="site-header__inner">
                    <a class="site-header__logo" href="index.html" aria-label="琴ノ裏工房 トップへ">
                        <span class="site-header__logo-mask" aria-hidden="true"
                            style="mask-image:url('images/top/top-logo.svg');-webkit-mask-image:url('images/top/top-logo.svg');"></span>
                    </a>

                    <nav class="site-nav" aria-label="主要メニュー"
                        style="--nav-count:${NAV_ITEMS.length}; --active-index:${activeIndex};">
                        <div class="site-nav__items">
                            ${NAV_ITEMS.map((item) => createNavItem(item, item.id === currentPage)).join("")}
                        </div>
                        <div class="site-nav__underline" aria-hidden="true"></div>
                        <div class="site-nav__current" aria-hidden="true">
                            <span class="site-nav__current-label">${currentItem.label}</span>
                        </div>
                    </nav>
                </div>
            </div>
        `;

        mount.dataset.rendered = "true";
        bindHeaderPressFeedback(mount);
    }

    function bindHeaderPressFeedback(mount) {
        if (!mount || mount.dataset.pressFeedbackBound === "true") return;

        let pressed = null;

        const clearPressed = () => {
            if (!pressed) return;
            pressed.classList.remove("is-pressing");
            pressed = null;
        };

        mount.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) return;
            const target = event.target.closest(PRESS_SELECTOR);
            if (!target) return;
            clearPressed();
            pressed = target;
            target.classList.add("is-pressing");
        });

        window.addEventListener("pointerup", clearPressed, { passive: true });
        window.addEventListener("pointercancel", clearPressed, { passive: true });
        window.addEventListener("blur", clearPressed);
        window.addEventListener("pageshow", clearPressed);
        mount.dataset.pressFeedbackBound = "true";
    }

    function renderFooter() {
        const mount = document.getElementById("site-footer");
        if (!mount || mount.dataset.rendered === "true") return;

        mount.className = "site-footer";
        mount.innerHTML = `
            <div class="site-footer__frame">
                <div class="site-footer__inner">
                    <img class="site-footer__back" src="images/common/footer-bg.webp" alt="" loading="lazy" decoding="async">
                    <img class="site-footer__front" src="images/common/footer-front.webp" alt="" loading="lazy" decoding="async">
                    <p class="site-footer__copyright">©2026 琴ノ裏工房</p>
                </div>
            </div>
        `;

        mount.dataset.rendered = "true";
    }

    function init() {
        renderHeader();
        renderFooter();
        document.dispatchEvent(new CustomEvent("common:ready"));
    }

    init();
})();
