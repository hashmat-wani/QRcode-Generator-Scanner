let bodyWidth = document.querySelector("body").clientWidth;
let mobileView = bodyWidth > 768 ? false : true;

let isScanning = false;

const resultPopUp = document.querySelector(".mobile-result");
const resultPopUpText = document.querySelector(".mobile-result .result-text");

document.querySelector(".fa-arrow-left-long").addEventListener("click", () => {
  resultPopUp.classList.remove("show");
});

const navItems = document.querySelectorAll("nav div");
const containers = document.querySelectorAll(".container");

// adding eventlistener on all nav items
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    // remove active class from all divs
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
    // add active to clickedone
    item.classList.add("active");

    // same with containers
    containers.forEach((item) => {
      item.classList.remove("active");
    });

    document.querySelector(`#${item.id}-container`).classList.add("active");
  });
});

document.querySelector("#scanner").addEventListener("click", (e) => {
  if (mobileView) {
    startCamera(e);
    isScanning = true;
  }
});

document.querySelector("#generator").addEventListener("click", (e) => {
  isScanning && html5QrCode.stop();
  isScanning = false;
});

const customPicker = document.querySelectorAll(".custom-picker");
const colorPicker = document.querySelectorAll(".color-picker");

customPicker.forEach((item) => {
  item.addEventListener("click", () => {
    item.querySelector(".color-picker").click();
  });
});

colorPicker.forEach((item) => {
  item.addEventListener("change", (e) => {
    color = e.target.value;
    span = item.parentElement.querySelector("span");
    input = item.parentElement.querySelector("input[type=text]");
    span.style.backgroundColor = color;
    input.value = color;
  });
});

const customDropdown = document.querySelectorAll(".custom-dropdown");

customDropdown.forEach((item) => {
  // select all options inside a custom dropdown
  options = item.querySelectorAll(".option");
  // add event listenenr on all options
  options.forEach((option) => {
    option.addEventListener("click", () => {
      // select all options of current options parent to remove active class
      allOptions = option.parentElement.querySelectorAll(".option");
      allOptions.forEach((item) => {
        item.classList.remove("active");
      });

      // add active on clicked
      option.classList.add("active");
      // updare selected text
      item.querySelector(".selected").innerHTML = option.innerHTML;
      generateQrCode();
    });
  });
});

const uploadElem = document.querySelector(".upload-img");
const uploadImgInput = document.querySelector("#upload-img-input");
const clearLogo = document.getElementById("clear-logo");

uploadElem.addEventListener("click", () => {
  uploadImgInput.click();
});
uploadImgInput.addEventListener("change", (e) => {
  document.getElementById("clear-logo").classList.remove("active");
  // on change get the file content
  const file = e.target.files[0];
  if (!file) return;
  // render the file with fileReader
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // img is next to file input, select it and change src
    uploadImgInput.nextSibling.nextSibling.src = reader.result;
    generateQrCode();
  };
});
clearLogo.addEventListener("click", () => {
  imageRadios.forEach((item) => {
    item.checked = false;
  });
  clearLogo.classList.add("active");
  generateQrCode();
});

// Size
const range = document.querySelector(".custom-slider input");
const tooltip = document.querySelector(".custom-slider span");
// move tooltip with the slider
function setValue() {
  const newValue = Number(
    ((range.value - range.min) * 100) / (range.max - range.min)
  );

  const newPosition = 16 - newValue * 0.32;
  tooltip.innerHTML = `${range.value} x ${range.value}`;
  tooltip.style.left = `calc(${newValue}% + (${newPosition}px))`;
}

document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener("input", setValue);

// lets create functionality to generate QR code with options provided

const container = document.querySelector(".qr-code-img");
const generateBtn = document.querySelector(".generate-btn");

const width = document.querySelector("#size"),
  // width and height will be same
  height = document.querySelector("#size"),
  data = document.querySelector("#text"),
  foregroundColor = document.querySelector("#fg-color"),
  backgroundColor = document.querySelector("#bg-color"),
  cornerColor = document.querySelector("#corner-color"),
  imageRadios = document.querySelectorAll("input[name='logo']"),
  dotsStyle = document.querySelector("#dots-style"),
  cornerSquaresStyle = document.querySelector("#corner-squares-style"),
  cornerDotsStyle = document.querySelector("#corner-dots-style");

// generate QR code on value change
width.addEventListener("change", generateQrCode);
height.addEventListener("change", generateQrCode);
data.addEventListener("input", generateQrCode);
foregroundColor.addEventListener("change", generateQrCode);
backgroundColor.addEventListener("change", generateQrCode);
cornerColor.addEventListener("change", generateQrCode);
generateBtn.addEventListener("click", generateQrCode);
imageRadios.forEach((item) => {
  item.addEventListener("change", generateQrCode);
  item.addEventListener("change", () => {
    clearLogo.classList.remove("active");
  });
});

// function to generate QR code
function generateQrCode() {
  // console.log("generating");
  // get selected image radio
  let imageRadio = document.querySelector("input[name='logo']:checked");
  // select corresponding image
  let image = document.getElementById(imageRadio?.value) || null;

  qrCode = new QRCodeStyling({
    width: width.value,
    height: height.value,
    data: data?.value || "welcome to hashtech",
    margin: 10,
    type: "canvas",
    image: image?.src || null,
    imageOptions: {
      saveAsBlob: true,
      crossOrigin: "anonymous",
      margin: 15,
    },
    dotsOptions: {
      color: foregroundColor.value,
      type: dotsStyle.innerHTML,
    },
    backgroundOptions: {
      color: backgroundColor.value,
    },
    cornersSquareOptions: {
      color: cornerColor.value,
      type: cornerSquaresStyle.innerHTML,
    },
    cornersDotOptions: {
      color: cornerColor.value,
      type: cornerDotsStyle.innerHTML,
    },
  });
  // after generating, show on DOM
  container.innerHTML = "";
  qrCode.append(container);
}
generateQrCode();

// download functionalities
const downloadPng = document.getElementById("download-png"),
  downloadJpg = document.getElementById("download-jpg"),
  downloadSvg = document.getElementById("download-svg");

downloadPng.addEventListener("click", () => {
  qrCode.download({
    // five file a name
    name: "hashtech-" + Date.now(),
    // file extension
    extension: "png",
  });
});
downloadJpg.addEventListener("click", () => {
  qrCode.download({
    // five file a name
    name: "hashtech-" + Date.now(),
    // file extension
    extension: "jpg",
  });
});
downloadSvg.addEventListener("click", () => {
  qrCode.download({
    // five file a name
    name: "hashtech-" + Date.now(),
    // file extension
    extension: "svg",
  });
});

// ----------SCANNER------------

const dropZone = document.querySelector(".dropzone"),
  dropZoneInput = document.querySelector("#file"),
  dropZoneText = document.querySelector(".dropzone .text"),
  content = dropZone.querySelector(".content"),
  img = dropZone.querySelector("img"),
  scanReader = document.getElementById("reader");

scanReader.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// when a file is hovered on drop zone
const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  // add highlight class to highlight dropZone
  dropZone.classList.add("highlight");
};
dropZone.addEventListener("dragover", handleDragOver);

// removing highlight class on drag leave
const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove("highlight");
};
dropZone.addEventListener("dragleave", handleDragLeave);

// HANDLE FILE-DROP

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();

  // get a file
  const file = e.dataTransfer.files[0];

  // add file to input file
  dropZoneInput.files = e.dataTransfer.files;

  // if file exists
  if (dropZoneInput.files.length) {
    // if file is empty
    if (!file) return;
    // if selected file is image or other
    if (!checkFile(file)) return;

    let formData = new FormData();
    formData.append("file", file);
    fetchRequest(file, formData);
  }
};
dropZone.addEventListener("drop", handleDrop);

// CHECK FILE FUNCTION
function checkFile(file) {
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (validTypes.indexOf(file.type) === -1) {
    dropZoneText.innerHTML = "Please select an image file";
    return false;
  }
  return true;
}

// Fetching qr result
const resultTextArea = document.getElementById("result");

function fetchRequest(file, formData) {
  dropZoneText.innerHTML = "Scanning QR Code ...";
  fetch("https://api.qrserver.com/v1/read-qr-code/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      result = result[0].symbol[0].data;
      dropZoneText.innerHTML = result
        ? "Drag QR Code here or"
        : "Couldn't scan QR Code";
      if (!result) {
        reset();
        return;
      }
      if (mobileView) {
        resultPopUp.classList.add("show");
        resultPopUpText.textContent = result;
      } else resultTextArea.innerHTML = result;

      // show buttons only when there is some text in textarea
      document.querySelector("#result-btns").classList.add("active");

      // show image in dropzone
      updateThumbnail(file);
    })
    .catch((err) => {
      reset();
      dropZoneText.innerHTML = "Couldn't scan QR Code";
    });
}

// reset function
function reset() {
  dropZone.style.border = "2px dashed #5a4ca1";
  document.querySelector("#result-btns").classList.remove("active");
  scanReader.classList.remove("show");
  img.src = "";
  img.classList.remove("show");
  content.classList.add("show");
  resultTextArea.innerText = "";
  if (mobileView) resultPopUp.classList.remove("show");
  dropZone.style.height = "350px";
  cameraAccess.classList.add("show");
  scannerOptions.classList.remove("show");
}

// updateThumbnail
function updateThumbnail(file) {
  dropZone.style.border = "none";
  scanReader.classList.remove("show");
  dropZone.style.height = "400px";
  scannerOptions.classList.remove("show");
  cameraAccess.classList.add("show");
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    img.src = reader.result;
    img.classList.add("show");
    content.classList.remove("show");
  };
}

content.addEventListener("change", browseImage);

document.querySelectorAll(".copy").forEach((el, idx) => {
  el.addEventListener("click", () => {
    let text =
      idx == 0
        ? resultPopUpText.textContent
        : document.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
  });
});

document.querySelectorAll(".open").forEach((el, idx) => {
  el.addEventListener("click", () => {
    let text =
      idx == 0
        ? resultPopUpText.textContent
        : document.querySelector("textarea").textContent;
    window.open(`http://www.google.com/search?btnG=1&pws=0&q=${text}`);
  });
});

const html5QrCode = new Html5Qrcode("reader");
function scan() {
  isScanning = true;
  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    /* handle success */
    // console.log(decodedText);
    let beep = new Audio("./scan-beep.wav");
    beep.volume = 0.05;
    beep.play();
    navigator.vibrate(80);
    if (mobileView) {
      resultPopUp.classList.add("show");
      resultPopUpText.textContent = decodedText;
    } else handleScanSuccess(decodedText);

    html5QrCode
      .stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
        isScanning = false;
        dropZone.style.height = "350px";
        dropZone.style.border = "2px dashed #5a4ca1";
        scanReader.classList.remove("show");
        content.classList.add("show");
        cameraAccess.classList.add("show");
        scannerOptions.classList.remove("show");
      })
      .catch((err) => {
        // console.log(err);
        // Stop failed, handle it.
      });
  };

  const config = {
    fps: 10,

    qrbox: mobileView
      ? { width: 250, height: 250 }
      : { width: 315, height: 315 },
    aspectRatio: mobileView ? 450 / 350 : 350 / 450,
  };

  // prefering back camera
  html5QrCode.start(
    { facingMode: "environment" },
    config,
    qrCodeSuccessCallback
  );
}

const cameraAccess = document.querySelector(".fa-camera");
const galleryAccess = document.querySelector(".fa-images");
const closeScan = document.querySelector(".fa-xmark");
const scannerOptions = document.querySelector(".scanner-options");

cameraAccess.addEventListener("click", startCamera);

function startCamera(e) {
  e.preventDefault();
  e.stopPropagation();
  cameraAccess.classList.remove("show");
  dropZone.style.height = "450px";
  dropZone.style.border = "none";
  scan();
  scanReader.classList.add("show");
  scanReader.style.width = "100%";
  scanReader.style.height = "100%";
  img.src = "";
  img.classList.remove("show");
  content.classList.remove("show");
  resultTextArea.innerText = "";
  scannerOptions.classList.add("show");
}

galleryAccess.addEventListener("click", browseImage);

closeScan.addEventListener("click", quitScan);

function browseImage(e) {
  let file = e?.target?.files[0];
  if (!file) return;
  isScanning && html5QrCode.stop();
  isScanning = false;
  let formData = new FormData();
  formData.append("file", file);
  fetchRequest(file, formData);
}

function handleScanSuccess(decodedText) {
  resultTextArea.innerHTML = decodedText;
  document.querySelector("#result-btns").classList.add("active");
}

function quitScan(e) {
  e.preventDefault();
  e.stopPropagation();
  html5QrCode.stop().then((ignore) => {
    isScanning = false;
    reset();
  });
}
