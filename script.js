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

function loadFile(input) {
    var file = input.files[0];	//선택된 파일 가져오기

    //미리 만들어 놓은 div에 text(파일 이름) 추가
    var name = document.getElementById('fileName');
    name.textContent = file.name;

  	//새로운 이미지 div 추가
    var newImage = document.createElement("img");
    newImage.setAttribute("class", 'img');

    //이미지 source 가져오기
    newImage.src = URL.createObjectURL(file);   

    newImage.style.width = "70%";
    newImage.style.height = "70%";
    newImage.style.visibility = "hidden";   //버튼을 누르기 전까지는 이미지를 숨긴다
    newImage.style.objectFit = "contain";

    //이미지를 image-show div에 추가
    var container = document.getElementById('image-show');
    container.appendChild(newImage);
};