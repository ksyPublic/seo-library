/**
 * HTML스트링을 HTML형태로 반환
 * @param {String} htmlString
 * @return {Element}} 엘리먼트
 */
export const toHTML = (htmlString) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
};

/**
 * @param {String} 셀렉터 이름을 반환
 * @returns
 */
export const getSelectorName = (element) => {
    const names = element.className.split(' ');
    return `.${names.join('.')}`;
};

/**
 *
 * @param {*} element
 * @returns
 */
export const getIndex = (element) => {
    if (!element) {
        return -1;
    }
    let currentElement = element;
    let index = 0;
    while (currentElement.previousElementSibling) {
        index += 1;
        currentElement = currentElement.previousElementSibling;
    }
    return index;
};

/**
 * element visible check
 * @param element
 */
export const isVisible = (element) => {
    return element.clientWidth !== 0 && element.clientHeight !== 0 && element.style.opacity !== '0' && element.style.visibility !== 'hidden';

    // if (!isElement(element) || element.getClientRects().length === 0) {
    //   return false;
    // }
};

/**
 * element disable check
 * @param {*} element
 * @returns
 */
export const isDisabled = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }
    if (element.classList.contains('disabled')) {
        return true;
    }
    if (typeof element.disabled !== 'undefined') {
        return element.disabled;
    }
    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

/**
 * 엘리먼트에 선언되어있는 data attribute를 오브젝트 형태로 반환
 * UI 컴포넌트에서 data attribute로 속성 값 전달할 떄 사용
 * @param {*} element
 * @returns
 */
export const dataSetToObject = (element, dataAttrConfig, prefix = '') => {
    const config = {};
    for (const key in dataAttrConfig) {
        if (Object.prototype.hasOwnProperty.call(dataAttrConfig, key)) {
            const attrvalue = element.dataset[`${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`];
            if (attrvalue) {
                config[key] = attrvalue;
            }
        }
    }

    return config;
};

/**
 * target으로 받은 엘리먼트를 알아서 반환한다.
 * select, string 판단하여 적절하게..
 * @param {*} target
 */
export const getElement = (target) => {
    if (typeof target === 'string') {
        return document.querySelector(target);
    } else {
        if (target.jquery) {
            return target[0];
        } else {
            return target;
        }
    }
};

/**
 * 포커스 가능한 엘리먼트 반환
 * @param {*} element
 * @returns
 */
export const focusableElements = (element) => {
    const focusableElementSelectors = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]'];
    return [].concat(...Element.prototype.querySelectorAll.call(element, focusableElementSelectors.map((selector) => `${selector}:not([tabindex^="-"])`).join(', '))).filter((el) => !isDisabled(el) && isVisible(el));
};
