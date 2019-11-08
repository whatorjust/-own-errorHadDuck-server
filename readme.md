## 서버 SPEC

- 서버 : NodeJS (AWS EC2)
- 미들웨어 : Express, cors, body-parser, cookie-parser
- DB : mysql (AWS RDS-mysql)
- orm : sequelize
- 보안 : JWT , 유저정보 - crypto

## SERVER API

http://13.125.254.202:5000/

## CLIENT API

http://mysterious-journey.surge.sh

| http method |        endpoint        |             req(json)             | res(성공/실패)                  |                         detail                         | usage                           |         example         |     |
| ----------- | :--------------------: | :-------------------------------: | ------------------------------- | :----------------------------------------------------: | ------------------------------- | :---------------------: | --- |
| POST        |      /users/login      |        username, password         | 200/400                         |                         로그인                         | 로그인                          |                         |     |
| POST        |     /users/signup      |     username, email, password     | 200/400                         |                     회원가입 제출                      | 회원가입 제출                   |                         |     |
| GET         |         /posts         |                 -                 | 200/400                         |                본인의 모든 게시글 요청                 | 본인의 모든 게시글 요청         |                         |     |
| GET         | /posts?iscomplete=bool |                 -                 | 200/400                         |            본인의 미해결/해결 모든 글 요청             | 본인의 미해결/해결 모든 글 요청 |                         |     |
| POST        |         /posts         | 해당 페이지 모든 정보(에러게시글) | 200+postid/400                  |    등록 이후 받은 postid 통해서 개별 글 페이지 이동    | 새 글 등록                      |                         |     |
| PATCH       |     /posts/:postid     |         변경된 모든 필드          | 200+postid/400                  |                                                        |                                 |                         |     |
| DELETE      |     /posts/:postid     |                 -                 | 200/400                         | 서버에서는 cascade delete등 관련된 연결,데이터 다 삭제 | 개별페이지에서 삭제 클릭시      |                         |     |
| GET         |     /posts/:postid     |                 -                 | 200+개별페이지구성 모든정보/400 | postid 1개에 해당하는 개별페이지 구성정보 전부 return  | 개별 글 페이지 진입             |                         |     |
| GET         |    /admin/truncate     |                 -                 | 200{msg:'truncated'}/400        |                                                        | 테이블 포맷                     | 관리자 계정만 요청 가능 |     |

## response http status code

200 : 성공

400 : 잘못된 요청

500 : 서버에러

## 토큰 만료 시 (1hour)

| http status code | body                                                                           |
| ---------------- | ------------------------------------------------------------------------------ |
| 400              | {"name":"tokenExpiredError", "message":"jwt expired","expiredAt" : [ISO TIME]} |

## 개별 에러 POST,PATCH 메소드 REQUEST BODY

```json=
{
  "post":{
    "postname":"한글테스트",
    "postcode":"code1",
    "solution":"solution1",
    "iscomplete":"true" ←default:false
  },
  "keyword":["키워드","kw2"],
  "refer":
  [
     {
      "referurl":"naver.com",
      "understand":"한글"
     }
    ,{
    "referurl":"daum.com",
    "understand":"what..?"
    }
  ]
}
```

## 팀원정보

| 이름   | 스택      | TIL blog                          | github username |
| ------ | --------- | --------------------------------- | --------------- |
| 조아라 | front-end | https://grin-quokka.tistory.com/  | grin-quokka     |
| 박강호 | front-end | https://medium.com/@whatorjust/   | whatorjust      |
| 이해준 | back-end  | https://medium.com/@0oooceanhigh/ | liftingturn     |
|        |           |                                   |                 |
