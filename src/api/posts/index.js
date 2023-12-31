//624 post 라우터 파리미터시
//const Router = require('koa-router');
//648 es모듈형태로 변경
import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();
//668 2번방식
//668 리팩토링
//668 라우터를 새로만들고, posts에 해당 라우터를 등록하는 방법
posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);

const post = new Router(); // /api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', postsCtrl.remove);
post.patch('/', postsCtrl.update);
posts.use('/:id', postsCtrl.checkObjectId, post.routes());

// //668 1번방식
// //668 OBjectID 검증 | 검증에 필요한 미들웨워 read, remove, update 추가
// posts.get('/', postsCtrl.list);
// posts.post('/', postsCtrl.write);
// posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
// posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
// posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);

//631
//만든 컨트롤러파일(라우트처리함수모아둔파일) 각라우트에 연결
//const 모듈이름 = require('파일이름')
//모듈이름.이름();
//requre('./posts.ctrl') --> 파일을 불러온다면 파일안에 있는 객체들을 불러오게 된다
//const postsCtrl = require('./posts.ctrl');

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

//파라미터 작업한 라우터 내보니기 --> 하단소스 적용으로 module.export = posts; 기존소스 삭제 기존631참고
//648 es모듈형태로 변경
export default posts;
