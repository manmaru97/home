'use strict';

let columnNum;              // 列数
let imgWidth = 250;         // 画像の横幅
let imgMarginRight = 10;    // cssで指定しているmargin。コーディング的に美しくないが暫定的にこれで

// 時計用
const scale = 3;                // 解像度(10でフルHD)
const lineWidth = 1.5 * scale;  // 線幅
const strWidth = 15 * scale;    // 文字サイズ
const strY = 11 * scale;        // 文字列のY座標
const strDayX = 60 * scale;     // 日付のX座標
const strTimeX = 140 * scale;   // 時刻のX座標

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

        if (list[i].siteImage.match(/clock/)) {
            // clock
            document.getElementById(`cellNum${i}`).insertAdjacentHTML('afterbegin',
                `<canvas id="canvas" onclick="buttonClick()" width="${192 * scale}" height="${108 * scale}" style="width:${imgWidth}px; height:${imgWidth * 9 / 16}px;"></canvas>`
            );
        } else if (list[i].siteImage.match(/mp4/)) {
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

function drawClock(center, radius, num, baseNum, xy) {
    if (xy === 'x') {
        return center.x + radius * Math.cos(num * Math.PI * 2 / baseNum - (Math.PI / 2));
    } else if (xy === 'y') {
        return center.y + radius * Math.sin(num * Math.PI * 2 / baseNum - (Math.PI / 2));
    } else {
        return null;
    }
}

function loop() {
    date = new Date();

    // 時計
    if (document.getElementById("canvas") != null) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d", { alpha: true });

        const center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        const circleRadius = canvas.height / 2.2;
        const secRadius = canvas.height / 2.4;
        const minRadius = canvas.height / 2.8;
        const hourRadius = canvas.height / 6;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = lineWidth;

        // 文字盤
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.arc(center.x, center.y, circleRadius, 0, 2 * Math.PI, false);
        for (let i = 0; i < 12; i++) {
            ctx.moveTo(
                center.x + secRadius * Math.cos(i * Math.PI * 2 / 12 - (Math.PI / 2)),
                center.y + secRadius * Math.sin(i * Math.PI * 2 / 12 - (Math.PI / 2)),
            );
            ctx.lineTo(
                center.x + minRadius * Math.cos(i * Math.PI * 2 / 12 - (Math.PI / 2)),
                center.y + minRadius * Math.sin(i * Math.PI * 2 / 12 - (Math.PI / 2)),
            );
        }
        ctx.stroke();

        // 長針短針
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(
            drawClock(center, minRadius, date.getMinutes(), 60, 'x'),
            drawClock(center, minRadius, date.getMinutes(), 60, 'y'),
        );
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(
            drawClock(center, hourRadius, (date.getHours() % 12) * 60 + date.getMinutes(), 12 * 60, 'x'),
            drawClock(center, hourRadius, (date.getHours() % 12) * 60 + date.getMinutes(), 12 * 60, 'y'),
        );
        ctx.stroke();

        // 秒針
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(
            drawClock(center, secRadius, date.getSeconds(), 60, 'x'),
            drawClock(center, secRadius, date.getSeconds(), 60, 'y'),
        );
        ctx.stroke();

        // 日付
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.font = `bold ${strWidth}px 'メイリオ', 'Meiryo', sans-serif`;
        let day = (date.getMonth() + 1) + "/" + date.getDate()
        let time = ('00' + date.getHours()).slice(-2) + ":" + ('00' + date.getMinutes()).slice(-2);
        ctx.fillText(day, (strDayX - ctx.measureText(day).width) / 2, canvas.height - strY);
        ctx.fillText(time, strTimeX, canvas.height - strY);
    }
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