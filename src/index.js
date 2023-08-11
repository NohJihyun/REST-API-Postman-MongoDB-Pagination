//607 .eslintrc.json 설정 하면 빨강줄 에러 사라짐
// " 쌍따옴표가 자동저장 될시 ' 홀따옴표로 저장
//const hello = 'hello';
//[[koa 기본 사용법 서버생성]]

//608 [[koa 미들웨워 사용법]]
//const koa = require('koa');
// const app = new koa();
// //서버 접속시 텍스트 반환
// //koa 애플리케이션은 미들웨워의 배열로 구성되어 있다 | app.use() 함수는 미들웨워 함수를 애플리케이션에서 등록한다.
// //미들웨워함수 구조 (ctx, next) => {} ctx Context 줄임말 웹 요청과 응답에 관한 정보 담당 next 현재 처리 중 미들웨워의 다음 미들웨워를 호출하는 함수

// //koa 미들웨워 현재 요청을 받은 주소와 / 우리가 정해 준 숫자를 기록하는 미들웨워
// app.use((ctx, next) => {
//   console.log(ctx.url);
//   console.log(1);
//   //조건부로 다음 미들웨워를 무시하게 적용
//   if (ctx.query.authorized !== '1') {
//     ctx.status = 401; // Unauthorized HTTP 401 무단 / 허용되지 않음
//     return;
//   }
//   //614 next()함수는 promise를 반환 promise는 다음 미들웨워가 끝나면 .then을 사용해 다음작업을 설정 콜백지옥 형성안됨
//   next().then(() => {
//     console.log('END');
//   });
// });
// app.use((ctx, next) => {
//   console.log(2);
//   next();
// });
// app.use((ctx) => {
//   ctx.body = 'hello world';
// });
// //4000번 포트 열기
// app.listen(4000, () => {
//   console.log('Listening to port 4000');
// });

//615
//[[kor 미들웨워에 async/await 문법적용]]
//const koa = require('koa');
//const app = new koa();
//서버 접속시 텍스트 반환
//koa 애플리케이션은 미들웨워의 배열로 구성되어 있다 | app.use() 함수는 미들웨워 함수를 애플리케이션에서 등록한다.
//미들웨워함수 구조 (ctx, next) => {} ctx Context 줄임말 웹 요청과 응답에 관한 정보 담당 next 현재 처리 중 미들웨워의 다음 미들웨워를 호출하는 함수

//koa 미들웨워 현재 요청을 받은 주소와 / 우리가 정해 준 숫자를 기록하는 미들웨워
//615 async/await 문법적용
//615 동일한 내용으로 2번째 미들웨워 작업이 끝날때까지 기달렸다가, 작업을 진행 promist.then() 과 동일
// app.use(async (ctx, next) => {
//   console.log(ctx.url);
//   console.log(1);
//   //조건부로 다음 미들웨워를 무시하게 적용
//   if (ctx.query.authorized !== '1') {
//     ctx.status = 401; // Unauthorized HTTP 401 무단 / 허용되지 않음
//     return;
//   }
//   //614 next()함수는 promise를 반환 promise는 다음 미들웨워가 끝나면 .then을 사용해 다음작업을 설정 콜백지옥 형성안됨
//   //615 await 문법사용
//   await next();
//   console.log('END');
// });
// app.use((ctx, next) => {
//   console.log(2);
//   next();
// });
// app.use((ctx) => {
//   ctx.body = 'hello world';
// });
//4000번 포트 열기

//[[618 koa Router 사용하기]]
//라이브러리적용
//[[623 서버의 메인라우터]]
const Koa = require('koa');
const Router = require('koa-router');
//[[627 컨트롤러파일작성-->라우트 처리함수 모아두기]]
const bodyParser = require('koa-bodyparser');

//623 라우트 모듈화된것 가져와서 적용시키기
const api = require('./api');
const app = new Koa();
const router = new Router();

// //라우트 설정 /
// router.get('/', (ctx) => {
//   ctx.body = '홈';
// });
// //라우트 설정 /about
// //라우트 파라미터 :name | 파라미터가 있을경우 없을경우 :name? 사용
// router.get('/about/:name?', (ctx) => {
//   //Url파라미터 값 react로 설정
//   const { name } = ctx.params; //설정한 url파라미터값을 ctx.params 객체에서 파라미터 조회할수있다
//   // name의 존재 유무에 따라 다른 결과 출력 삼항연산
//   ctx.body = name ? `${name}의 소개` : '소개';
// });
// //라우트 설정 /posts
// //쿼리
// router.get('/posts', (ctx) => {
//   //Url파라미터 값 react로 설정
//   const { id } = ctx.query; //쿼리
//   // id의 존재 유무에 따라 다른 결과 출력 삼항연산
//   ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다';
// });

//라우트 설정
//api폴더로 라우터 모듈화된것을 가져다 적용시키기
//api 적용시킬때는 routert.use() 사용한다
router.use('/api', api.routes()); //api 라우트 적용

//[[628 라우터 적용 전에 bodyPaser적용 --> 라우트처리함수 모으기: 컨트롤러]]
app.use(bodyParser());

//라우트 적용
//app 인스턴스에 라우터 적용 koa미들웨워 app.use
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
  console.log('Listening to port 4000');
});
