import UI from '../../base/ui-base.js';
import EventHandler from '../../_dependencyvendor/event-handler.js';
// eslint-disable-next-line no-unused-vars
import { dataSetToObject, isVisible } from '../../util/dom-util.js';

// eslint-disable-next-line no-unused-vars
const VERSION = '1.0.0';
const NAME = 'ui.accordion';
const ARIA_CONTROLS = 'aria-controls';

/**
 * data 속성으로 가능한 옵션들
 */
const dataAttrOptions = {
    defaultsOpen: '',
    openClass: 'open',
    toggle: true,
    multiple: true,
    animate: true
};

const defaultOptions = {
    ...dataAttrOptions,
    className: {
        expand: 'expand',
        expanding: 'expanding',
        expanded: 'expanded'
    }
};

class Accordion extends UI {
    /**
     * 아코디언 생성자
     * @param {*} element 아코디언을 아이템을 포함하고있는 컨테이너
     * @param {*} options 아코디언 옵션
     */
    constructor(element, options = {}) {
        super(element, options);
        this._initOptions(options);
        this._animating = false;
        this._current = {
            tab: null,
            content: null
        };
        this._before = {
            tab: null,
            content: null
        };
    }

    /**
     * 아코디언 전역 옵션
     */
    static GLOBAL_OPTIONS = {};
    static DATA_NAME = 'accordion';

    /**
     * 아코디언 이벤트 네임
     */
    static get EVENT() {
        return {
            ALL: `eventAll.${NAME}`,
            OPEN: `open.${NAME}`,
            OPENED: `opened.${NAME}`,
            CLOSE: `close.${NAME}`,
            CLOSED: `closed.${NAME}`
        };
    }

    static get NAME() {
        return NAME;
    }

    static redraw() {
        const insList = Accordion.getInstances();
        if (insList.length > 0) {
            insList.forEach((ins) => {
                ins._defaultActive();
            });
        }
    }

    /**
     * 아코디언 초기화
     * @returns Accordion
     */
    init() {
        this._initEvents();
        this._current = null;
        this._before = null;
        this._defaultActive();
        return this;
    }

    /**
     * 아코디언 아이템 오픈
     * @param {*} target
     */
    open(target, force = false) {
        this._selectCurrent(target);
        this._open(force);
    }

    /**
     * 아코디언 아이템 전체 오픈
     */
    openAll() {
        // todo acc in acc 처리해야 함
        const headers = [...this._element.querySelectorAll(`[${ARIA_CONTROLS}]`)].reverse();
        headers.forEach((header) => {
            this.open(header);
            this._animating = false;
        });
        this._selectCurrent(headers[0]);
    }

    /**
     * 아코디언 아이템 닫기
     * @param {*} target
     */
    close(target) {
        console.log('target: ', target);
        this._selectCurrent(target);
        this._close();
    }

    /**
     * 아코디언 아이템 전체 닫기
     */
    closeAll() {
        // todo acc in acc 처리해야 함
        const headers = [...this._element.querySelectorAll(`[${ARIA_CONTROLS}]`)].reverse();
        headers.forEach((header, i) => {
            this._close({
                header,
                content: this._getContent(header)
            });
            this._animating = false;
        });
    }

    getElement() {
        return this._element;
    }

    /**
     * 아코디언 삭제
     */
    destroy() {
        this._removeEvents();
        this._removeAttributes();
    }

    /**
     * @private
     * defaultActive Open
     * defaultActive 옵션 사용 시 openClass 이름으로 open은 처리가 되지 않는다.
     * @returns
     */
    _defaultActive() {
        if (this._options.defaultsOpen !== '') {
            const headerIndexList = this._options.defaultsOpen.split(',');
            [...headerIndexList].forEach((n) => {
                this.open(n);
                this._animating = false;
            });
            return;
        }

        const headers = this._element.querySelectorAll(`[${ARIA_CONTROLS}]`);
        headers.forEach((el) => {
            if (el.classList.contains(this._options.openClass)) {
                this.open(el, true);
                this._animating = false;
            }
        });
    }

    /**
     * @private
     * 아코디언 옵션 값 적용
     * @param {*} options
     */
    _initOptions(options) {
        this._options = {
            ...defaultOptions,
            ...Accordion.GLOBAL_OPTIONS,
            ...options,
            ...dataSetToObject(this._element, dataAttrOptions, Accordion.DATA_NAME)
        };
    }

    /**
     * @private
     * 아코디언 이벤트 초기화
     */
    _initEvents() {
        EventHandler.on(this._element, super._eventName('click'), (event) => {
            if (!event.target.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON|LABEL/gim)) {
                event.preventDefault();
            }
            const { toggle, openClass } = this._options;
            const target = event.target.closest(`[${ARIA_CONTROLS}]`);
            if (target) {
                this._current = {
                    header: target,
                    content: this._getContent(target)
                };

                if (toggle) {
                    if (this._current.header.classList.contains(openClass)) {
                        this._close(this._current);
                    } else {
                        this._open();
                    }
                } else {
                    if (!this._current.header.classList.contains(openClass)) {
                        this._open();
                    }
                }
            }
        });
    }

    /**
     * @private
     * 아코디언 이벤트 삭제
     * @returns void
     */
    _removeEvents() {
        EventHandler.off(this._element, super._eventName('click'));
    }

    /**
     * @private
     * 아코디언에 동적으로 적용했던 속성 삭제
     * @returns void
     */
    _removeAttributes() {
        const controls = this._element.querySelectorAll(`[${ARIA_CONTROLS}]`);
        const { openClass, className } = this._options;
        controls.forEach((el) => {
            const content = this._getContent(el);
            if (content) {
                if (content.classList.contains(className.expanded)) {
                    content.classList.remove(className.expanded);
                    content.setAttribute('aria-hidden', true);
                    content.setAttribute('tabIndex', -1);
                }
            }
            el.setAttribute('aria-expanded', false);
            if (el.classList.contains(openClass)) {
                el.classList.remove(openClass);
            }
        });
    }

    /**
     * @private
     * 아코디언 열기
     * @returns void
     */
    _open(force = false) {
        const { openClass, multiple, animate, className } = this._options;
        const possibleAnimation = isVisible(this._element);
        if (this._animating === true && animate === true) return;
        const { header, content } = this._current;
        if (force === false && header.classList.contains(openClass)) {
            this._animating = false;
            this._before = {
                header,
                content
            };
            return;
        }

        this._validationMatching();
        header.classList.add(openClass);
        this._dispatch(Accordion.EVENT.OPEN, {
            component: this,
            current: this._current,
            eventType: Accordion.EVENT.OPEN
        });
        EventHandler.trigger(document, Accordion.EVENT.ALL, {
            component: this,
            eventType: Accordion.EVENT.OPEN
        });
        if (animate && possibleAnimation) {
            this._animating = true;
            content.classList.add(className.expanding);
            content.classList.remove(className.expand);
            content.style.height = `${content.scrollHeight}px`;
            EventHandler.one(content, 'transitionend', () => {
                content.classList.remove(className.expanding);
                content.classList.add(className.expand);
                content.classList.add(className.expanded);
                content.style.height = '';
                this._animating = false;
                this._dispatch(Accordion.EVENT.OPENED, {
                    component: this,
                    current: this._current,
                    eventType: Accordion.EVENT.OPENED
                });
                EventHandler.trigger(document, Accordion.EVENT.ALL, {
                    component: this,
                    eventType: Accordion.EVENT.OPENED
                });
            });
        } else {
            content.classList.add(className.expanded);
            content.classList.add(className.expand);
            header.classList.add(openClass);
        }

        if (multiple !== true) {
            if (this._before && this._before.header !== this._current.header) {
                this._animating = false;
                this._close();
            }
        }

        this._before = {
            header,
            content
        };
        this._aria(this._current, true);
    }

    /**
     * @private
     * 아코디언 닫기
     * @param {*} target
     * @returns void
     */
    _close(target) {
        const { openClass, animate, className } = this._options;
        if (this._animating === true && animate === true) return;
        const closeTarget = !!target ? target : this._before;
        if (!closeTarget.header) return;
        const { header, content } = closeTarget;
        if (!header.classList.contains(openClass)) {
            this._animating = false;
            return;
        }
        header.classList.remove(openClass);
        this._dispatch(Accordion.EVENT.CLOSE, {
            component: this,
            current: closeTarget,
            eventType: Accordion.EVENT.CLOSE
        });
        EventHandler.trigger(document, Accordion.EVENT.ALL, {
            component: this,
            eventType: Accordion.EVENT.CLOSE
        });
        this._aria(closeTarget, false);
        if (animate) {
            this._animating = true;
            content.style.height = `${content.getBoundingClientRect().height}px`;
            content.heightCache = content.offsetHeight;
            content.style.height = ``;
            content.classList.add(className.expanding);
            content.classList.remove(className.expand);
            content.classList.remove(className.expanded);
            EventHandler.one(content, 'transitionend', () => {
                content.classList.remove(className.expanding);
                content.classList.add(className.expand);
                this._animating = false;
                this._dispatch(Accordion.EVENT.CLOSED, {
                    component: this,
                    current: closeTarget,
                    eventType: Accordion.EVENT.CLOSED
                });
                EventHandler.trigger(document, Accordion.EVENT.ALL, {
                    component: this,
                    eventType: Accordion.EVENT.CLOSED
                });
            });
            return;
        } else {
            content.classList.remove(className.expanding);
            content.classList.remove(className.expanded);
            content.classList.add(className.expand);
        }
    }

    /**
     * @private
     * aria 속성이 제대로 매칭되었는지 체크
     * @returns void
     */
    _validationMatching() {
        const { header, content } = this._current;
        const isHeaderMatched = header.getAttribute('id') === content.getAttribute('aria-labelledby');
        const isContentMatched = content.getAttribute('id') === header.getAttribute('aria-controls');
        // aria 속성이 일치하지 않을경우 Error로 처리한다.
        if (!isHeaderMatched || !isContentMatched) {
            const errorMessage = `
      id 값과 aria 속성의 값이 일치하지 않습니다.
      
      현재 선언되어 있는 속성 값
          header(id): ${header.getAttribute('id')}
          header(aria-controls): ${header.getAttribute('aria-controls')}
          content(id): ${content.getAttribute('id')}
          content(aria-labelledby): ${content.getAttribute('aria-labelledby')}
      
      이 문제를 해결하기 위해서 아래와 같아야 합니다.

        ${header.getAttribute('id') === content.getAttribute('aria-labelledby') ? '✅' : '❌'} ${header.getAttribute('id')}  === ${content.getAttribute('aria-labelledby')} 일치해야 합니다.
        ${content.getAttribute('id') === header.getAttribute('aria-controls') ? '✅' : '❌'} ${content.getAttribute('id')} === ${header.getAttribute('aria-controls')} 일치해야 합니다.
    `;
            super._throwError(`\n${errorMessage}`);
        }
    }

    /**
     * @private
     * 현제 아이템을 선택 _current에 할당
     * @param {*} target
     * @returns void
     */
    _selectCurrent(target) {
        // 인덱스
        if (!isNaN(target)) {
            const accHeaders = this._element.querySelectorAll(`[${ARIA_CONTROLS}]`);
            console.log(accHeaders, accHeaders[target]);
            this._current = {
                header: accHeaders[target],
                content: this._getContent(accHeaders[target])
            };
        } else {
            // 셀렉터 스트링
            if (typeof target === 'string') {
                const header = this._element.querySelector(target);
                this._current = {
                    header,
                    content: this._getContent(header)
                };
            } else {
                // 엘리먼트
                const tab = target.jquery ? target[0] : target;
                this._current = {
                    header: tab,
                    content: this._getContent(tab)
                };
            }
        }
    }

    /**
     * @private
     * 웹 접근성 aria 속성 및 tabindex 설정
     * @param {*} target
     * @param {*} isActive
     * @returns void
     */
    _aria(target, isActive = true) {
        const { toggle } = this._options;
        const { header, content } = target;
        const isSelected = isActive ? true : false;
        const isHidden = isActive ? false : true;
        const tabIndex = isActive ? 0 : -1;
        // header.setAttribute('tabIndex', tabIndex);
        header.setAttribute('aria-expanded', isSelected);
        if (toggle === false) {
            header.setAttribute('aria-disabled', isActive);
        }
        content.setAttribute('aria-hidden', isHidden);
        content.setAttribute('tabIndex', tabIndex);
    }
    /**
     * @private
     * acc header(aria-controls)에 선언 된 컨텐츠 찾아서 반환
     * @param {*} target
     * @returns
     */
    _getContent(target) {
        if (!target) super._throwError(`[${target}] not found!`);
        const contentName = target.getAttribute(ARIA_CONTROLS);
        const content = document.querySelector(`#${contentName}`);
        if (!content) {
            super._throwError(`[${contentName}] does not match any content element! `);
        }

        return content;
    }

    _dispatch(event, params) {
        EventHandler.trigger(this._element, event, params);
    }
}

export default Accordion;
