const userAgent = (window.navigator && window.navigator.userAgent) || '';
const isIe = userAgent.indexOf('MSIE ') > 0 || userAgent.indexOf('Trident/') > 0;
const isMobile = 'ontouchstart' in window;
const isIphone = /iphone/i.test(userAgent) && !iemobile;

export { userAgent, isIe, isMobile, isIphone };
