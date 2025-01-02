console.log("product Mod js in ");

var formTypeValue = document.getElementById('formType').value;
console.log(formTypeValue);

let oEditors = []

smartEditor = function() {
    console.log("Naver SmartEditor")
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "c",
        sSkinURI: "/smarteditor/SmartEditor2Skin.html",
        fCreator: "createSEditor2"

    })

}


document.addEventListener('DOMContentLoaded', function() {
    smartEditor();
});


document.getElementById("regBtn").addEventListener("click", (event) =>{


     // SmartEditor에서 콘텐츠를 업데이트
     oEditors.getById["c"].exec("UPDATE_CONTENTS_FIELD", []);

     // SmartEditor에서 내용을 가져옴
     let boardContent  = oEditors.getById["c"].getIR(); // 에디터의 HTML 내용 가져오기
     let boardName = document.getElementById("b").value; // 제목 가져오기
     let tradePrice = document.getElementById("p").value; // 가격 가져오기
     let category = document.getElementById("inputGroupSelect01").value; // 카테고리 가져오기

     console.log("제목:", boardName);      // boardName 값 확인
     console.log("내용:", boardContent);    // content 값 확인
     console.log("가격:", tradePrice);      // 가격 값 확인
     console.log("카테고리:", category);    // 카테고리 값 확인

     if (boardName.trim() === '') {
        alert("상품명을 입력해주세요.");
        document.getElementById("b").focus(); // 제목 필드로 포커스 이동
        return;
    }

    if (tradePrice.trim() === '') {
        alert("판매가격을 입력해주세요.");
        document.getElementById("p").focus(); // 가격 필드로 포커스 이동
        return;
    }

    if (category === '') {
        alert("카테고리를 선택해주세요.");
        document.getElementById("inputGroupSelect01").focus(); // 제목 필드로 포커스 이동
        return;
    }

       // HTML에서 &nbsp;를 공백으로 변환하고, 텍스트로 변환하여 trim()
       let tempDiv = document.createElement("div");
       tempDiv.innerHTML = boardContent; // HTML을 DOM으로 파싱
       let textContent = tempDiv.textContent || tempDiv.innerText; // 텍스트로 변환

       let cleanedContent = textContent.replace(/\s+/g, ' ').trim(); // 공백 처리 후 trim()

     if (cleanedContent.trim() === '') {
        alert("내용을 입력해주세요.");
        oEditors.getById["c"].exec("FOCUS"); // 에디터로 포커스 이동
        return;
    } else {
        // POST 요청을 보낼 데이터 객체
        let formData = new FormData();
        formData.append("boardName", boardName);
        formData.append("boardContent", boardContent);
        formData.append("tradePrice", tradePrice);
        formData.append("category", category); // 카테고리 값 추가

        registerPostToServer(formData).then(result => {
            if(result === "1"){
                alert("글을 수정하였습니다.");
            } else {
                alert("게시글 수정 성공");
            }
        })
    }
});


async function registerPostToServer(formData) {
    try {
        const url = "/board/update";  // 요청 URL
        const config = {
            method: "POST",  // HTTP 메서드
            body: formData
        };

        // 서버에 요청 보내기
        const resp = await fetch(url, config);

        // 응답 처리
        if (resp.ok) {  // 2xx 범위 응답이 올 때
            console.log('Success');
            window.location.href = "/"; // 등록 후 리다이렉트
        } else {
            console.log(resp);
        }

        // 응답 내용 읽기
        const result = await resp.text(); 
        console.log(result);
        return result;

    } catch (error) {
        console.log(error);  // 에러 발생 시 처리
    }
}
