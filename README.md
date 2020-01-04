# furniture-multiview

furniture 3d object format to multiview

3d object 파일을 여러 각도에서 렌더링한 multiview 이미지로 변환하기 위한 웹

## 화면 구성

![snapshot](snapshot.jpg)

- 모델링, 애니메이션, 텍스쳐 정보를 포함한 fbx를 입력으로 받으면 검은 화면에 오브젝트가 생성됨
- 오브젝트 크기와 밝기 조절가능
- 360도로 회전하는 카메라를 알맞는 위치로 이동
- 해당 오브젝트와 유사한 실제 이미지들을 첨부
- 가구분류를 직접 선택해서 업로드

## 저장되는 파일 구조

```
├─furniture
│  ├─chair
│  │      가구별번호.fbx
│  │      가구별번호-00.jpg  // 00 ~ 11 번
│  │      가구별번호-01.jpg  // 오브젝트를 360도 회전
│  │      ...
│  │      가구별번호-11.jpg  // 12회 렌더링한 이미지들
│  │      가구별번호-12.jpg  // 오브젝트와 유사한 실제 사진
│  │      ...
│  ├─bed
│  ├─table
│  ├─sofa
```
