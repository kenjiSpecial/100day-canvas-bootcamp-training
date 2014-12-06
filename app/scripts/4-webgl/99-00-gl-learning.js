// canvasエレメントを取得
var c = document.getElementById('canvas');
c.width = 300;
c.height = 300;

// webglコンテキストを取得
var gl = c.getContext('webgl') || c.getContext('experimental-webgl');

// canvasを初期化する色を設定する
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// canvasを初期化する際の深度を設定する
gl.clearDepth(1.0);

// canvasを初期化
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// 頂点シェーダとフラグメントシェーダの生成
var v_shader = create_shader('vs');
var f_shader = create_shader('fs');

// プログラムオブジェクトの生成とリンク
var prg = create_program(v_shader, f_shader);

// attributeLocationの取得
var attLocation = gl.getAttribLocation(prg, 'position');

// attributeの要素数(この場合は xyz の3要素)
var attStride = 3;

// モデル(頂点)データ
var vertex_position = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
];

// VBOの生成
var vbo = create_vbo(vertex_position);

// VBOをバインド
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

// attribute属性を有効にする
gl.enableVertexAttribArray(attLocation);

// attribute属性を登録
gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);

// minMatrix.js を用いた行列関連処理
// matIVオブジェクトを生成
var m = new matIV();

// 各種行列の生成と初期化
var mMatrix = m.identity(m.create());
var vMatrix = m.identity(m.create());
var pMatrix = m.identity(m.create());
var mvpMatrix = m.identity(m.create());

// ビュー座標変換行列
m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

// プロジェクション座標変換行列
m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);

// 各行列を掛け合わせ座標変換行列を完成させる
m.multiply(pMatrix, vMatrix, mvpMatrix);
m.multiply(mvpMatrix, mMatrix, mvpMatrix);

// uniformLocationの取得
var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

// uniformLocationへ座標変換行列を登録
gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

// モデルの描画
gl.drawArrays(gl.TRIANGLES, 0, 3);

// コンテキストの再描画
gl.flush();

// シェーダを生成する関数
function create_shader(id){
    // シェーダを格納する変数
    var shader;

    // HTMLからscriptタグへの参照を取得
    var scriptElement = document.getElementById(id);

    // scriptタグが存在しない場合は抜ける
    if(!scriptElement){return;}

    // scriptタグのtype属性をチェック
    switch(scriptElement.type){

        // 頂点シェーダの場合
        case 'x-shader/x-vertex':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;

        // フラグメントシェーダの場合
        case 'x-shader/x-fragment':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        default :
            return;
    }

    // 生成されたシェーダにソースを割り当てる
    gl.shaderSource(shader, scriptElement.text);

    // シェーダをコンパイルする
    gl.compileShader(shader);

    // シェーダが正しくコンパイルされたかチェック
    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){

        // 成功していたらシェーダを返して終了
        return shader;
    }else{

        // 失敗していたらエラーログをアラートする
        alert(gl.getShaderInfoLog(shader));
    }
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(vs, fs){
    // プログラムオブジェクトの生成
    var program = gl.createProgram();

    // プログラムオブジェクトにシェーダを割り当てる
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    // シェーダをリンク
    gl.linkProgram(program);

    // シェーダのリンクが正しく行なわれたかチェック
    if(gl.getProgramParameter(program, gl.LINK_STATUS)){

        // 成功していたらプログラムオブジェクトを有効にする
        gl.useProgram(program);

        // プログラムオブジェクトを返して終了
        return program;
    }else{

        // 失敗していたらエラーログをアラートする
        alert(gl.getProgramInfoLog(program));
    }
}

// VBOを生成する関数
function create_vbo(data){
    // バッファオブジェクトの生成
    var vbo = gl.createBuffer();

    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // バッファにデータをセット
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // バッファのバインドを無効化
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // 生成した VBO を返して終了
    return vbo;
}
