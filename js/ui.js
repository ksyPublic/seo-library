import { accordion, tabs } from './main.js';

accordion.GLOBAL_CONFIG = {
    activeClass: 'is-active'
};

tabs.GLOBAL_CONFIG = {
    activeClass: 'is-active'
};

const UIInitializer = (target, UI, options = {}) => {
    const elements = document.querySelectorAll(target);
    elements.forEach((el) => {
        if (!UI.getInstance(el)) {
            const ui = new UI(el, options);
            ui.init();
        }
    });
};

const initialize = () => {
    // 아코디언
    UIInitializer('[data-ui-accordion]', accordion);

    // 탭
    UIInitializer('[data-ui-accordion]', tabs);

    return 'initialized';
};

document.addEventListener('DOMContentLoaded', function () {
    initialize();
});

const ui = {
    accordion,
    tabs
};
window.ui = { ...ui };
