'use strict';
const regenerateButton = document.getElementById('regenerate');
const answerTable = document.getElementById('question-table');
const questionCells = document.getElementsByClassName('Qcell');
const brank_num = document.getElementById('brank_num');

const array1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const original_array = [[1, 2, 3, 4, 5, 6, 7, 8, 9], [4, 5, 6, 7, 8, 9, 1, 2, 3], [7, 8, 9, 1, 2, 3, 4, 5, 6], [2, 3, 1, 5, 6, 4, 8, 9, 7], [5, 6, 4, 8, 9, 7, 2, 3, 1], [8, 9, 7, 2, 3, 1, 5, 6, 4], [3, 1, 2, 6, 4, 5, 9, 7, 8], [6, 4, 5, 9, 7, 8, 3, 1, 2,], [9, 7, 8, 3, 1, 2, 6, 4, 5]]
const test_array = [[7, 2, 3, 4, 5, 0, 1, 8, 9], [4, 5, 6, 7, 8, 9, 1, 2, 3], [7, 8, 9, 1, 2, 3, 4, 5, 6], [2, 3, 1, 5, 6, 4, 8, 9, 7], [5, 6, 4, 8, 9, 7, 2, 3, 1], [8, 9, 7, 2, 3, 1, 5, 6, 4], [3, 1, 2, 6, 4, 5, 9, 7, 8], [6, 4, 5, 9, 7, 8, 3, 1, 2,], [9, 7, 8, 3, 1, 2, 6, 4, 5]]

let answer_array;
let question_array = [];

question_generator();

regenerateButton.onclick = () => {
    question_generator();
}

/**
 * 問題作る関数
 * @param {Array} 99配列
 * @returns {Array} 穴あき99配列
 */
function question_generator(){
    answer_array = answer_generator();
    for(var i=0; i<answer_array.length; i++){
        question_array[i] = [].concat(answer_array[i]);
    }
    for(var i=0; i<brank_num.value; i++){
        Perforate(question_array);
    }
    input_to_table(question_array);
    console.log(verification(answer_array));
    console.log(answer_array);
    console.log(verification(question_array));
}

/**
 * 穴開ける関数
 * @param {Array} 99配列
 * @returns {Array} 穴あき99配列
 */
function Perforate(array){
    // 穴あけ
    var random08_1 = Math.floor(Math.random() * 9);
    var random08_2 = Math.floor(Math.random() * 9);
    if(array[random08_1][random08_2] != 0){
        array[random08_1][random08_2] = 0;
    }else{
        console.log("Re-Perforate!!")
        Perforate(array);
    }
// 回答が一通りしかないことを確認
    var candidate = [];
    for(var i=0; i<array.length; i++){
        var result = [].concat(array[i]).filter((item) => {return item !== 0;});
        candidate.push(RemainArray([].concat(array1to9), result));
        
    }
    console.log(candidate);
    // 総当たりで当てはめる
    
    // 成功した場合元配列と同じならスルー
    // 元配列と違うなら状態を戻してやり直し
    // 最後まで行けたらOK
}

/**
 * 検算用関数
 * @param {Array} 99配列
 * @returns {boolean} true/false
 */
function verification(array){
    // 横チェック
    for(var i=0; i<array.length; i++){
        var vertical = [];
        for(var j=0; j<array.length; j++){
            vertical.push(array[i][j]);
        }
        vertical.sort();
        for (var n= 0; n < vertical.length; n++) {
            if (vertical[n] !== array1to9[n]) return false;
        }
    }
    // 縦チェック
    for(var j=0; j<array[0].length; j++){
        var vertical = [];
        for(var i=0; i<array.length; i++){
            vertical.push(array[i][j]);
        }
        vertical.sort();
        for (var n= 0; n < vertical.length; n++) {
            if (vertical[n] !== array1to9[n]) return false;
        }
    }
    // ブロックチェック
    for(var i=0; i<array.length; i+=3){
        for(var j=0; j<array[0].length; j+=3){
            var vertical = [];
            for(var k=0; k<3; k++){
                for(var l=0; l<3; l++){
                    vertical.push(array[i+k][j+l]);
                }
            }
            vertical.sort();
            for (var n= 0; n < vertical.length; n++) {
                if (vertical[n] !== array1to9[n]) return false;
            }
        }
    }
    return true;
}

/**
 * 99配列を表に表示する関数
 * @param {Array} 99配列
 */
function input_to_table(array){
    for(var i=0; i<array.length; i++){
        for(var j=0; j<array[i].length; j++){
            if(array[i][j] == 0){
                questionCells[array.length*i+j].innerHTML = '<input type="text" class="Blank"></input>';
            }else{
                questionCells[array.length*i+j].innerText = array[i][j];
            }
            
        }
    }
}

/**
 * 回答の配列を作成する関数
 * @returns {Array} 回答の二重配列
 */
function answer_generator() {
    // 天才なので元の配列から壊さずにシャッフルする方法を思いついた
    // この方法は生成できない組み合わせがある．ゴミ．
    // let answer_array = [].concat(original_array);
    // answer_array = shuffle_horizontal_line(answer_array);
    // return answer_array;

    // 1行目を確定 (1-9の配列をFisher–Yatesでシャッフル)
    const line1 = [].concat(array1to9);
    Fisher_Yate(line1);
    let current_answer = [line1];

    // 2行目を確定(line1の456と789を全部入れ替えた上で123と456789をランダムに入れ替える)
    const line2 = [].concat(line1);
    const line2genearr0 = Fisher_Yate([6, 7, 8]);
    [line2[3], line2[line2genearr0[0]]] = [line2[line2genearr0[0]], line2[3]];
    [line2[4], line2[line2genearr0[1]]] = [line2[line2genearr0[1]], line2[4]];
    [line2[5], line2[line2genearr0[2]]] = [line2[line2genearr0[2]], line2[5]];
    const line2genearr1 = Fisher_Yate([3, 4, 5, 6, 7, 8]);
    [line2[0], line2[line2genearr1[0]]] = [line2[line2genearr1[0]], line2[0]];
    [line2[1], line2[line2genearr1[1]]] = [line2[line2genearr1[1]], line2[1]];
    [line2[2], line2[line2genearr1[2]]] = [line2[line2genearr1[2]], line2[2]];
    current_answer.push(line2);

    // 3行目を確定(3*3ブロックから入るものを確定)
    const line3_1existing = [line1[0], line1[1], line1[2], line2[0], line2[1], line2[2]];
    const line3_1 = RemainArray([].concat(array1to9), line3_1existing);
    const line3_2existing = [line1[3], line1[4], line1[5], line2[3], line2[4], line2[5]];
    const line3_2 = RemainArray([].concat(array1to9), line3_2existing);
    const line3_3existing = [line1[6], line1[7], line1[8], line2[6], line2[7], line2[8]];
    const line3_3 = RemainArray([].concat(array1to9), line3_3existing);
    Fisher_Yate(line3_1);
    Fisher_Yate(line3_2);
    Fisher_Yate(line3_3);
    const line3 = line3_1.concat(line3_2.concat(line3_3));
    current_answer.push(line3);

    // 4行目を確定(縦列を考慮しながら入る数字を選ぶ．候補の少ない位置から決定する)
    let line4_candidate = UsedArray(current_answer);
    const line4 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 9; i++) {
        // 一番短いものからランダムで選ぶ
        let shortest = ShortestArray(line4_candidate);
        line4[shortest] = Random_Choose(line4_candidate[shortest]);
        // 選んだものを配列から消す
        line4_candidate[shortest] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < 9; j++) {
            if (line4_candidate[j].indexOf(line4[shortest]) > -1) {
                line4_candidate[j].splice(line4_candidate[j].indexOf(line4[shortest]), 1);
            }
        }
    }
    current_answer.push(line4);

    // 5行目を確定(縦列とブロックを考慮しながら入る数字を選ぶ．候補の少ない位置から決定する)
    let line5_candidate = UsedArray(current_answer);
    const line5 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 9; i += 3) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                if (line5_candidate[i + j].indexOf(line4[i + k]) > -1) {
                    line5_candidate[i + j].splice(line5_candidate[i + j].indexOf(line4[i + k]), 1);
                }
            }
        }
    }
    for (var i = 0; i < 9; i++) {
        // 一番短いものからランダムで選ぶ
        let shortest = ShortestArray(line5_candidate);
        line5[shortest] = Random_Choose(line5_candidate[shortest]);
        // 選んだものを配列から消す
        line5_candidate[shortest] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < 9; j++) {
            if (line5_candidate[j].indexOf(line5[shortest]) > -1) {
                line5_candidate[j].splice(line5_candidate[j].indexOf(line5[shortest]), 1);
            }
        }
    }
    // エラー処理
    for (var i = 0; i < 9; i++){
        if(typeof line5[i] === "undefined"){
            console.log("REGENERATE!!!!")
            return answer_generator();
        }
    }
    current_answer.push(line5);

    // 6行目を確定(縦列とブロックを考慮しながら入る数字を選ぶ．候補の少ない位置から決定する)
    // TODO
    let line6_candidate = UsedArray(current_answer);
    const line6 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 9; i += 3) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                if (line6_candidate[i + j].indexOf(line4[i + k]) > -1) {
                    line6_candidate[i + j].splice(line6_candidate[i + j].indexOf(line4[i + k]), 1);
                }
                if (line6_candidate[i + j].indexOf(line5[i + k]) > -1) {
                    line6_candidate[i + j].splice(line6_candidate[i + j].indexOf(line5[i + k]), 1);
                }
            }
        }
    }
    for (var i = 0; i < 9; i++) {
        // 一番短いものからランダムで選ぶ
        let shortest = ShortestArray(line6_candidate);
        line6[shortest] = Random_Choose(line6_candidate[shortest]);
        // 選んだものを配列から消す
        line6_candidate[shortest] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < 9; j++) {
            if (line6_candidate[j].indexOf(line6[shortest]) > -1) {
                line6_candidate[j].splice(line6_candidate[j].indexOf(line6[shortest]), 1);
            }
        }
    }
    // エラー処理
    for (var i = 0; i < 9; i++){
        if(typeof line6[i] === "undefined"){
            console.log("REGENERATE!!!!")
            return answer_generator();
        }
    }
    current_answer.push(line6);


    // 7行目を確定
    let line7_candidate = UsedArray(current_answer);
    const line7 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 9; i++) {
        // 一番短いものからランダムで選ぶ
        let shortest = ShortestArray(line7_candidate);
        line7[shortest] = Random_Choose(line7_candidate[shortest]);
        // 選んだものを配列から消す
        line7_candidate[shortest] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < 9; j++) {
            if (line7_candidate[j].indexOf(line7[shortest]) > -1) {
                line7_candidate[j].splice(line7_candidate[j].indexOf(line7[shortest]), 1);
            }
        }
    }
    // エラー処理
    for (var i = 0; i < 9; i++){
        if(typeof line7[i] === "undefined"){
            console.log("REGENERATE!!!!")
            return answer_generator();
        }
    }
    current_answer.push(line7);

    // 8行目を確定
    let line8_candidate = UsedArray(current_answer);
    const line8 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 9; i += 3) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                if (line8_candidate[i + j].indexOf(line7[i + k]) > -1) {
                    line8_candidate[i + j].splice(line8_candidate[i + j].indexOf(line7[i + k]), 1);
                }
            }
        }
    }
    for (var i = 0; i < 9; i++) {
        // 一番短いものからランダムで選ぶ
        let shortest = ShortestArray(line8_candidate);
        line8[shortest] = Random_Choose(line8_candidate[shortest]);
        // 選んだものを配列から消す
        line8_candidate[shortest] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < 9; j++) {
            if (line8_candidate[j].indexOf(line8[shortest]) > -1) {
                line8_candidate[j].splice(line8_candidate[j].indexOf(line8[shortest]), 1);
            }
        }
    }
    // エラー処理
    for (var i = 0; i < 9; i++){
        if(typeof line8[i] === "undefined"){
            console.log("REGENERATE!!!!")
            return answer_generator();
        }
    }
    current_answer.push(line8);

    // 9行目を確定
    let line9_candidate = UsedArray(current_answer);
    const line9 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 9; i++) {
        // 一番短いものからランダムで選ぶ
        let shortest = ShortestArray(line9_candidate);
        line9[shortest] = Random_Choose(line9_candidate[shortest]);
        // 選んだものを配列から消す
        line9_candidate[shortest] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var j = 0; j < 9; j++) {
            if (line9_candidate[j].indexOf(line9[shortest]) > -1) {
                line9_candidate[j].splice(line9_candidate[j].indexOf(line9[shortest]), 1);
            }
        }
    }
    // エラー処理
    for (var i = 0; i < 9; i++){
        if(typeof line9[i] === "undefined"){
            console.log("REGENERATE!!!!")
            return answer_generator();
        }
    }
    current_answer.push(line9);

    // 上の方がよりランダム性があってなんとなくばらつきがある気がするので適当にシャッフル
    let shuffled_array = [].concat(current_answer);
    for(var i=0; i<100; i++){
        shuffled_array = shuffle_horizontal_line(shuffled_array);
        shuffled_array = shuffle_vertical_line(shuffled_array);
        shuffled_array = shuffle_horizontal_block(shuffled_array);    
        shuffled_array = shuffle_vertical_block(shuffled_array);
    }
    // 回答を確定
    const answer_array = shuffled_array;

    return answer_array;
}

/**
* 横列をシャッフルする関数
* @param {Array} 元配列
* @returns {Array} ランダム並び替え配列
*/
function shuffle_horizontal_line(origin_array) {
    var rand036 = Math.floor(Math.random() * 3) * 3;
    var rand012_1 = Math.floor(Math.random() * 3);
    var rand012_2 = Math.floor(Math.random() * 3);
    [origin_array[rand036 + rand012_1], origin_array[rand036 + rand012_2]] = [origin_array[rand036 + rand012_2], origin_array[rand036 + rand012_1]];
    return (origin_array);
}

/**
* 縦列をシャッフルする関数
* @param {Array} 元配列
* @returns {Array} ランダム並び替え配列
*/
function shuffle_vertical_line(origin_array){
    const shuffled_array = [].concat(origin_array);
    var rand036 = Math.floor(Math.random() * 3) * 3;
    var rand012_1 = Math.floor(Math.random() * 3);
    var rand012_2 = Math.floor(Math.random() * 3);
    for (var i = origin_array.length - 1; i >= 0; i--){
        [shuffled_array[i][rand036+rand012_1], shuffled_array[i][rand036+rand012_2]] = [origin_array[i][rand036+rand012_2], origin_array[i][rand036+rand012_1]];
    }
    return shuffled_array
}

/*
* ブロック単位でシャッフルする関数（横）
* @param {Array} 元配列
* @returns {Array} ランダム並び替え配列
*/
function shuffle_horizontal_block(origin_array) {
    var rand036_1 = Math.floor(Math.random() * 3) * 3;
    var rand036_2 = Math.floor(Math.random() * 3) * 3;
    [origin_array[rand036_1 + 0], origin_array[rand036_1 + 1], origin_array[rand036_1 + 2], 
    origin_array[rand036_2 + 0], origin_array[rand036_2 + 1], origin_array[rand036_2 + 2]] = 
    [origin_array[rand036_2 + 0], origin_array[rand036_2 + 1], origin_array[rand036_2 + 2], 
    origin_array[rand036_1 + 0], origin_array[rand036_1 + 1], origin_array[rand036_1 + 2]];
    return (origin_array);
}

/*
* ブロック単位でシャッフルする関数（縦）
* @param {Array} 元配列
* @returns {Array} ランダム並び替え配列
*/
function shuffle_vertical_block(origin_array) {
    var rand036_1 = Math.floor(Math.random() * 3) * 3;
    var rand036_2 = Math.floor(Math.random() * 3) * 3;
    let conversion = [];
    for (var i = 0; i < 9; i++) {
        let line = [];
        for (var j = 0; j < origin_array.length; j++) {
            line.push(origin_array[j][i]);
        }
        conversion.push(line);
    }
    [conversion[rand036_1 + 0], conversion[rand036_1 + 1], conversion[rand036_1 + 2], 
    conversion[rand036_2 + 0], conversion[rand036_2 + 1], conversion[rand036_2 + 2]] = 
    [conversion[rand036_2 + 0], conversion[rand036_2 + 1], conversion[rand036_2 + 2], 
    conversion[rand036_1 + 0], conversion[rand036_1 + 1], conversion[rand036_1 + 2]];
    return (conversion);
}


/**
 * 配列をシャッフルする関数(Fisher–Yate)
 * @param {Array} 元配列
 * @returns {Array} ランダム並び替え配列
 */
function Fisher_Yate(origin_array) {
    for (var i = origin_array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [origin_array[i], origin_array[rand]] = [origin_array[rand], origin_array[i]];
    }
    return origin_array;
}

/**
 * 1-9配列から入りうる残りを返す関数
 * @param {Array} 元配列
 * @param {Array} 入らない数の配列
 * @returns {Array} 残りの配列
 */
function RemainArray(array19, existing) {
    for (var i = 0; i < existing.length; i++) {
        array19.splice(array19.indexOf(existing[i]), 1);
    }
    return array19;
}

/**
 * すでに作られた配列から縦列で使えないものを除去する関数
 * @param {Array} すでに作られた配列
 * @returns {Array} 入りうるもの
 */
function UsedArray(current) {
    let candidate = [];
    for (var i = 0; i < 9; i++) {
        let conversion = [];
        for (var j = 0; j < current.length; j++) {
            conversion.push(current[j][i]);
        }
        candidate.push(RemainArray([].concat(array1to9), conversion));
    }
    return candidate;
}

/**
 * 最も短い配列を探す
 * @param {Array} 元配列
 * @returns {Array} 最も短い配列
 */
function ShortestArray(array) {
    let lgth = 9;
    let shortest;
    for (var i = 0; i < array.length; i++) {
        if (array[i].length < lgth) {
            lgth = array[i].length;
            shortest = i;
        }
    }
    return shortest;
}

/**
 * 配列からランダムに要素を返す関数
 * @param {Array} 元配列
 * @returns {Array} 要素
 */
function Random_Choose(array) {
    let rand = array[Math.floor(Math.random() * array.length)];
    return rand;
}