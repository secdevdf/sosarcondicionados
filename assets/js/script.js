let index = 0;
const slides = document.querySelectorAll(".carousel img");

function showSlide() {
    index++;
    if (index >= slides.length) {
        index = 0;
    }
    document.querySelector(".carousel").style.transform = `translateX(-${index * 100}vw)`;
}

setInterval(showSlide, 5000);
function initMap() {
    const mapOptions = {
        center: { lat: -23.5505, lng: -46.6333 },
        zoom: 12
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const marker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        title: "Estamos aqui!"
    });
}

const videoFolder = "assets/photos/";
const videoList = ["pablo1.mp4", "pablo2.mp4", "pablo3.mp4", "pablo4.mp4", "pablo5.mp4", "pablo6.mp4", "pablo7.mp4", "pablo8.mp4", "pablo9.mp4", "pablo10.mp4", "pablo11.mp4", "pablo12.mp4"];
const container = document.querySelector('.video-container');
const totalVideos = videoList.length;

videoList.forEach(video => {
    const videoElement = document.createElement('video');
    videoElement.src = `${videoFolder}${video}`;
    videoElement.controls = true;
    container.appendChild(videoElement);
});

let currentIndex = 0;

const updateCarousel = () => {
    const videoWidth = container.querySelector('video').offsetWidth;
    container.style.transform = `translateX(-${currentIndex * videoWidth}px)`;
};

document.querySelector('.arrow-left').addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

document.querySelector('.arrow-right').addEventListener('click', () => {
    if (currentIndex < totalVideos - 1) {
        currentIndex++;
        updateCarousel();
    }
});

window.addEventListener('resize', updateCarousel);
