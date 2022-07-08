import EventHandler from '../_dependencyvendor/event-handler';

/**
 * 펼치지 헬퍼 함수
 * data-expand="클래스 이름"
 * data-expand-target="펼칠 컨텐츠 셀렉터"
 */
export const expandHelper = () => {
  const elements = document.querySelectorAll('[data-expand]');
  elements.forEach(element => {
    if (!element.getAttribute('data-expand-initialize')) {
      element.setAttribute('data-expand-initialize', 'true');
      const className = element.getAttribute('data-expand');
      const contentName = element.getAttribute('data-expand-target');
      const content = document.querySelector(contentName);
      EventHandler.on(element, 'click', e => {
        if (element.classList.contains(className)) {
          element.classList.remove(className);
          // eslint-disable-next-line no-unused-vars
          const reflow = content.offsetHeight;
          content.style.height = ``;
          content.classList.remove(className);
        } else {
          element.classList.add(className);
          content.classList.add(className);
          content.style.height = `${content.scrollHeight}px`;
        }
        e.preventDefault();
      });
    }
  });
};

/**
 * 토글 클래스 헬퍼 함수
 * data-toggle-class="클래스 이름"
 * data-toggle-target="컨텐츠 셀렉터"
 * 컨텐츠를 선언하면 컨텐츠에도 함께 토글 클래스가 생성 됨
 */
export const toggleHelper = () => {
  const elements = document.querySelectorAll('[data-toggle-class]');
  elements.forEach(element => {
    if (!element.getAttribute('data-toggle-initialize')) {
      element.setAttribute('data-toggle-initialize', 'true');

      const toggleClassName = element.getAttribute('data-toggle-class');
      const contentName = element.getAttribute('data-toggle-target');
      const contents = [];
      // 컨텐츠가 여러개 라면..
      if (contentName.indexOf('|')) {
        const contentNames = contentName.split(`|`);
        contentNames.forEach(c => {
          const content = document.querySelector(c);
          if (!content) {
            throw Error(`content를 찾을 수 없습니다.: ${c}`);
          }
          contents.push(content);
        });
      } else {
        const content = document.querySelector(contentName);
        if (!content) {
          throw Error(`content를 찾을 수 없습니다.: ${c}`);
        }
        contents.push(content);
      }

      EventHandler.on(element, 'click', e => {
        e.preventDefault();
        const target = e.currentTarget;
        if (target.classList.contains(toggleClassName)) {
          if (contents.length > 0) {
            contents.forEach(c => {
              c.classList.remove(toggleClassName);
            });
          }
          target.classList.remove(toggleClassName);
        } else {
          target.classList.add(toggleClassName);
          if (contents.length > 0) {
            contents.forEach(c => {
              c.classList.add(toggleClassName);
            });
          }
        }
      });
    }
  });
};
