import { accordion } from './main.js';

accordion.GLOBAL_CONFIG = {
    activeClass: 'is-active'
};

const UIInitializer = (target, UI, options = {}) => {
    const elements = document.querySelectorAll(target);
    elements.forEach((el) => {
        if (!UI.getInstance(el)) {
            const ui = new UI(el, options);
            console.log('????', ui);
            ui.init();
        }
    });
};

const initialize = () => {
    // 아코디언
    UIInitializer('[data-ui-accordion]', accordion);

    return 'initialized';
};

document.addEventListener('DOMContentLoaded', function () {
    initialize();
});

const ui = {
    accordion
};
window.ui = { ...ui };
