//646 esm 라이브러리 적용
//646 기존 index.js를 main.js로 변경함
//646 index.js를 새로 생성함
//646 해당 파일에서 no-global-assign ESlint 옵션을 비활성화한다.
//646 eslint-disable no-global-assign

// eslint-disable-next-line no-global-assign
require = require('esm')(module /*, options*/);
module.exports = require('./main.js');
