var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';

        var streaming = false,
            video       = document.querySelector('#video'),
            canvas      = document.querySelector('#canvas'),
            photo       = document.querySelector('#photo'),
            flipButton  = document.querySelector('#flipButton'),
            startButton = document.querySelector('#startButton'),
            width       =  620,
            height      = 0,
            front       = false;

        const videoConstraints = {
            audio: false,
            video: { facingMode: (front? "user" : "environment") },
        };

        navigator.mediaDevices
            .getUserMedia(videoConstraints)
            .then((stream) => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                }
            })
            .catch((err) => {
                console.error(`${err.name}: ${err.message}`);
            });

        video.addEventListener('canplay', (ev) => {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = false;
            }

            let src = new cv.Mat(height, width, cv.CV_8UC4);
            let dst = new cv.Mat(height, width, cv.CV_8UC4);
            let cap = new cv.VideoCapture(video);

            const FPS = 30;

            function processVideo() {
                let begin = Date.now();
                cap.read(src);
                src.copyTo(dst);
                //cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
                // {width: 620, height: 465}
                let point1 = new cv.Point(50, 50);
                let point2 = new cv.Point(250, 250);
                cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
                cv.imshow(canvas, dst);
                // schedule next one.
                let delay = 1000/FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            }

            // schedule first one.
            setTimeout(processVideo, 0);
        }, false);

        function takePicture() {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
        }

        startButton.addEventListener('click', function(ev) {
            takePicture();
            ev.preventDefault();
        }, false);

        flipButton.addEventListener('click', function(ev) {
            front = !front;
        })
    }
}