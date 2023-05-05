var Module = {
  onRuntimeInitialized() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';

    var imgElement    = document.querySelector('#imgElement'),
        inputElement  = document.querySelector('#inputElement'),
        canvas        = document.querySelector('#canvas'),
        mouseIsDown   = false;

    let src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4);
    let dst = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4);

    src = cv.imread(canvas);

    src.copyTo(dst);

    inputElement.addEventListener('change', function(ev) {
      imgElement.src = URL.createObjectURL(ev.target.files[0]);
    }, false);

    imgElement.onload = function() {
      let mat = cv.imread(imgElement);
      cv.imshow(canvas, mat);
      mat.delete();
    }


    var point1, point2;

    canvas.onmousedown = function(ev) {
      console.log(ev.x);
      console.log(ev.y);
      point1 = new cv.Point(ev.x, ev.y);
      mouseIsDown = true;
    }

    canvas.onmouseup = function(ev) {
      if (mouseIsDown) {
        console.log(ev.x);
        console.log(ev.y);
        cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
        cv.imshow(canvas, dst);
      }
      mouseIsDown = false;
    }

    canvas.onmousemove = function(ev) {
      if (!mouseIsDown) return;

      point2 = new cv.Point(ev.x, ev.y);

      return false;
    }
  }
}