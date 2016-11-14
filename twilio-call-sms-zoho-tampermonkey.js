// ==UserScript==
// @name         Twilio Call And  SMS - Zoho CRM
// @updateURL    https://openuserjs.org/meta/mymizan/My_Script.meta.js
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Twilio call and SMS integration for zoho
// @copyright 2016, Md Yakub Mizan (http://mymizan.rocks)
// @license MIT; http://mymizan.rocks
// @homepageURL http://mymizan.rocks
// @supportURL http://mymizan.rocks
// @icon      https://img.zohostatic.com/crm/t234/images/favicon.ico
// @match     https://crm.zoho.com/*
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    waitForKeyElements ("#header_PHONE", actionFunction);
    waitForKeyElements ("#header_MOBILE", AnotheractionFunction);



    /***
    ** Add Nodes to DOM
    **/
    function actionFunction (jNode) {
        //$('#twilioPage').remove();
        var html1 = "<span> From </span> <span> <select class='twilioFromPhone'><option>Select</option><option> +18602000045</option><option> +12027512775</option> </select> </span>";
        var html2 = "<span> <button class='sendSMS'> SMS </button> </span>";
        $('#header_PHONE').append(html1);
        $('#header_MOBILE').append(html1);
        $('body').append("<iframe id='twilioPage' style='display:none;' src='/crm/ShowSetup.do?tab=webInteg&subTab=otherApps&appname=telephony'></iframe>");
    }


    /**
    ** Handle Number Changing
    **/
    $('.twilioFromPhone').live('change',function(){
        var twilio_phone_number = $('option:selected', $(this)).text();
        if (twilio_phone_number == 'Select'){
            return false;
        }
        var save_context = this;
        var csrf_token = $('#twilioPage').contents().find('input[name=crmcsrfparam]').val();
        $.post('https://crm.zoho.com/crm/CtiApiConfig.do',
               {crmcsrfparam:csrf_token, userid:'2135217000000106005', mode:'type3editoutgoing', ctinumber:twilio_phone_number},
               function(data){
            $('.calliconOuter', $(save_context).parent().parent()).click();
        });
    });



    /**
    ** SMS Sending Function
    **/
    function AnotheractionFunction (jNode) {
        $('.sendSMS').live('click', function(){
            prompt('Enter SMS');
        });
    }
})();
