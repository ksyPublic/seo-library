import EventHandler from "../_dependencyvendor/event-handler";
import { focusableElements } from "./dom-util";
const confineTab = (el) => {
  const beforeFocused =
    (document.hasFocus() &&
      document.activeElement !== document.body &&
      document.activeElement !== document.documentElement &&
      document.activeElement) ||
    null;
  return {
    init: () => {
      EventHandler.off(el, "focusin.keydown");
      EventHandler.on(el, "focusin.keydown", (event) => {
        const focusEl = focusableElements(el);
        focusEl.forEach((el) => {
          EventHandler.off(el, "keydown.tab");
        });
        const first = focusEl[0];
        const last = focusEl[focusEl.length - 1];
        if (last === event.target) {
          EventHandler.on(last, "keydown.tab", (event) => {
            const keyCode = event.keyCode || event.which;
            if (keyCode === 9) {
              if (!event.shiftKey) {
                first.focus();
                event.preventDefault();
              }
            }
          });
        }
        if (first === event.target) {
          EventHandler.on(first, "keydown.tab", (event) => {
            const keyCode = event.keyCode || event.which;
            if (keyCode === 9) {
              if (event.shiftKey) {
                last.focus();
                event.preventDefault();
              }
            }
          });
        }
      });
      return focusableElements(el);
    },
    destroy: (autoComeback = true) => {
      EventHandler.off(el, "focusin.keydown");
      if (beforeFocused && autoComeback) beforeFocused.focus();
    },
  };
};

export { confineTab };
