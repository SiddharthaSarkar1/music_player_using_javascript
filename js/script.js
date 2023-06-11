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
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;

window.addEventListener("load", () => {
    //Calling load music function once the window is loaded
    loadMusic(musicIndex);
    playMusicNow();
});

// Load music function
function loadMusic(indexNumber) {
    musicName.innerText = allMusic[indexNumber - 1].name;
    musicArtist.innerText = allMusic[indexNumber - 1].artist;
    musicImg.src = `img/${allMusic[indexNumber - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumber - 1].src}.mp3`;
}

//Play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//Pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//Next music function
function nextMusic() {
    //Here we are incrementing the index by 1
    musicIndex++;
    //If music index is greater than array length then musicIndex will be 1.
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playMusicNow();
}

//Previous music function
function prevMusic() {
    //Here we are decrementing the index by 1
    musicIndex--;
    //If music index is lesser than 1 length then musicIndex will be array length.
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playMusicNow();
}

//Play or Pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //If isMusicPaused is true then call pauseMusic() or call playMusic()
    isMusicPaused ? pauseMusic() : playMusic();
    playMusicNow();
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
        if (totalSec < 10) {
            //Adding 0 if secound is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //Update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
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

//Worked on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //First we get the inner text of the icon the we will change it accordingly
    let getText = repeatBtn.innerText; //getting inner text of icon
    //Let's do different changee's on different icon click using switch
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
});

//In the above section we just changed the icons, now lets work on what to do after the song ended
mainAudio.addEventListener("ended", () => {
    //We'll do according to the icon means if the used has set the icon as loop song then we'll repeat the current song and we'll do further accordingly

    let getText = repeatBtn.innerText; //getting inner text of icon
    //Let's do different changee's on different icon click using switch
    switch (getText) {
        case "repeat": //if this icon is repeat then we call the nextMusic() function
            nextMusic();
            break;
        case "repeat_one": //Changing currentTime of current song which is playing to play it again
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic(); //Calling playMusic function 
            break;
        case "shuffle":
            //Generating random index between max range of array length
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randomIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex); //Calling loadMisic function
            playMusic(); //Calling playMusic function 
            playMusicNow();
            break;
    }

});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTags = wrapper.querySelector("ul");

//Let's create li according to the array length
for (let i = 0; i < allMusic.length; i++) {
    //Passing the song and artist name from the list
    let liTag = `<li li-index="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;

    ulTags.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTags.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTags.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            //Adding 0 if secound is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //Adding t-duration attribute which will be used in below
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//Add onclick attribiute in all li
const allLiTags = ulTags.querySelectorAll("li");
function playMusicNow(){
    for(let j = 0; j < allLiTags.length; j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //Remove playing class from all other li tags
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            //Let's get the audio duration value and pass it to .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration")
            audioTag.innerText = adDuration;
        }
        //If there is an li tag which li-index is equal to musicIndex then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        //adding onclick attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}


//Play the song on li click
function clicked(element){
    //Getting li index of particular clicked li tag
    let getIndex = element.getAttribute("li-index");
    musicIndex = getIndex; //Passing the li index to musicIndex
    loadMusic(musicIndex);
    playMusic();
    playMusicNow();
}