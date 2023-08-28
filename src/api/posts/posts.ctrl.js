//657 [[데이터베이스 데이터생성및등록]] -MonggoDB에 데이터 등록
import Post from '../../models/post';
//667 ObjectID 검증 | read, remove, update 세가지에서 검증이 필요한 상태 중복소스를 미들웨워로 만들어서 처리
import mongoose from 'mongoose';
//669 if문 대신 수월하게 joi 사용해서 객체를 검증하기 [Request Body]
import Joi from 'joi';

const { ObjectId } = mongoose.Types;
//667 ObjectID 검증 중복소스 미들웨워함수로 처리
export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

//658 블로그 포스터 작성하는 API인 write
/* POST /api/posts
  {
    title: '제목',
    body: '내용',
    tags:['태그1','태그2']
  }
  //669 Request Body검증 |write,update api에서 전달받은 요청 내용을 검증하는 방법
  //669 객체를 검증하기 위해 각 값을 if문으로 비교하는 방법도 있지만, joi라이브러리를 사용하여 수월하게 로직작성
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), //required() 가 있으면 필수항목
    body: Joi.string().required(),
    tags: Joi.array() //문자열로 이루어진 배열
      .items(Joi.string())
      .required(),
  });
  //검증하고 나서 검증 실패인 경우 에러처리
  //validate 입증하다,인증하다,승인하다
  // const result = schema.validate(ctx.request.body);
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //bad Request
    ctx.body = result.error;
    return;
  }
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save(); // 데이터베이스에 저장
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* 
  GET /api/posts 
  데이터 조회
  //676 페이지네이션 역순으로 불러오기
  //676 sort() 정렬(sorting)할 필드를 설정하는 부분 오른쪽 값을 1로 설정하면 오름차순, -1 설정하면 내림차순으로 정렬된다.
  //676 {key:1}
  //677 skip 페이지 기능 구현
  //679 마지막페이지 번호 알림
  //680 내용길이제한 | body의 길이가 200자 이상이면 뒤에 '...' 붙이고 문자열을 자르는 기능구현
  //680 find()를 통해서 조회한 데이터는 mongoose 문서 인스턴스의 형태이므로 테이터를 변형할수 없다 JSON형태로 변환뒤 필요한 데이터 변형을 일으킨다.
  //681 JSON 형태로 변환 데이터변형방법 | 2. 데이터조회 lean()함수를 사용 처음부터 json형태로 데이터 조회
*/
export const list = async (ctx) => {
  //677 skip query는 문자열이기 때문에 숫자를 변환해 주어야 합니다.
  //677 skip 값이 주어지지 않았다면 1을 기본으로 사용한다
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10) //677 skip기능
      .lean() //681 json형태로 처음부터 데이터 조회한다
      .exec(); // 모델 인스턴스 Post의 find()함수를 이용해서 데이터를 조회 | exec() 사용해서 서버에 쿼리를 요청한다.
    const postCount = await Post.countDocuments().exec(); //679 마지막페이지 번호 알림
    ctx.set('Last-Page', Math.ceil(postCount / 10)); //679 마지막페이지 번호 알림
    //681 json형태로 처음부터 데이터 조회한후 데이터 변형
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* 
  GET /api/posts/:id
  특정 포스트를 id로 찾아서 조회 
*/
export const read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec(); //특정id를 가진 데이터를 조회 | 서버에 쿼리를 요청한다.
    if (!post) {
      ctx.status = 404; // not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
/*
  DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec(); //Post 모델객체의 findByIdAndRemove(id) 특정id찾기 | exex 서버의 쿼리요청
    ctx.status = 204; // No Content (성공하였지만 응답할 데이터가 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* 
  PATCH /api/posts/:id
  {
    title: '수정',
    body: ' 수정 내용',
    tags: ['수정', '태그']
  }
  //671 joi를 사용하여 request.body 요청 검증
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  //write에서 사용한 schema와 비슷한데, required()가 없다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  //검증한뒤, 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //bad Request
    ctx.body = result.error;
    return;
  }
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      //첫번째 파라 id , 두번째 파라 업데이트내용, 세번째 파라 업데이트 옵션
      new: true, //이값을 설정하면 업데이트된 데이터를 반환한다 | false일 때는 업데이트 되기전에 데이터를 반환합니다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// 657 데이터베이스 데이터생성및 등록으로 인해 하단 앞전에 학습한 내용은 주석처리함
// //[[컨트롤러파일]]
// //컨트롤러 : 라우트 처리 함수들을 모아놓은 파일
// let postId = 1; // id의 초깃값 입니다.

// // posts 배열 초기 데이터
// const posts = [
//   {
//     id: 1,
//     title: '제목',
//     body: '내용',
//   },
// ];
// /* 포스트 작성 - 데이터등록
// POST /api/posts
// {title, body}
//  */
// //koa 미들웨워함수 라우트처리 함수
// //648 es모듈형태로 변경
// export const write = (ctx) => {
//   //exports.write = (ctx) => {
//   //REST API의 Request Body는 ctx.request.body에서 조회할수 있다
//   const { title, body } = ctx.request.body; // 요청 서버에서 조회
//   postId += 1; //기존 postId 값에 1을 더한다 = (postId = +1)
//   const post = { id: postId, title, body };
//   posts.push(post); //배열 초기데이터에 추가
//   ctx.body = post; //ctx 웹요청 / 응답정보
// };
// /* 포스트 목록 조회 - 데이터조회
// GET /api/posts
// */
// //koa 미들웨워
// //648 es모듈형태로 변경
// export const list = (ctx) => {
//   ctx.body = posts;
// };

// /* 특정 포스터 조회
// GET /api/posts/:id
// */
// //koa 미들웨워함수 라우트처리 함수
// //URL파라미터
// //648 es모듈형태로 변경
// export const read = (ctx) => {
//   const { id } = ctx.params;
//   //주어진 id 값으로 포스트를 찾는다
//   //파라미터로 받아 온 값은(id) 문자열 형식이므로 파라미터를 숫자로 변환하거나 비교할 p.id 값을 문자열로 변경해야하 한다
//   const post = posts.find((p) => p.id.toString() === id); // 파라미터로 받아온 값이 문자열 형식 p.id값을 문자열로 변경해서 비교한다.
//   //포스트가 없으면 오류를 반환한다.
//   if (!post) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   ctx.body = post;
// };
// /* 특정 포스터 제거
// DELETE /api/posts/:id
// */
// //koa 미들웨워함수 라우트처리 함수
// //URL파라미터
// //648 es모듈형태로 변경
// export const remove = (ctx) => {
//   const { id } = ctx.params;
//   //해당 id를 가진 post가 몇번째인지 확인합니다.
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   // index번째 아이탬을 제거합니다
//   posts.splice(index, 1);
//   ctx.status = 204; // No Content
// };
// /* 포스트 수정(교체)
// PUT /api/posts/:id
// {title, body}
// url파라미터 id
// PUT 메서드 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다
// //koa 미들웨워함수 라우트처리 함수
// */
// //648 es모듈형태로 변경
// export const replace = (ctx) => {
//   //PUT 메서드 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다
//   const { id } = ctx.params;
//   // 해당 id를 가진 post 데이터 등록이 몇 번째인지 확인합니다.
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   // 포스트가 없으면 오류를 반환합니다
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   //전체 객체를 덮어 씌웁니다 따라서 id를 제외한 기본 정보를 날리고, 객체를 새로 만든다
//   posts[index] = {
//     id,
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// };
// /* 포스트 수정(특정 필드 변경)
// PATCH /api/posts/:id
// {title, body}
// URL파라미터
// //koa 미들웨워함수 라우트처리 함수
// */
// //648 es모듈형태로 변경
// export const update = (ctx) => {
//   //PATH 메서드는 주어진 필드만 교체한다
//   const { id } = ctx.params;
//   //해당 id를 가진 post가 몇 번째인지 확인한다
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   //포스트가 없으면 오류를 반환한다
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   //기존 값에 정보를 덮어 씌운다
//   posts[index] = {
//     ...posts[index],
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// };
