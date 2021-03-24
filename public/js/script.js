let domanin = "./manguon";
let page = 1;
let checkTimKiem = false;
let gototop = document.getElementById("gototop");
let isplaying = false;
let myaudio = document.getElementById("audio");
let progress = document.getElementById("progress");
let progress1 = $("#progress");
let cdthumb = document.getElementsByClassName("cd-thumb")[0];
let isChange = false;
let dashboard = document.getElementsByClassName("dashboard")[0];
let modelLogin = document.getElementById("modal-login");
let islogin = false;
let background = document.getElementsByClassName("background")[0];
let sttTimKiem = 0;
let idplay;
let isFinished = false;

let getCookie = (cname = "luotnghe") => {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

let setLuotnghe = (cname = "luotnghe", val = getCookie()) => {
  document.cookie = cname + "=" + (parseInt(val) + 1) + "; ";
};
let setCookie = (cname, val) => {
  document.cookie = cname + "=" + val + "; ";
};

let getMusic = async (kw, page) => {
  let a = await fetch(`${domanin}?kw=${kw}&page=${page}`);
  return await a.json();
};

let getLinkMusic = async (key1) => {
  let a = await fetch(
    `http://m.nhaccuatui.com/ajax/get-media-info?key1=${key1}`
  );
  return await a.json();
};

let login = async (usn, pws) => {
  let a = await fetch(`./login`, {
    method: "POST",
    body: JSON.stringify({
      user: usn,
      pws: pws,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await a.json();
};

let timKiem = () => {
  let loadmuic = document.getElementById("div_loadmusic");
  loadmuic.innerHTML = "";
  themData();
  checkTimKiem = true;
  page = 1;
};

let openlogin = () => {
  background.classList.add("backgroundon");
  modelLogin.style.display = "block";
};
let closelogin = () => {
  background.classList.remove("backgroundon");
  modelLogin.style.display = "none";
};
let loadUserFromCookie = () => {
  let lilogin = document.getElementsByClassName("li_login")[0];
  let lilogout = document.getElementsByClassName("li_logout")[0];
  if (getCookie("username") != "") {
    document.getElementById("nameuser").innerText =
      "Xin Chào, " + getCookie("username");
    islogin = true;
    lilogin.style.display = "none";
    lilogout.style.display = "flex";
  } else {
    islogin = false;
    lilogin.style.display = "block";
    lilogout.style.display = "none";
  }
};
let logout = () => {
  setCookie("username", "");
  loadUserFromCookie();
  setLuotnghe("luotnghe", 0);
};
let dangnhap = () => {
  let username = document.getElementById("txtusername").value;
  let pass = document.getElementById("txtpsw").value;
  login(username, pass).then((data) => {
    if (data.statusdn == 200) {
      closelogin();
      setCookie("username", username);
      loadUserFromCookie();
    } else {
      console.log("dn that bai");
      document.getElementById("divstatusdn").innerText =
        "Sai tên đăng nhập hoặc mật khẩu";
    }
  });
};

let themData = () => {
  isFinished = true;
  let load = document.getElementById("div_load");

  load.style.display = "block ";

  let kwtimkiem = document.getElementById("kwtimkiem").value;
  let loadmuic = document.getElementById("div_loadmusic");
  getMusic(kwtimkiem, page).then((musics) => {
    if (!musics[1].datasong.length > 0) {
      checkTimKiem = false;
      sttTimKiem = 0;
      page = 1;
    }
    let kqsearch = document.getElementById("ketquatim");
    kqsearch.innerText = musics[0].count;
    musics[1].datasong.forEach((music) => {
      let mis = `<div class="package__container" id='sttnghe${sttTimKiem}' encryptKey="${music.encryptKey}"
            youtokey="${music.keyyotu}" href="javascript:;"
            onclick="loadNhac(${sttTimKiem},'${music.encryptKey}','${music.keyyotu}')" style='cursor: pointer;'>
            <div class="cover cover--6-month"
                style="background: no-repeat url(${music.linkHinh}) center;"></div>
            <div class="package__info" style="width:40%">
                <div class="package__month">${music.tenCaSi}</div>
                <div class="package__line"></div>
                <div class="package__price">
                    <div class="new-price">
                        <div class="before-dot">${music.tenBaiHat}</div>

                    </div>
                    <!-- <s class="old-price">354.000 VNĐ</s> -->
                </div>
            </div>
            <div class="package__action" style='margin:auto;'>
                
            `;
      if (
        music.keyyotu == null ||
        music.keyyotu == "" ||
        music.keyyotu == undefined
      ) {
        mis += `<a class="package__btn btn_download" onclick="downloadNhac('${music.encryptKey}');"
                href="javascript:;"><i class="fas fa-download"></i></a>
                </div>
                `;
      }
      mis += `</div>`;

      loadmuic.innerHTML += mis;
      sttTimKiem++;
    });

    load.style.display = "none";
    isFinished = false;
  });
};

let loadNhac = (play, encryptkey = "", keyouto = "") => {
  if (getCookie("luotnghe") > 5 && !islogin) {
    alert("ban da nghe qua 5 lan, vui long dang nhap de nghe");
    openlogin();
  } else {
    setLuotnghe();

    if (encryptkey != undefined) {
      idplay = play;
      let parrent = document.getElementById(`sttnghe${idplay}`).parentElement
        .parentElement;
      let background = parrent.getElementsByClassName("cover")[0];
      background.style.background =
        " no-repeat url('../assets/images/playmusic.gif') center;";
      let offsety = parrent.offsetTop + $(window).height() * 0.8;
      console.log();
      common(offsety, 200);
      getLinkMusic(encryptkey).then((links) => {
        // console.log(links.data.location)

        let nameSong = document.getElementById("namesong");
        let tencasi = document.getElementById("tencasi");
        myaudio.setAttribute("src", links.data.location);
        nameSong.innerText = links.data.title;
        tencasi.innerText = links.data.singerTitle;
        cdthumb.style.backgroundImage = `url('${links.data.thumb}')`;
        playAudio();
        dashboard.style.display = "flex";
      });
    }

    if (keyouto != null && keyouto != "" && keyouto != undefined) {
      document.getElementsByClassName("videoyouto")[0].style.display = "block";

      document
        .getElementById("jframyouto")
        .setAttribute("src", `https://www.youtube.com/embed/${keyouto}`);
      stopAudio();
    }
  }
};

let playAudio = () => {
  let playbtn = document.getElementsByClassName("btn-toggle-play")[0];
  isplaying = true;
  myaudio.play();
  playbtn.classList.add("playing");
  cdThumbAnimate.play();
};
let stopAudio = () => {
  let playbtn = document.getElementsByClassName("btn-toggle-play")[0];
  myaudio.pause();
  playbtn.classList.remove("playing");
  isplaying = false;
  cdThumbAnimate.pause();
};

let cdThumbAnimate = cdthumb.animate([{ transform: "rotate(360deg)" }], {
  duration: 15000,
  iterations: Infinity,
});
cdThumbAnimate.pause();

window.onscroll = () => {
  if (
    document.documentElement.scrollTop > 200 ||
    document.body.scrollTop > 200
  ) {
    document.getElementById("gototop").style.display = "block";
  } else {
    document.getElementById("gototop").style.display = "none";
  }
  if (checkTimKiem) {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      page++;
      // console.log(page)
      themData();
    }
  }
};

function common(sTop = 0, duration = 1000) {
  $("html, body").animate(
    {
      scrollTop: sTop,
    },
    duration
  );
}

progress.onchange = () => {
  myaudio.currentTime = (progress.value * myaudio.duration) / 100;
};
progress.onmousedown = () => {
  isChange = true;
};
progress.onmouseup = () => {
  isChange = false;
};

myaudio.ontimeupdate = () => {
  if (!isChange) {
    progress.value = (myaudio.currentTime * 100) / myaudio.duration;
  }
};
myaudio.onended = () => {
  nextMusic();
};

let downloadNhac = (keydownload) => {
  console.log("vo day");
  if (getCookie("username") != "") {
    getLinkMusic(keydownload).then((links) => {
      // console.log()

      document.getElementById("my_iframedownload").src = links.data.location;
      // return links.data.location;
    });
  } else {
    alert("Bạn cần đăng nhập để dowload nhạc.");
    openlogin();
  }
};

let nextMusic = () => {
  let i = 1;
  let a;
  let enkey;

  do {
    a = document.getElementById(`sttnghe${idplay + i}`);
    // console.log(a);
    if (a == null && checkTimKiem) {
      if (!isFinished) {
        page++;
        themData();
      } else {
        continue;
      }
    } else {
      enkey = a.getAttribute("encryptKey");
      if (
        enkey != "undefined" &&
        enkey != "" &&
        enkey != null &&
        enkey != undefined
      ) {
        loadNhac(idplay + i, enkey);
        break;
      } else {
        i++;
      }
    }
  } while (true);
};
let priMusic = () => {
  let i = 1;
  let a;
  let enkey;

  do {
    a = document.getElementById(`sttnghe${idplay - i}`);
    // console.log(a);
    if (a == null && idplay - i <= 0) {
      break;
    } else {
      enkey = a.getAttribute("encryptKey");
      if (
        enkey != "undefined" &&
        enkey != "" &&
        enkey != null &&
        enkey != undefined
      ) {
        loadNhac(idplay - i, enkey);
        break;
      } else {
        i++;
      }
    }
  } while (true);
};

window.onload = () => {
  if (getCookie() == null || getCookie() == "" || getCookie() == undefined) {
    setLuotnghe("luotnghe", 0);
  }
  loadUserFromCookie();

  let btnSearch = document.getElementById("btnsearch");
  btnSearch.addEventListener("click", () => {
    timKiem();
  });

  document.getElementById("btn_gotop").addEventListener("click", () => {
    common();
  });
  document.getElementById("quaylai").addEventListener("click", () => {
    document.getElementById("jframyouto").setAttribute("src", ``);
    document.getElementsByClassName("videoyouto")[0].style.display = "none";
    document
      .getElementById("jframyouto")
      .contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
  });

  document
    .getElementsByClassName("btn-toggle-play")[0]
    .addEventListener("click", () => {
      if (isplaying) {
        stopAudio();
      } else {
        playAudio();
      }
    });
  document.getElementById("btnlogin").addEventListener("click", () => {
    dangnhap();
  });
};
