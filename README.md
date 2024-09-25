<<<<<<< HEAD
MUX 협업을 위한 가이드

작성일: 2024/09/24 

작성자: 전나영

초기 작업
: GitHub 리포지토리를 자신의 로컬 환경에 클론
```bash
git clone https://github.com/prgrms-fe-devcourse/NFE1_2_MUX.git
``` 
: 클론 후 해당 디렉터리로 이동하여 설치 진행
```bash
nayoung@nayeong-ui-MacBookPro projects % cd NFE1_2_MUX

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % npm install

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % npm run dev

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % npm i --save-dev prettier

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % npm install react-router-dom --save 

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % npm install axios

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % npm install styled-components

nayoung@nayeong-ui-MacBookPro NFE1_2_MUX % 

```

협업 예시

1.작업을 시작하기 전에, 각 팀원은 새로운 브랜치를 생성하여 작업
```bash
git checkout -b feature/your-feature-name
``` 

2.필요한 기능이나 수정 사항을 작업한 후, 변경 사항을 커밋
```bash
git add .
git commit -m "작업 내용 설명"
``` 

3.로컬 브랜치를 원격 리포지토리로 푸시
```bash
git push -u origin feature/your-feature-name
``` 

4.풀 리퀘스트 생성:
: GitHub에서 자신의 브랜치를 main 브랜치로 병합하기 위한 풀 리퀘스트를 생성

5.작업이 완료되면, 불필요한 브랜치를 삭제 (혹시 모르니 걍 냅둬도 ㄱㅊ)
```bash
git branch -d feature/your-feature-name  # 로컬에서 삭제
git push origin --delete feature/your-feature-name  # 원격에서 삭제
``` 

6.다른 팀원들의 작업 내용을 주기적으로 받아오기 위해 main 브랜치를 최신 상태로 유지
```bash
git checkout main
git pull origin main
``` 


=======
작성일: 2024/09/24 

작성자: 전나영

MUX 협업을 위한 가이드

초기 작업 : 깃 허브 홈페이지에서 이슈 생성 및 GitHub 리포지토리를 자신의 로컬 환경에 클론

```
git clone https://github.com/prgrms-fe-devcourse/NFE1_2_MUX.git
```

: 클론 후 해당 디렉터리로 이동하여 설치 진행

```
cd NFE1_2_MUX

git checkout develop

git pull

npm install

npm install vite --save-dev

npm i --save-dev prettier

npm install react-router-dom --save

npm install axios

npm install styled-components

npm run dev

```
ESLint 삭제:
- ESLint 설정 파일 삭제: .eslintrc.js

- 패키지 삭제: package.json에서 관련 패키지(eslint, eslint-plugin-react, eslint-plugin-react-hooks 등)를 삭제

- npm uninstall eslint eslint-plugin-react eslint-plugin-react-hooks 실행



협업 예시

1.작업을 시작하기 전에, 각 팀원은 새로운 브랜치를 생성하여 작업

```
git checkout -b feature/자신이 생성한 이슈 번호(ex. #1)
```

2.필요한 기능이나 수정 사항을 작업한 후, 변경 사항을 커밋

```
git add .
git commit -m "자신이 생성한 이슈 번호(ex. #1) + 작업 내용 설명"
```

3.로컬 브랜치를 원격 리포지토리로 푸시

```
git push -u origin feature/자신이 생성한 이슈 번호(ex. #1)
```

4.풀 리퀘스트 생성: : GitHub에서 자신의 브랜치를 main 브랜치로 병합하기 위한 풀 리퀘스트를 생성

5.작업이 완료되면, 불필요한 브랜치를 삭제 (혹시 모르니 걍 냅둬도 ㄱㅊ)

```
git branch -d feature/자신이 생성한 이슈 번호(ex. #1)  # 로컬에서 삭제
git push origin --delete feature/자신이 생성한 이슈 번호(ex. #1)  # 원격에서 삭제
```

6.다른 팀원들의 작업 내용을 주기적으로 받아오기 위해 main 브랜치를 최신 상태로 유지

```
git checkout develop
git pull origin develop
```
>>>>>>> d6458c778e975599bdcd1900e59593824655438c
