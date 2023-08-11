//624 post 라우터 파리미터시
const Router = require('koa-router');

//const posts = new Router();

//631
//만든 컨트롤러파일(라우트처리함수모아둔파일) 각라우트에 연결
//const 모듈이름 = require('파일이름')
//모듈이름.이름();
//requre('./posts.ctrl') --> 파일을 불러온다면 파일안에 있는 객체들을 불러오게 된다
const postsCtrl = require('./posts.ctrl');
//631
const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.read);
posts.delete('/:id', postsCtrl.remove);
posts.put('/:id', postsCtrl.replace);
posts.patch('/:id', postsCtrl.update);

//미들웨워
//627 특정 경로에 미들웨워를 등록
//라우터 설정 ctx.body --> '문자열이아닌' , json 객체데리터를 반환하도록 만듬`
// const printInfo = (ctx) => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params,
//   };
// };

//posts 라우트에 여러종류의 라우트설정
//라우트 설정 url파리미터|쿼리 적용 | 두번째로 printInfo 함수를 호출하도록 설정
// posts.get('/', printInfo);
// posts.post('/', printInfo);
// posts.get('/:id', printInfo);
// posts.delete('/:id', printInfo);
// posts.put('/:id', printInfo);
// posts.patch('/:id', printInfo);

//파라미터 작업한 라우터 내보니기
module.exports = posts;
