// Not very efficient but it scrolls down
// to the most recent message.

function scrollChat(){
  var s = $('.chat-container').scrollTop();
  var h = $('.chat-container').height();
  //alert( "scrollTop: " + s + " " + "height: " + h)
  $('.chat-container').scrollTop(h);
}
// jQuery Animation
$('.open-close-chat').click( function(event){
  event.preventDefault();
  if ($('.msg-box').hasClass("isDown")){
    $('.msg-box').animate({height:"300px"}, 200);
    $('.msg-box').removeClass("isDown");
    $('.chat-input').fadeIn();
    $('.close').show();
    scrollChat();
  } else {
    $('.msg-box').animate({height:"40px"}, 200);
    $('.msg-box').addClass("isDown");
    $('.chat-input').hide();
    $('.close').hide();
  }
  return false;
});