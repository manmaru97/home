'use strict';

let columnNum;              // 列数
let imgWidth = 250;         // 画像の横幅
let imgMarginRight = 10;    // cssで指定しているmargin。コーディング的に美しくないが暫定的にこれで

let bgmOnOff;
let date;

function buttonClick() {

    if (bgmOnOff === 0) {
        bgmOnOff = 1;
        document.getElementById("bgm").play();
    }
    else {
        bgmOnOff = 0;
        document.getElementById("bgm").pause();
    }
};

function pageCreate() {

    // ウィンドウ幅に合わせた列数の指定。最低でも1列になるよう無理やり調整
    columnNum = Math.floor(document.body.clientWidth / (imgWidth + imgMarginRight));
    if (columnNum === 0) {
        columnNum = 1;
    }

    // myFavorites内の要素を初期化
    myFavorites.innerHTML = "";

    // myFavorites内にリストの要素を付け足していく
    for (let i = 0; i < list.length; i++) {

        if (i % columnNum === 0) {
            // tableの各行の先頭で<tr></tr>を設定
            document.getElementById('myFavorites').insertAdjacentHTML('beforeend', `<tr id="trNum${Math.floor(i / columnNum)}"></tr>`);
        }

        document.getElementById(`trNum${Math.floor(i / columnNum)}`).insertAdjacentHTML('beforeend',
            `<td>
                <div class="myImg">
                    <a id="cellNum${i}" href="${list[i].sitePass}">
                        <p class="inMyImg">${list[i].siteName}</p>
                    </a>
                </div>
            </td>`);

        if (list[i].siteImage.match(/mp4/)) {
            // mp4
            document.getElementById(`cellNum${i}`).insertAdjacentHTML('afterbegin',
                `<video src="images/${list[i].siteImage}" width=${imgWidth} px loop autoplay muted></video>`
            );
        } else {
            // img, gif
            document.getElementById(`cellNum${i}`).insertAdjacentHTML('afterbegin',
                `<image src="images/${list[i].siteImage}" width=${imgWidth} px></image>`
            );
        }

    }

}

function loop() {
    date = new Date();
    document.getElementById("clock").innerHTML = date.toLocaleString();
}

// 起動時の処理
window.addEventListener('load', function () {
    pageCreate();
    setInterval(loop, 100);
})

// ページサイズ変更時の処理
window.addEventListener('resize', function () {
    let tmp = Math.floor(document.body.clientWidth / (imgWidth + imgMarginRight));
    if (tmp === 0) {
        tmp = 1;
    }
    if (columnNum !== tmp) {
        pageCreate();
    }
}, false);