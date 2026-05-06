const songs = [
  {
    title: "Maravilhoso és, Rei Santo, Sopra Espírito",
    author: "Medley",
    file: "songs/medley_maravilhoso_es.mp3",
    cover: "images/capa_medley_maravilhoso_es.jpg",
    time: "5:27"
  },
  {
    title: "Feliz Serás, Como um Anjo serei, céu, morada de Deus",
    author: "Medley",
    file: "songs/feliz_seras.mp3",
    cover: "images/capa_medley_feliz_seras.jpg",
    time: "5:46"
  },
  {
    title: "Tudo é Perda",
    author: "Felipe Rodrigues",
    file: "songs/tudo_e_perda.mp3",
    cover: "images/capa_tudo_e_perda.jpg",
    time: "8:39"
  },
  {
    title: "Nos Braços do Pai",
    author: "Sync 3",
    file: "songs/nos_bracos_do_pai.mp3",
    cover: "images/capa_nos_bracos_do_pai.jpg",
    time: "8:12"
  },
  {
    title: "Jamais se Viu Maior Amor",
    author: "Coral Filadélfia",
    file: "songs/jamais_se_viu_maior_amor.mp3",
    cover: "images/capa_jamas_se_viu_maior_amor.jpg",
    time: "3:47"
  },
  {
    title: "Vem Senhor",
    author: "Stella Laura",
    file: "songs/vem_senhor.mp3",
    cover: "images/capa_vem_senhor.jpg",
    time: "5:24"
  }
];

let current = 0;

// ELEMENTOS
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const author = document.getElementById("author");
const coverMini = document.getElementById("coverMini");
const progress = document.getElementById("progress");
const playlistDiv = document.getElementById("playlist");

// RENDER PLAYLIST
function renderPlaylist() {
  songs.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "song";

    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${s.cover}" class="song-cover">
        <div>
          <div>${s.title}</div>
          <div class="song-meta">${s.author}</div>
          <div class="song-meta">${s.time}</div>
        </div>
      </div>
    <span class="play-icon" id="icon-${i}">▶</span>`;

    div.onclick = () => playSong(i);
    div.id = "song-" + i;

    playlistDiv.appendChild(div);
  });
}

// DESTACAR ATUAL
function highlight() {
  songs.forEach((_, i) => {
    const songEl = document.getElementById("song-" + i);
    const iconEl = document.getElementById("icon-" + i);

    songEl.classList.remove("active");
    iconEl.innerText = "▶";
  });

  const activeSong = document.getElementById("song-" + current);
  const activeIcon = document.getElementById("icon-" + current);

  activeSong.classList.add("active");
  activeIcon.innerText = "⏸"; // ou "❚❚"
}

// MOSTRAR PLAYER
function showPlayer() {
  document.querySelector(".player").style.display = "block";
}

// TOCAR MÚSICA
function playSong(index) {
  showPlayer();

  current = index;

  audio.src = songs[index].file;
  audio.play();

  title.innerText = songs[index].title;
  author.innerText = songs[index].author;
  coverMini.src = songs[index].cover;

  updatePlayIcon(true);
  highlight();
}

// PRÓXIMA
function next() {
  current = (current + 1) % songs.length;
  playSong(current);
}

// ANTERIOR
function prev() {
  current = (current - 1 + songs.length) % songs.length;
  playSong(current);
}

// PLAY / PAUSE
function toggle() {
  if (audio.paused) {
    audio.play();
    updatePlayIcon(true);
  } else {
    audio.pause();
    updatePlayIcon(false);
  }
}

// ÍCONE PLAY/PAUSE (Font Awesome)
function updatePlayIcon(isPlaying) {
  const icon = document.getElementById("playIcon");

  if (!icon) return;

  icon.classList.remove("fa-circle-play", "fa-circle-pause");

  icon.classList.add(
    isPlaying ? "fa-circle-pause" : "fa-circle-play"
  );
}

// AUTO NEXT
audio.addEventListener("ended", next);

// PROGRESS BAR
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  progress.value = percent;

  // 👇 atualiza o gradiente
  progress.style.setProperty('--progress', percent + '%');
});

// RESET AO CARREGAR NOVA MÚSICA
audio.addEventListener("loadedmetadata", () => {
  progress.value = 0;
});

// SEEK BAR
progress.addEventListener("input", () => {
  if (!audio.duration) return;

  audio.currentTime = (progress.value / 100) * audio.duration;
});

// SHARE
function share() {
  if (navigator.share) {
    navigator.share({
      title: "Playlist Pré-Congresso",
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado!");
  }
}

// INIT
renderPlaylist();