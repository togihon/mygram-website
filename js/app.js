var email = document.querySelector('[name="email"]')
var username = document.querySelector('[name="username"]')
var password = document.querySelector('[name="password"]')
var age = document.querySelector('[name="age"]')
var id = document.querySelector('[name="id"]')
var token = document.querySelector('[name="token"]')
var loading = document.querySelector(".loading")
var preview = document.querySelector('#preview');
var fileInput = document.querySelector('#file-upload');
var text = document.querySelector('.text');

var TIME_ON_SCREEN = 2000;

function createElement(id, className, innerHTML = '') {
    var el = document.createElement('div');
    el.id = id;
    el.className = className;
    el.innerHTML = innerHTML;
    return el;
};

function notify(msg) {
    var exists = document.querySelectorAll('.notify');
    if (exists.length < 1) {
        var uid = `notify-${new Date().getTime()}`;
        var newEl = createElement(uid, 'notify');
        var text = createElement('', 'notify-text', msg);
        newEl.appendChild(text);

        document.body.appendChild(newEl);
        newEl.style.bottom = (10 + 55 * (exists.length)) + 'px';

        setTimeout(function () {
            newEl.className += ' notify-active';
        }, 0);

        setTimeout(function () {
            newEl.className = ' notify';
        }, TIME_ON_SCREEN);

        setTimeout(function () {
            newEl.parentNode.removeChild(newEl);
        }, TIME_ON_SCREEN + 500);
    }

};

function previewImage() {
    var reader = new FileReader();

    reader.onload = function () {
        text.setAttribute("style", "display:none")
        preview.hidden = false
        preview.src = reader.result;
    }

    if (fileInput.files[0]) {
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function loginAccount() {
    if (!email.value == "" && !password.value == "") {
        loading.classList.remove("hidden")

        fetch("https://mygram-production-2f89.up.railway.app/users/login", {
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                password: password.value
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
            .then(data => {
                if (!data.success) {
                    loading.classList.add("hidden")
                    notify(data.message)
                } else if (data.success) {
                    location.href = 'http://localhost/mygram/?set_token=' + data.data["token"]
                }
            })
            .catch(err => console.log(err))
    } else {
        notify("Email dan password tidak boleh kosong!")
    }

}

function registerAccount() {
    if (!email.value == "" && !password.value == "" && !username.value == "" && !age.value == 0) {
        loading.classList.remove("hidden")
        fetch("https://mygram-production-2f89.up.railway.app/users/register", {
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                username: username.value,
                password: password.value,
                age: parseInt(age.value)
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then(response => response.json())
            .then((data) => {

                var checkEmail = data.message.includes("email")
                var checkPassword = data.message.includes("Password")
                var checkAge = data.message.includes("8")

                if (checkEmail) {
                    email.value = ""
                }
                if (checkPassword) {
                    password.value = ""
                }
                if (checkAge) {
                    age.value = ""
                }
                if (data.message.includes(";")) {
                    data.message = data.message.replace(/;/g, "<br>");
                }
                if (!checkAge && !checkPassword && !checkAge) {
                    email.value = ""
                    password.value = ""
                    username.value = ""
                    age.value = ""
                }
                loading.classList.add("hidden")

                notify(data.message)
            })
            .catch(err => console.log(err))
    } else {
        notify("Tidak boleh ada field yang kosong!")
    }
}

function uploadPhoto() {
    var title = document.querySelector('[name="title"]')
    var caption = document.querySelector('[name="caption"]')
    var photo = document.getElementsByName('user-photo')[0]

    loading.classList.remove("hidden")

    if (photo.files.length == 0) {
        notify("Silakan pilih foto terlebih dahulu")
        loading.classList.add("hidden")
    }

    const form_data = new FormData()
    form_data.append('photo', photo.files[0])
    form_data.append('title', title.value)

    fetch("http://localhost/mygram/php/upload.php", {
        method: "POST",
        body: form_data
    }).then(response => response.text())
        .then(link => {
            fetch("https://mygram-production-2f89.up.railway.app/photos", {
                method: "POST",
                body: JSON.stringify({
                    title: title.value,
                    caption: caption.value,
                    photo_url: link,
                }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "Authorization": "Bearer " + token.value
                }
            }).then(response => response.json())
                .then(data => {
                    loading.classList.add("hidden")
                    if (!data.success) {
                        notify(data.message);
                    } else if (data.success) {
                        title.value = ""
                        caption.value = ""
                        preview.hidden = true
                        text.removeAttribute("style", "display:block")
                        fileInput.value = null
                        notify(data.message)
                    }
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

function showModal(id) {
    var popup = document.querySelector(".pop-up")
    const select = document.getElementById('text-modal');
    var btn = createElement('select', 'select', '<button class="yes" onclick="return deletePhoto(' + id + ')">YA</button><button class="no">TIDAK</button>');

    select.parentNode.insertBefore(btn, select)
    popup.classList.remove("hidden")

    var no = document.querySelector(".no")
    no.addEventListener("click", () => {
        popup.classList.add("hidden")
        select.parentNode.removeChild(btn)
    })

}

function deletePhoto(id) {
    var popup = document.querySelector(".pop-up")
    popup.classList.add("hidden")
    loading.classList.remove("hidden")
    fetch("https://mygram-production-2f89.up.railway.app/photos/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token.value
        }
    }).then(response => response.json())
        .then((data) => {
            notify(data.message)
            loading.classList.add("hidden")
            location.reload()
        })
        .catch(err => console.log(err))

}

function toogleComment(id) {
    const commentSection = document.getElementById('comment-section-' + id);
    commentSection.hidden = !commentSection.hidden;
}

function addComment(id) {
    var message = document.querySelector('[name="message-' + id + '"]');
    const commentSection = document.getElementById('comment-section-' + id);
    var exists = document.querySelectorAll('.comment-card');
    const comment = document.getElementById('add-comment-' + id);

    fetch("https://mygram-production-2f89.up.railway.app/comments", {
        method: "POST",
        body: JSON.stringify({
            photo_id: id,
            message: message.value
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + token.value
        }
    }).then(response => response.json())
        .then((data) => {
            var commentCard = createElement('comment', 'comment-card', "<a href=''>" + username.value + "</a>" + message.value);
            if (exists.length < 1) {
                commentSection.parentNode.insertBefore(commentCard, commentSection)
            } else {
                comment.parentNode.insertBefore(commentCard, comment)
            }

            message.value = ""
            notify(data.message)
        })
        .catch(err => console.log(err))
}