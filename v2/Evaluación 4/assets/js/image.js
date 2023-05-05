var Module = {
    onRuntimeInitialized() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';

        var imgElement      = document.querySelector('#imageSrc'),
            inputElement    = document.querySelector('#fileInput'),
            canvasElement   = document.querySelector('#canvasOutput'),
            dst             = new cv.Mat();

        inputElement.addEventListener('change', function(e) {
            imgElement.src = URL.createObjectURL(e.target.files[0]);
        }, false);

        imgElement.onload = function() {
            src = cv.imread(imgElement);
            // https://stackoverflow.com/questions/47259229/rectangle-not-showing-up-in-opencv
            src.copyTo(dst);
            cv.imshow(canvasElement, src);
        };

        // https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
        // https://stackoverflow.com/questions/65376480/let-users-draw-rectangles-with-mouse-in-canvas-with-javascript

        // this flag is true when the user is dragging the mouse
        var isDown = false;

        // these vars will hold the starting mouse position
        var startX;
        var startY;

        function handleMouseDown(e) {
            e.preventDefault();
            e.stopPropagation();

            // calculate offset
            var offsetX = e.target.getBoundingClientRect().left;
            var offsetY = e.target.getBoundingClientRect().top;

            // save starting x/y of the rectangle
            startX = parseInt(e.clientX - offsetX);
            startY = parseInt(e.clientY - offsetY);

            // set a flag indicating the drag has begun
            isDown = true;
        }

        function handleMouseUp(e) {
            e.preventDefault();
            e.stopPropagation();

            // the drag is over, clear the dragging flag
            isDown = false;
        }

        function handleMouseOut(e) {
            e.preventDefault();
            e.stopPropagation();
            // the drag is over, clear the dragging flag
            isDown = false;
        }

        function handleMouseMove(e) {
            e.preventDefault();
            e.stopPropagation();

            // if we're not dragging, just return
            if (!isDown) {
                return;
            }

            // calculate offset
            var offsetX = e.target.getBoundingClientRect().left;
            var offsetY = e.target.getBoundingClientRect().top;

            // get the current mouse position
            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);
            
            // clear the dst matrix
            src.copyTo(dst);

            // draw a new rect from the start position
            // to the current mouse position
            let point1 = new cv.Point(startX, startY);
            let point2 = new cv.Point(mouseX, mouseY);
            cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            cv.imshow(canvasElement, dst);
        }

        canvasElement.addEventListener('mousemove', handleMouseMove);
        canvasElement.addEventListener('mouseup', handleMouseUp);
        canvasElement.addEventListener('mousedown', handleMouseDown);
        canvasElement.addEventListener('mouseout', handleMouseOut);
    }
}