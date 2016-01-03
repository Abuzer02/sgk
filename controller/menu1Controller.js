mavikentApp.controller('menu1Controller', MenuController)

function MenuController ($scope,$state,$http ,$rootScope,$localStorage , $interval) {
   $scope.logout = function(){
       $state.go("logout")
   }
   $scope.checkTR=function(){
      var token =$localStorage["token"];
      $http.get(host+"/api/role?token="+token).then(function(resp){
          console.log(JSON.stringify(resp));
      },function(err){
          console.log(JSON.stringify(err));
      })
  }
   $scope.git=function(url, event){
      //$('#sidebar-menu a').removeClass('active')
      //angular.element(event.currentTarget).addClass('active')
      var a = event.currentTarget
      //$("#wrapper").hasClass("enlarged") ? ($(a).css("overflow", "inherit").parent().css("overflow", "inherit"), $(a).siblings(".slimScrollBar").css("visibility", "hidden")) : ($(a).css("overflow", "hidden").parent().css("overflow", "hidden"), $(a).siblings(".slimScrollBar").css("visibility", "visible"))
      //console.log(url)
      $state.go(url)
   }
   $scope.menuState = true
   $scope.menuToggle = function(){
     if ($scope.menuState) {
       $scope.menuState =false
       $('#wrapper').addClass('enlarged')
     }else{
       $scope.menuState = true
       $('#wrapper').removeClass('enlarged')
     }
   }
   $('[data-toggle=tooltip]').tooltip()

   $scope.host = host

$scope.isFullScreen = false
  $scope.fullScreen = function() {
    if(!$scope.isFullScreen){
      var el = document.documentElement,
        rfs = el.requestFullScreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        ;
      rfs.call(el);
      $scope.isFullScreen = true
    }else{
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      $scope.isFullScreen = false
    }
  };

  function toggle_slimscroll(a) {
      $("#wrapper").hasClass("enlarged") ? ($(a).css("overflow", "inherit").parent().css("overflow", "inherit"), $(a).siblings(".slimScrollBar").css("visibility", "hidden")) : ($(a).css("overflow", "hidden").parent().css("overflow", "hidden"), $(a).siblings(".slimScrollBar").css("visibility", "visible"))
  }! function(a) {
      "use strict";
      var b = function() {
          this.$body = a("body"), this.$openLeftBtn = a(".open-left"), this.$menuItem = a("#sidebar-menu a")
      };
      b.prototype.openLeftBar = function() {
          a("#wrapper").toggleClass("enlarged"), a("#wrapper").addClass("forced"), a("#wrapper").hasClass("enlarged") && a("body").hasClass("fixed-left") ? a("body").removeClass("fixed-left").addClass("fixed-left-void") : !a("#wrapper").hasClass("enlarged") && a("body").hasClass("fixed-left-void") && a("body").removeClass("fixed-left-void").addClass("fixed-left"), a("#wrapper").hasClass("enlarged") ? a(".left ul").removeAttr("style") : a(".subdrop").siblings("ul:first").show(), toggle_slimscroll(".slimscrollleft"), a("body").trigger("resize")
      }, b.prototype.menuItemClick = function(b) {
          a("#wrapper").hasClass("enlarged") || (a(this).parent().hasClass("has_sub") && b.preventDefault(), a(this).hasClass("subdrop") ? a(this).hasClass("subdrop") && (a(this).removeClass("subdrop"), a(this).next("ul").slideUp(350), a(".pull-right i", a(this).parent()).removeClass("md-remove").addClass("md-add")) : (a("ul", a(this).parents("ul:first")).slideUp(350), a("a", a(this).parents("ul:first")).removeClass("subdrop"), a("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add"), a(this).next("ul").slideDown(350), a(this).addClass("subdrop"), a(".pull-right i", a(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove"), a(".pull-right i", a(this).siblings("ul")).removeClass("md-remove").addClass("md-add")))
      }, b.prototype.init = function() {
          var b = this;
          a(".open-left").click(function(a) {
              a.stopPropagation(), b.openLeftBar()
          }), b.$menuItem.on("click", b.menuItemClick), a("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click")
      }, a.Sidemenu = new b, a.Sidemenu.Constructor = b
  }(window.jQuery),
  function(a) {
      "use strict";
      var b = function() {
          this.$body = a("body"), this.$fullscreenBtn = a("#btn-fullscreen")
      };
      b.prototype.launchFullscreen = function(a) {
          a.requestFullscreen ? a.requestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen ? a.webkitRequestFullscreen() : a.msRequestFullscreen && a.msRequestFullscreen()
      }, b.prototype.exitFullscreen = function() {
          document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen()
      }, b.prototype.toggle_fullscreen = function() {
          var a = this,
              b = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
          b && (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement ? a.exitFullscreen() : a.launchFullscreen(document.documentElement))
      }, b.prototype.init = function() {
          var a = this;
          a.$fullscreenBtn.on("click", function() {
              a.toggle_fullscreen()
          })
      }, a.FullScreen = new b, a.FullScreen.Constructor = b
  }(window.jQuery),
  function(a) {
      "use strict";
      var b = function() {
          this.VERSION = "1.1.0", this.AUTHOR = "Coderthemes", this.SUPPORT = "coderthemes@gmail.com", this.pageScrollElement = "html, body", this.$body = a("body")
      };
      b.prototype.onDocReady = function(b) {
          FastClick.attach(document.body), resizefunc.push("initscrolls"), resizefunc.push("changeptype"), a(".animate-number").each(function() {
              a(this).animateNumbers(a(this).attr("data-value"), !0, parseInt(a(this).attr("data-duration")))
          })
      }, b.prototype.init = function() {
          var b = this;
          a(document).ready(b.onDocReady), a.Sidemenu.init(), a.FullScreen.init()
      }, a.App = new b, a.App.Constructor = b
  }(window.jQuery),
  function(a) {
      "use strict";
      a.App.init()
  }(window.jQuery);
  var toggle_fullscreen = function() {},
      w, h, dw, dh, changeptype = function() {
          w = $(window).width(), h = $(window).height(), dw = $(document).width(), dh = $(document).height(), jQuery.browser.mobile === !0 && $("body").addClass("mobile").removeClass("fixed-left"), $("#wrapper").hasClass("forced") || (w > 990 ? ($("body").removeClass("smallscreen").addClass("widescreen"), $("#wrapper").removeClass("enlarged")) : ($("body").removeClass("widescreen").addClass("smallscreen"), $("#wrapper").addClass("enlarged"), $(".left ul").removeAttr("style")), $("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left") ? $("body").removeClass("fixed-left").addClass("fixed-left-void") : !$("#wrapper").hasClass("enlarged") && $("body").hasClass("fixed-left-void") && $("body").removeClass("fixed-left-void").addClass("fixed-left")), toggle_slimscroll(".slimscrollleft")
      },
      debounce = function(a, b, c) {
          var d, e;
          return function() {
              var f = this,
                  g = arguments,
                  h = function() {
                      d = null, c || (e = a.apply(f, g))
                  },
                  i = c && !d;
              return clearTimeout(d), d = setTimeout(h, b), i && (e = a.apply(f, g)), e
          }
      },
      wow = new WOW({
          boxClass: "wow",
          animateClass: "animated",
          offset: 50,
          mobile: !1
      });
  wow.init();
}

/*chipId= node.chipid()
HOST="GET /emergency/" .. chipId
requestCount=0
function emergencyrequest ()
conn=net.createConnection(net.TCP, 0)
conn:connect(3000,'http://192.168.1.33')
conn:send("GET /emergency/16109935  HTTP/1.1\r\n")
conn:send("Accept: application/json\r\n")
conn:send("Host: http://192.168.1.33:3000\r\n")
conn:send("Content-Length: 60\r\n")
conn:send("\r\n")
print("Test")
conn:on("sent",function(conn)
  print("istek gonderildi")
 -- conn:close()
end)
conn:on("connection",function(conn)
print("baglandi")
end)
conn:on("receive",function(conn, payload)
  print(payload)
  print("alindi\r\n")
  gpio.mode(4,gpio.OUTPUT)
  gpio.write(4,gpio.HIGH)
  --tmr.delay(1000000)
  --conn:close()
end)
conn:on("disconnection", function(conn)
  print("Got disconnection...")
 if requestCount<5 then
	requestCount=requestCount+1
	tmr.alarm(2,3000,0,function() emergencyrequest()
	end )
else
 gpio.write(4,gpio.HIGH)
end
end)
end
emergencyrequest()
print ("emergency request yapildi")*/
