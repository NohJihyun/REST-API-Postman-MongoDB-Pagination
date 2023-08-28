//데이터베이스
//[[스키마]]
//스키마: 컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체 [각정보의 대한 필드 이름과 데이터 타입]
import mongoose from 'mongoose';
//스키마 mongoose 모듈의 Schema마를 사용하여 정의
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String], // 문자열로 이루어진 배열
  publishedDate: {
    type: Date,
    default: Date.now, // 현재 날짜를 기본 값으로 지정
  },
});
//654 모델인스턴스를 만들기 (모델을 이용해서 데이터베이스 읽고/쓰기)
const Post = mongoose.model('Post', PostSchema); //첫번째 파라미터 스키마이름 두번째 파라미터 스키마객체
export default Post;
