document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('my-canvas');

    var ctx = canvas.getContext("2d");

    //var fragmentSize = 2;
    var polygonPainted = false;
    var lastClickCoords = { x: 0, y: 0 };
    var firstClickCoords = { x: 0, y: 0 };
    var secondClickCoords = { x: 0, y: 0 };
    var polygonCoords = [];

    var clickCounter = 0;

    function onWindowResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    onWindowResize();

    window.addEventListener('resize', onWindowResize);

    canvas.addEventListener('click', onClickDraw);

    function onClickDraw(e) {
        var x = e.clientX;
        var y = e.clientY;

        var coordsObject = { x: x, y: y };

        ctx.strokeStyle = "#F972FF";

        clickCounter++;

        if (!polygonPainted) {
            if (clickCounter === 1) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                firstClickCoords = { x: x, y: y };
            } else {
                if (Math.abs(firstClickCoords.x - x) < 10 && Math.abs(firstClickCoords.y - y) < 10) {
                    ctx.lineTo(firstClickCoords.x, firstClickCoords.y);
                    ctx.stroke();
                    ctx.clip();
                    clickCounter = 0;
                    polygonPainted = true;
                    fillPolygon();
                } else {
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }

        lastClickCoords = { x: x, y: y };
    }

    function fillPolygon() {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        for (var y = 0; y < imageData.height; y++) {
            polygonCoords.push([]);
            for (var x = 0; x < imageData.width; x++) {
                var index = (x + y * imageData.width) * 4;

                if (data[index + 0] !== 0 && data[index + 1] !== 0 && data[index + 2] !== 0) {
                    polygonCoords[y].push(x);
                }
            }
        }

        ctx.fillStyle = "#F972FF";

        polygonCoords.forEach(function(xCoordsArray, y) {
            if (xCoordsArray.length > 1) {
                for (var i = 0; i < xCoordsArray.length - 1; i++) {
                    ctx.fillRect(xCoordsArray[i], y, xCoordsArray[i + 1], 1);
                }
            }
        });

        console.log(polygonCoords);
    };
});