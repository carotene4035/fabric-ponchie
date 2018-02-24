window.onload = function() {

  //window.onloadを使い、htmlが読み込みされてからスクリプトを動作させる。
  var canvas = new fabric.Canvas('test_canvas');
  canvas.isDrawingMode = false;
  canvas.backgroundColor = '#fff';

  /** ダウンロードリンクを推した時に、今のcanvasをimageにしてdownloadさせる */
  const download = document.getElementById("download");
  download.onclick = function() {


    /** canvasを画像ファイルにする */
    const ret = canvas.toDataURL({
      format: 'jpeg',
    });
    const blob = toBlob(ret);
    this.href = window.URL.createObjectURL(blob);
  };

  document.getElementById("save").onclick = function() {
    localStorage.setItem("fabricData", JSON.stringify(canvas));
  }

  document.getElementById("load").onclick = function() {
    const data = localStorage.getItem("fabricData");
    canvas.loadFromJSON(data, function() {
      canvas.renderAll();
    },function(o,object){
      console.log(o,object)
    })
  }

  /** 画像ファイルをダウンロードするために、base64のデータをblobにする */
  function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ''));

    　　 var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    try{
      var blob = new Blob([buffer.buffer], {
        type: 'image/jpeg'
      });
    }catch (e){
      return false;
    }
    return blob;
  }



  /** ドラッグ&ドロップで画像を追加 */
  var droparea = document.getElementById('droparea');

  // dragoverイベントのリスナーを設定
  droparea.addEventListener('dragover', function(evt) {
    evt.preventDefault();
  }, true);

  // dropイベントのリスナーを設定
  droparea.addEventListener('drop', function(evt) {
    // fileオブジェクトの取得
    const file = evt.dataTransfer.files[0];

    // file reader生成
    const reader = new FileReader();

    reader.onload = function() {
      const image = new Image();

      /** image要素が読み込まれてからcanvasに追加 */
      image.onload = function() {
        /** image要素をcanvasに追加 */
        var imgInstance = new fabric.Image(image, {
          left: 10,
          top: 10,
          selectable: false
        });
        canvas.add(imgInstance);

        /** 選択用の四角をcanvasに追加 */
        var rect = new fabric.Rect({
          left: 100,
          top: 100,
          fill:'transparent',
          width: 20,
          height: 20,
          stroke: '#f00',
          strokeWidth: 1
        });
        canvas.add(rect);　
        canvas.bringToFront(rect);
      }

      /** image要素の読み込み */
      image.src = reader.result;

    };
    reader.readAsDataURL(file);
    evt.preventDefault();

  }, true);

}

