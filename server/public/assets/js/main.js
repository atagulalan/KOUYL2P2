/* https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm */

$ = (q, e) => {
  let i = typeof e === "number" ? e : undefined;
  let o = typeof e === "object" ? e : undefined;
  let r = o ? o.querySelectorAll(q) : document.querySelectorAll(q);
  if(i!==undefined){
      return r[i];
  }else if(r.length===1){
      return r[0];
  }else{
      return r;
  }
}

//YouMightNotNeedjQuery
HTMLElement.prototype.find = function(q){return $(q, this)};
HTMLElement.prototype.hasClass = function(q){return this.classList ? this.classList.contains(q) : new RegExp('(^| )' + q + '( |$)', 'gi').test(this.q); }
HTMLElement.prototype.addClass = function(q){return this.classList ? this.classList.add(q) : this.className += ' ' + q;}
HTMLElement.prototype.removeClass = function(q){return this.classList ? this.classList.remove(q) : this.className = this.className.replace(new RegExp('(^|\\b)' + q.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); }
HTMLElement.prototype.toggleClass =  function(q){return this.hasClass(q) ? this.removeClass(q) : this.addClass(q); }
HTMLElement.prototype.attr = function(q,s){return s!==undefined ? s===null ? this.removeAttribute(q) : this.setAttribute(q, s) : this.getAttribute(q); }
HTMLElement.prototype.data = function(q,s){return this.attr("data-"+q,s); }
HTMLElement.prototype.html = function(q){return this.innerHTML=q; }
HTMLElement.prototype.forEach = function(q,s){return [this].forEach(q,s); }
HTMLElement.prototype.append = function(q){return this.appendChild(q); }

let tagTemplate = ['<div class="tag" name="','">',' <div class="remove"><svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path></svg></div></div>'];
let modalTagTemplate = ['<li class="active" name="','">','</li>']
let monthArr = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
let changesMade = false;
let oldCategories = {};

//https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript
function post(url, data, callback=()=>{}) {
    if(!!localStorage.getItem("token")){
        data.token = localStorage.getItem("token")
    }
    var XHR = new XMLHttpRequest();
    XHR.addEventListener('load', function(event) {
        callback(XHR.response);
    });
    XHR.open('POST', url);
    XHR.setRequestHeader('Content-Type', 'application/json');
    XHR.setRequestHeader("Authorization",localStorage.getItem("restKey"))
    XHR.send(JSON.stringify(data));
}

function get(url, callback=()=>{}) {
    var XHR = new XMLHttpRequest();
    XHR.addEventListener('load', function(event) {
        callback(XHR.response);
    });
    XHR.open('GET', url);
    XHR.send();
}

sendMessage = (slug,title,cb) => {
    post("https://onesignal.com/api/v1/notifications", {
        "app_id": localStorage.getItem("appKey"),
        "included_segments": ["All"],
        "data": {slug, title },
        "headings": {"en":"Yeni haber!"},
        "contents": {"en": title}
    }, cb)
}

logout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("appKey", "");
    localStorage.setItem("restKey", "");
    window.location = "/"
}

generateToken = () => {
    let name = $("#name").value;
    let pass = $("#pass").value;
    let err = $("#err");
    post("/login", {name, pass}, (res)=>{
        res = JSON.parse(res);
        if(res.token==="3e9ad32afd8070e5e59d6b4b005bfef9561890a3"){
            err.innerText = "Giriş başarısız."
        }else{
            localStorage.setItem("token", res.token);
            localStorage.setItem("appKey", res.appKey);
            localStorage.setItem("restKey", res.restKey);
            window.location = "/admin"
        }
    });
}

showModal = (id, extraClass) => {
    $(id).addClass("active");
    if(extraClass){
        $(id).addClass(extraClass);
    }
}

exitModal = (id, callback=()=>{}) => {
    let n = isNaN($("#categoriesModal .inner ul li").length) ? 1 : $("#categoriesModal .inner ul li").length
    $("#categoriesNumber").innerText = n;
    $(id).attr("class", "modal");
    callback();
}

addCategory = () => {
    changesMade = true;
    $("#tags").innerHTML = "";
    $("#categoriesModal .inner ul li.active").forEach(el=>{
        $("#tags").innerHTML += tagTemplate.join(el.innerText.trim().replace(/\,|\"|\'|\`/g, ''));
    })
    $("#tags").innerHTML += '<div class="addTag">+</div>';
    addTagFunctionality();
}

addTagFunctionality = () => {
    $("#tags .tag .remove").forEach(removeButton=>{
        removeButton.addEventListener("click", function(){
            let tag = removeButton.parentNode;
            tag.parentNode.removeChild(tag);
        });
    })
    $("#tags .addTag").addEventListener("click", function(){
        $("#categoriesModal ul li").forEach(el=>{
            el.removeClass("active");
        })
        $("#tags .tag").forEach(el=>{
            $("#categoriesModal ul li[name='"+el.innerText.trim()+"']").forEach(li=>{
                li.addClass("active");
            })
        })
        showModal("#categoriesModal")
    });
}

addLiFunctionality = () => {
    $("#categoriesModal .inner ul li").forEach(el=>{
        el.addEventListener("click", function(){
            el.toggleClass("active");
        });
    })
}

addItemFunctionality = () => {
    $(".item").forEach(el=>{
        el.addEventListener("click", function(){
            if(changesMade && !window.confirm("Yaptığınız değişiklikler kaybolabilir. Devam etmek istiyor musunuz?")) return false;
            $(".item").forEach(el=>{
                el.removeClass("active");
            });
            el.addClass("active");
            $("#notifyPost").removeClass("active")
            $(".secondLeftBar").removeClass("full");
            $("#title").innerText = el.find(".name").innerText;
            $("#content").innerText = el.find(".content .summary").innerHTML;
            $("#slug").innerText = el.find(".content .slug").innerText;
            $("#imagesrc").attr("src", el.find(".content .image").innerText);
            /* https://www.unixtimestamp.com/index.php */
            $("#date input").value = new Date(Number(el.find(".content .date").innerHTML)).toISOString().slice(0, -5);
            let pTags = !!(el.find(".content .tags").innerHTML) ? (el.find(".content .tags").innerHTML).split(",").map(el=>{
                return tagTemplate.join(el.trim());
            }).join("") : "";
            $("#tags").innerHTML = pTags + '<div class="addTag">+</div>';
            changesMade = false;
            $(".innerMain").scrollTo(0,0);
            addTagFunctionality();
        });
    })
}

loadItems = (lastActive, isSearch) => {
    let itemTemplate = ['<div class="item" slug="',
    '"><div class="name">',
    '</div><div class="content"><span class="summary">',
    '</span><div class="date">',
    '</div><div class="humanDate">',
    '</div><div class="tags">',
    '</div><div class="slug">',
    '</div><div class="image">',
    '</div></div></div>'];
    get("/list", (response)=>{
        $("#items").innerHTML = "";
        let arr = JSON.parse(response);
        let categories = {}

        let v = $("#filter").hasClass("active");
        arr.sort((a,b)=>{
            return v ? b.date - a.date : a.date - b.date;
        });

        if(isSearch){
            arr = arr.filter((a)=>{
                return a.title.toLowerCase().indexOf($("#search").value.toLowerCase()) > -1;
            });    
        }

        arr.map(el=>{
            //console.log(el);
            /* https://stackoverflow.com/questions/9229213/convert-iso-date-to-milliseconds-in-javascript */
            /* https://www.toptal.com/software/definitive-guide-to-datetime-manipulation */
            var myDate = new Date(el.date);
            var offset = myDate.getTimezoneOffset() * 60 * 1000;
            var dateString = myDate.getTime() - offset;
            let currentDate = new Date(el.date);
            var date = currentDate.getDate();
            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();
            var humanDate = date + " " + monthArr[month] + " " + year;
            
            el.category.map(cat=>{
                categories[cat] = 1;
            })

            $("#items").innerHTML += 
                itemTemplate[0] + el.slug +
                itemTemplate[1] + el.title +
                itemTemplate[2] + el.content +
                itemTemplate[3] + dateString +
                itemTemplate[4] + humanDate +
                itemTemplate[5] + el.category.join(",") +
                itemTemplate[6] + el.slug +
                itemTemplate[7] + el.image +
                itemTemplate[8]
            ;
        })

        oldCategories = {...oldCategories, ...categories};

        $("#categoriesModal .inner ul").innerHTML = Object.keys(oldCategories).map(cat=>modalTagTemplate.join(cat)).join("")

        let n = isNaN($("#categoriesModal .inner ul li").length) ? 1 : $("#categoriesModal .inner ul li").length
        $("#categoriesNumber").innerText = n;
        let k = isNaN($("#items .item").length) ? 1 : $("#items .item").length
        $("#postsNumber").innerText = k;

        addItemFunctionality();
        
        if(lastActive){
            console.log(lastActive);
            $("#items .item[slug='"+lastActive+"']").click();
        }

        addLiFunctionality();
    })
}

loginOnload = function() {
    $("#name").addEventListener("keydown", function(){
        $("#err").innerText = "";
    })
    $("#pass").addEventListener("keydown", function(event){
        if (event.which == 13 || event.keyCode == 13) {
            generateToken();
            return false;
        }
        $("#err").innerText = "";
    })
};

adminOnload = function() {
    if(!localStorage.getItem("token")){
        window.location = "/";
    } else {
        $("#newPost").addEventListener("click", function(){
            if(changesMade && !window.confirm("Yaptığınız değişiklikler kaybolabilir. Devam etmek istiyor musunuz?")) return false;
            $(".item").forEach(el=>{
                el.removeClass("active");
            })
            var myDate = new Date();
            var offset = myDate.getTimezoneOffset() * 60 * 1000;
            var dateString = myDate.getTime() - offset;
            $("#date input").value = new Date(dateString).toISOString().slice(0, -5);
            $("#title").innerText = "";
            $("#content").innerText = "";
            $("#slug").innerText = "";
            $("#tags").innerHTML = '<div class="addTag">+</div>';
            $("#save").attr("disabled", true);
            $(".secondLeftBar").removeClass("full");
            $("#imagesrc").attr("src", "");
            $("#image").value = '';
            $("#title").focus();
            changesMade = false;
            addTagFunctionality();
        })
    
        $("#addCircle").addEventListener("click", function(){
            $("#newPost").click();
        });
        
        $("#title").addEventListener("keyup", function(){
            changesMade = true;
            if($("#title").innerText){
                $("#save").attr("disabled", null);
            }else{
                $("#save").attr("disabled", "true");
            }
        });
    
        $("#content").addEventListener("keyup", function(){
            changesMade = true;
        });
    
        $("#createCategory").addEventListener("click", function(){
            let name = $("#categoriesModal #categoryName").value;
            if($("#categoriesModal .inner ul li[name='"+name+"']").length===0){
                let catName = name.trim().replace(/\,|\"|\'|\`/g, '');
                $("#categoriesModal .inner ul").innerHTML = modalTagTemplate.join(catName) + $("#categoriesModal .inner ul").innerHTML;
                oldCategories[catName] = 1;
                addLiFunctionality();
            }else{
                $("#categoriesModal .inner ul li[name='"+name+"']").addClass("active");
            }
            $("#categoriesModal #categoryName").value = "";
            $("#categoriesModal #categoryName").focus();
        });
    
        $("#categoriesModal #categoryName").addEventListener("keydown", function(event){
            if (event.which == 13 || event.keyCode == 13) {
                $("#createCategory").click();
                return false;
            }
        })
    
        $("#search").addEventListener("keydown", function(event){
            if(changesMade && !window.confirm("Yaptığınız değişiklikler kaybolabilir. Devam etmek istiyor musunuz?")){
                event.preventDefault();
                return false;
            }
            $("#searchButton").click();
        })
    
        $("#imageRemover").addEventListener("click", function(event){
            $("#imagesrc").attr("src", "");
            $("#image").value = '';
            changesMade = true;
        })
    
        $("#searchButton").addEventListener("click", function(event){
            changesMade = false;
            loadItems($(".item.active").length!==0 ? $(".item.active").attr("slug") : null, true);
        })
        
        $("#save").addEventListener("click", function(){
            let category = [];
            $("#tags .tag").forEach(el=>{
                category.push(el.attr("name"));
            })
            post("/admin/add/", {
                title: $("#title").innerText,
                content: $("#content").innerText,
                category,
                slug: $("#slug").innerText,
                date: new Date($("#date input").value).getTime(),
                image: $("#imagesrc").attr("src")
            }, (res)=>{
                changesMade = false;
                loadItems($(".item.active").length!==0 ? $(".item.active").attr("slug") : res);
            })
        });
    
        /* https://coderwall.com/p/cjinag/upload-a-image-using-ajax-and-formdata */
        $("#image").addEventListener("change", function(el){
            file = el.target.files[0];
            if (!file || !file.type.match(/image.*/)) return;
            var fd = new FormData();
            fd.append("file", file);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/image", true);
            xhr.onload = function(e) {
                changesMade = true;
                $("#imagesrc").attr("src", "/image/"+xhr.responseText)
            }
            xhr.send(fd);
        });

        $("#postFullDate").addEventListener("change", function(el){
            changesMade = true;
        });
    
        $("#removePost").addEventListener("click", function(){
            let slug = $(".item.active").length!==0 ? $(".item.active").attr("slug") : null;
            if(slug){
                post("/admin/remove/", {
                    slug
                }, (res)=>{
                    $(".secondLeftBar").addClass("full");
                    loadItems();
                })
            }
        });

        $("#notifyPost").addEventListener("click", function(){
            if(changesMade && !window.confirm("Yaptığınız değişiklikleri kaydetmediniz. Bildirimde yaptığınız değişiklikler gözükmeyecek. Devam etmek istiyor musunuz?")) return false;
            let slug = $(".item.active").length!==0 ? $(".item.active").attr("slug") : null;
            let title = $(".item.active").length!==0 ? $(".item.active").find(".name").innerText : null;
            if(slug){
                sendMessage(slug, title, (res)=>{
                    $("#notifyPost").addClass("active");
                })
            }
        });
    
        $("#filter").addEventListener("click", function(){
            if(changesMade && !window.confirm("Yaptığınız değişiklikler kaybolabilir. Devam etmek istiyor musunuz?")) return false;
            changesMade = false;
            this.toggleClass("active");
            let v = this.hasClass("active");
            this.find("span").innerText = v ? "En yeni" : "En eski";
            loadItems(isNaN($("#items .item.active").length) ? $("#items .item.active").attr("slug") : null);
        });
    
        loadItems();
    }
};