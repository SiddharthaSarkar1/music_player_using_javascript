// Selecting all the required tags and elements

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar");


let musicIndex = 2;

window.addEventListener("load", () => {
    //Calling load music function once the window is loaded
    loadMusic(musicIndex);
});

// Load music function
function loadMusic(indexNumber){
    musicName.innerText = allMusic[indexNumber - 1].name;
    musicArtist.innerText = allMusic[indexNumber - 1].artist;
    musicImg.src = `img/${allMusic[indexNumber - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumber - 1].src}.mp3`;
}

//Play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//Pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//Next music function
function nextMusic(){
    //Here we are incrementing the index by 1
    musicIndex++;
    //If music index is greater than array length then musicIndex will be 1.
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//Previous music function
function prevMusic(){
    //Here we are decrementing the index by 1
    musicIndex--;
    //If music index is lesser than 1 length then musicIndex will be array length.
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//Play or Pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //If isMusicPaused is true then call pauseMusic() or call playMusic()
    isMusicPaused ? pauseMusic() : playMusic();
});

//Next music btn event
nextBtn.addEventListener("click", () => {
    //calling next music function
    nextMusic();
});

//Previous music btn event
prevBtn.addEventListener("click", () => {
    //calling previous music function
    prevMusic();
});

//Updating progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    //getting current time of song
    const currentTime = e.target.currentTime;
    //getting total duration of song
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        //Update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            //Adding 0 if secound is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //Update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        //Adding 0 if secound is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//Updating playing song current time according to the progress bar
progressArea.addEventListener("click", (e) => {
    let progressWithValue = progressArea.clientWidth; //getting the width of progress bar
    let checkedOffSetX = e.offsetX; //gettinf offset X value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (checkedOffSetX / progressWithValue) * songDuration;
    playMusic();
});