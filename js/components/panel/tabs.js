import UI from '../../base/ui-base.js';
import EventHandler from '../../_dependencyvendor/event-handler.js';
// eslint-disable-next-line no-unused-vars
import { dataSetToObject, isVisible } from '../../util/dom-util.js';

const VERSION = '0.0.1';
const NAME = 'ui.tabs';
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

class tabs extends UI {
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

    getElement() {
        return this._element;
    }

    /**
     * 탭 전역 옵션
     */
    static GLOBAL_OPTIONS = {};
    static DATA_NAME = 'tabs';

    /**
     * 탭 이벤트 네임
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

    /**
     * 탭 초기화
     */
    init() {
        this._initEvents();
        this._current = null;
        this._before = null;
        this._defaultActive();
        return this;
    }

    /**
     * 탭 제거
     */
    destroy() {}

    /**
     * 탭 아이템 오픈
     */
    open() {
        this._open();
    }

    /**
     * 탭 아이템 전체 오픈
     */
    openAll() {}

    /**
     * 탭 아이템 닫기
     */
    close() {}

    /**
     * 탭 아이템 전체 닫기
     */
    closeAll() {}

    /**
     * 탭 옵션값 적용
     */

    _initOptions(options) {
        this._options = {
            ...defaultOptions,
            ...tabs.GLOBAL_OPTIONS,
            ...options,
            ...dataSetToObject(this._element, dataAttrOptions, tabs.DATA_NAME)
        };
    }

    /**
     * 탭 이벤트 초기화
     */
    _initEvents() {
        EventHandler.on(this._element, super._eventName('click'), (event) => {
            console.log('????', event);
        });
    }

    /**
     * 탭 열기
     */
    _open() {}

    /**
     * 탭 닫기
     */
    _close() {}

    /**
     * @private
     * defaultActive Open
     * defaultActive 옵션 사용 시 openClass 이름으로 open은 처리가 되지 않는다.
     * @returns
     */
    _defaultActive() {}
}

export default tabs;
