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

    /**
     * 초기화
     */
    init() {}

    /**
     * 탭 제거
     */
    destroy() {}

    /**
     * 탭 아이템 오픈
     */
    open() {}

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

    _initOptions() {}

    /**
     * 탭 이벤트 초기화
     */
    _initEvents() {}

    /**
     * 탭 열기
     */
    _open() {}

    /**
     * 탭 닫기
     */
    _close() {}
}

export default tabs;
