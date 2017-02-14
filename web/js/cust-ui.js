/**
 * Created by hanter on 2017. 2. 14..
 */

function toast(msg) {
    var toastElem = $('#alertToast');
    toastElem.find('#alertToastMsg').text(msg);
    toastElem.fadeIn(250, function() {
        setTimeout(function() {
            toastElem.fadeOut(250);
        }, 1000);
    });
}
