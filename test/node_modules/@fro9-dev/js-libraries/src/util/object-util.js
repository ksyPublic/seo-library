/**
 * 빈 오브젝트 체크
 * @param {*} param
 * @returns
 */
export const isEmptyObject = param => {
  return Object.keys(param).length === 0 && param.constructor === Object;
};
