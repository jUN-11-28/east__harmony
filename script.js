function changeImage(imagePath) {
    if (imagePath === 'random.png') {
        var randomNumber = Math.floor(Math.random() * 1) + 1;
        imagePath = randomNumber.toString() + '.png';
    }
    var frame = document.getElementById('frame');
    frame.src = 'frames/' + imagePath;
}

function saveCanvasAsImage() {
    const originalCanvas = document.getElementById('overlay-canvas');
    originalCanvas.hidden = false;
    const imageElement = document.getElementById('frame');
    const newCanvas = document.createElement('canvas');
    const context = newCanvas.getContext('2d');

    newCanvas.width = 1200;
    newCanvas.height = 1800;

    // 새로운 캔버스에 이미지를 그립니다.
    context.drawImage(imageElement, 0, 0, newCanvas.width, newCanvas.height);

    // 새로운 캔버스 위에 원래 캔버스의 내용을 그립니다.
    context.drawImage(originalCanvas, 0, 0, newCanvas.width, newCanvas.height);

    const image = newCanvas.toDataURL('image/png');
    const link = document.createElement('a');

    link.href = image;
    link.download = 'bowm-4Cuts.png';

    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: false,
        view: window,
    });

    link.dispatchEvent(clickEvent);
}