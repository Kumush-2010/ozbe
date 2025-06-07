$(document).ready(function() {
        let slider = $("#slider");
        let thumb = $("#thumb");
        let slidesPerPage = 4;
        let syncedSecondary = true;
        slider.owlCarousel({
            items: 1,
            slideSpeed: 2000,
            nav: false,
            autoplay: false, 
            dots: false,
            loop: true,
            responsiveRefreshRate: 200
        }).on('changed.owl.carousel', syncPosition);
        thumb
            .on('initialized.owl.carousel', function() {
                thumb.find(".owl-item").eq(0).addClass("current");
            })
            .owlCarousel({
                items: slidesPerPage,
                dots: false,
                nav: true,
                item: 4,
                smartSpeed: 200,
                slideSpeed: 500,
                slideBy: slidesPerPage, 
              navText: ['<svg width="18px" height="18px" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="25px" height="25px" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
                responsiveRefreshRate: 100
            }).on('changed.owl.carousel', syncPosition2);
        function syncPosition(el) {
            let count = el.item.count - 1;
            let current = Math.round(el.item.index - (el.item.count / 2) - .5);
            if (current < 0) {
                current = count;
            }
            if (current > count) {
                current = 0;
            }
            thumb
                .find(".owl-item")
                .removeClass("current")
                .eq(current)
                .addClass("current");
            let onscreen = thumb.find('.owl-item.active').length - 1;
            let start = thumb.find('.owl-item.active').first().index();
            let end = thumb.find('.owl-item.active').last().index();
            if (current > end) {
                thumb.data('owl.carousel').to(current, 100, true);
            }
            if (current < start) {
                thumb.data('owl.carousel').to(current - onscreen, 100, true);
            }
        }
        function syncPosition2(el) {
            if (syncedSecondary) {
                let number = el.item.index;
                slider.data('owl.carousel').to(number, 100, true);
            }
        }
        thumb.on("click", ".owl-item", function(e) {
            e.preventDefault();
            let number = $(this).index();
            slider.data('owl.carousel').to(number, 300, true);
        });


            $(".qtyminus").on("click",function(){
                let now = $(".qty").val();
                if ($.isNumeric(now)){
                    if (parseInt(now) -1> 0)
                    { now--;}
                    $(".qty").val(now);
                }
            })            
            $(".qtyplus").on("click",function(){
                let now = $(".qty").val();
                if ($.isNumeric(now)){
                    $(".qty").val(parseInt(now)+1);
                }
            });
    });
  document.getElementById("add-to-cart")?.addEventListener("click", function (e) {
    e.preventDefault();

    // Mahsulot ma'lumotlari
    const product = {
      id: 1,
      name: document.querySelector(".product-name").innerText,
      price: document.querySelector(".product-price-discount span").innerText,
      quantity: document.querySelector(".qty").value,
      size: document.getElementById("size").value,
      color: document.getElementById("color").value,
      image: document.querySelector("#slider .item img").src,
    };

    // Mahsulotlar ro'yxatini olish (avvalgi mavjud bo'lsa)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tekshirish: shu mahsulot avval qo‘shilganmi
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(product.quantity);
    } else {
      cart.push(product);
    }

    // Yangi ro'yxatni saqlash
    localStorage.setItem("cart", JSON.stringify(cart));

    // Savatcha hisoblagichini yangilash
    document.getElementById("cart-count").innerText = cart.length;

    alert("Mahsulot savatchaga qo‘shildi!");
  });
