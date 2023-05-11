let prev_num = 0;
function changeImage(imagePath) {
  if (imagePath === 'random.jpg') {
    let randomNumber = Math.floor(Math.random() * 5) + 1;
    while (1) {
      if (randomNumber !== prev_num) {
        prev_num = randomNumber;
        break;
      }
      randomNumber = Math.floor(Math.random() * 5) + 1;
    }
    imagePath = randomNumber.toString() + '.jpg';
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
  // context.drawImage(originalCanvas, 0, 0, newCanvas.width, newCanvas.height);

  const labels = document.querySelectorAll('label');
  var cnt = 0;
  labels.forEach((label) => {
    let dx = 0;
    let dy = 0;
    let dWidth = 0;
    let dHeight = 0;
    const img = label.querySelector('img');
    if (img) {
      const rect = label.getBoundingClientRect();
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const labelAspectRatio = rect.width / rect.height;

      let sourceWidth = img.naturalWidth;
      let sourceHeight = img.naturalHeight;
      let sourceX = 0;
      let sourceY = 0;

      if (imgAspectRatio > labelAspectRatio) {
        sourceWidth = img.naturalHeight * labelAspectRatio;
        sourceX = (img.naturalWidth - sourceWidth) / 2;
      } else {
        sourceHeight = img.naturalWidth / labelAspectRatio;
        sourceY = (img.naturalHeight - sourceHeight) / 2;
      }
      if (cnt === 0) {
        dx = 36;
        dy = 108;
        dWidth = 546;
        dHeight = 728.4;
      } else if (cnt === 1) {
        dx = 36 + 546 + 36;
        dy = 192;
        dWidth = 546;
        dHeight = 728.4;
      } else if (cnt === 2) {
        dx = 36;
        dy = 108 + 728.4 + 36;
        dWidth = 546;
        dHeight = 728.4;
      } else if (cnt === 3) {
        dx = 36 + 546 + 36;
        dy = 192 + 728.4 + 36;
        dWidth = 546;
        dHeight = 728.4;
      }
      context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, dx, dy, dWidth, dHeight);
    }
    cnt += 1;
  });

  const link = document.createElement('a');
  link.href = newCanvas.toDataURL('image/png');
  // link.download = 'bowm-4-cuts.png';
  // link.click();

  // 이미지 생성 후, 모달창에 이미지를 설정합니다.
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  modalImage.src = newCanvas.toDataURL("image/png");
  modal.style.display = "block";

  // 모달창 이외의 영역을 클릭하면 모달창이 닫히도록 설정합니다.
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function closeModal() {
  modal.style.display = "none";
}
  
function loadImage(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function (e) {
        const label = input.previousElementSibling;
        label.innerHTML = `<img src="${e.target.result}" style="width: 45.5vw; height: 60.7vw; object-fit: cover;">`;
      };
  
      reader.readAsDataURL(input.files[0]);
    }
}