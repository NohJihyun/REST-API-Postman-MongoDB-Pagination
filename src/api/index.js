//622 라우트 파일 따로 분리된 파일 라우트 모듈화
//require() 라이브러리 적용
//api라우트연결
//const Router = require('koa-router');
//api 라우트에 posts 만들어둔 라우트 연결
//const posts = require('./posts');
//648 es모듈형태로 변경
import Router from 'koa-router';
import posts from './posts';

const api = new Router();

//koa 미들웨워 함수를 이용한 라우트 설정
// api.get('/test', (ctx) => {
//   ctx.body = 'test 성공';
// });

api.use('/posts', posts.routes());

//라우터를 내보낸다 module.exports = api;
//648 es모듈형태로 변경
export default api;
