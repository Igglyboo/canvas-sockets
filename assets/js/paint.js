function init(canvasId, brushId, eraserId, resetId, saveId, imgHolder) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");

    var brush = document.getElementById(brushId);
    var eraser = document.getElementById(eraserId);
    var reset = document.getElementById(resetId);
    var save = document.getElementById(saveId);

    var brushColor = brush.value;
    var eraserColor = eraser.value;

    var image = new Image();
    document.getElementById(imgHolder).appendChild(image);

    var prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0;

    var flag = false,
        dot_flag = false;

    var draw = function(color){
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    };

    var findxy = function(res, e){
        var color = e.button === 2 ? eraserColor : brushColor;

        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;

            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }

        if (res == 'up' || res == "out") {
            flag = false;
        }

        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw(color);
            }
        }
    };

    canvas.onmousemove = function(e){findxy('move', e)};
    canvas.onmousedown = function(e){findxy('down', e)};
    canvas.onmouseup = function(e){findxy('up', e)};
    canvas.onmouseout = function(e){findxy('out', e)};
    canvas.oncontextmenu = function(){return false;};

    brush.onchange = function(){brushColor = this.value};
    eraser.onchange = function(){eraserColor = this.value};
    reset.onclick = function(){ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.restore();};
    save.onclick = function(){image.src = canvas.toDataURL();};
}




