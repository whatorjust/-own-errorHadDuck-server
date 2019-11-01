## 서버 SPEC

- 서버 : NodeJS (AWS EC2)
- 미들웨어 : Express, cors
- DB : mysql (AWS RDS-mysql)
- orm : sequelize
- 보안 : crypto

## SERVER API

| http method | endpoint               | req(json)                 | res(성공/실패)                  | detail                                                 | usage                      | example |
| ----------- | ---------------------- | ------------------------- | ------------------------------- | ------------------------------------------------------ | -------------------------- | ------- |
| POST        | /users/login           | username, password        | 200/204                         | 로그인                                                 | 로그인                     |         |
| POST        | /users/signup          | username, email, password | 200/204                         | 회원가입 제출                                          | 회원가입 제출              |         |
| GET         | /posts                 | -                         | 200/204                         | 모든 게시글 요청                                       | 모든 게시글 요청           |         |
| GET         | /posts?iscomplete=bool | -                         | 200/204                         | 미해결/해결 모든 글 요청                               | 미해결/해결 모든 글 요청   |         |
| POST        | /posts                 | 해당 페이지 모든 정보     | 200+postid/204                  | 등록 이후 받은 postid 통해서 개별 글 페이지 이동       | 새 글 등록                 |         |
| PATCH       | /posts/:postid         | 변경된 모든 필드          | 200+postid/204                  |                                                        |                            |         |
| DELETE      | /posts/:postid         | -                         | 200/204                         | 서버에서는 cascade delete등 관련된 연결,데이터 다 삭제 | 개별페이지에서 삭제 클릭시 |         |
| GET         | /posts/:postid         | -                         | 200+개별페이지구성 모든정보/204 | postid 1개에 해당하는 개별페이지 구성정보 전부 return  | 개별 글 페이지 진입        |         |
|             |                        |                           |                                 |                                                        |                            |         |

## 팀원정보

| 이름   | 스택      | TIL blog                          | github username |
| ------ | --------- | --------------------------------- | --------------- |
| 조아라 | front-end | https://grin-quokka.tistory.com/  | grin-quokka     |
| 박강호 | front-end | https://medium.com/@whatorjust/   | whatorjust      |
| 이해준 | back-end  | https://medium.com/@0oooceanhigh/ | liftingturn     |
|        |           |                                   |                 |
