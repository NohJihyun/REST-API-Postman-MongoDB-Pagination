//[[컨트롤러파일]]
//컨트롤러 : 라우트 처리 함수들을 모아놓은 파일
let postId = 1; // id의 초깃값 입니다.

// posts 배열 초기 데이터
const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];
/* 포스트 작성 - 데이터등록
POST /api/posts
{title, body}
 */
//koa 미들웨워함수 라우트처리 함수
exports.write = (ctx) => {
  //REST API의 Request Body는 ctx.request.body에서 조회할수 있다
  const { title, body } = ctx.request.body; // 요청 서버에서 조회
  postId += 1; //기존 postId 값에 1을 더한다 = (postId = +1)
  const post = { id: postId, title, body };
  posts.push(post); //배열 초기데이터에 추가
  ctx.body = post; //ctx 웹요청 / 응답정보
};
/* 포스트 목록 조회 - 데이터조회
GET /api/posts
*/
//koa 미들웨워
exports.list = (ctx) => {
  ctx.body = posts;
};

/* 특정 포스터 조회
GET /api/posts/:id 
*/
//koa 미들웨워함수 라우트처리 함수
//URL파라미터
exports.read = (ctx) => {
  const { id } = ctx.params;
  //주어진 id 값으로 포스트를 찾는다
  //파라미터로 받아 온 값은(id) 문자열 형식이므로 파라미터를 숫자로 변환하거나 비교할 p.id 값을 문자열로 변경해야하 한다
  const post = posts.find((p) => p.id.toString() === id); // 파라미터로 받아온 값이 문자열 형식 p.id값을 문자열로 변경해서 비교한다.
  //포스트가 없으면 오류를 반환한다.
  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  ctx.body = post;
};
/* 특정 포스터 제거 
DELETE /api/posts/:id
*/
//koa 미들웨워함수 라우트처리 함수
//URL파라미터
exports.remove = (ctx) => {
  const { id } = ctx.params;
  //해당 id를 가진 post가 몇번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  // index번째 아이탬을 제거합니다
  posts.splice(index, 1);
  ctx.status = 204; // No Content
};
/* 포스트 수정(교체)
PUT /api/posts/:id
{title, body}
url파라미터 id 
PUT 메서드 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다
//koa 미들웨워함수 라우트처리 함수
*/
exports.replace = (ctx) => {
  //PUT 메서드 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용합니다
  const { id } = ctx.params;
  // 해당 id를 가진 post 데이터 등록이 몇 번째인지 확인합니다.
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류를 반환합니다
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  //전체 객체를 덮어 씌웁니다 따라서 id를 제외한 기본 정보를 날리고, 객체를 새로 만든다
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};
/* 포스트 수정(특정 필드 변경)
PATCH /api/posts/:id
{title, body}
URL파라미터
//koa 미들웨워함수 라우트처리 함수
*/
exports.update = (ctx) => {
  //PATH 메서드는 주어진 필드만 교체한다
  const { id } = ctx.params;
  //해당 id를 가진 post가 몇 번째인지 확인한다
  const index = posts.findIndex((p) => p.id.toString() === id);
  //포스트가 없으면 오류를 반환한다
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  //기존 값에 정보를 덮어 씌운다
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};
