/**
  The MIT License (MIT)

  Copyright (c) 2014 Jeppe Rune Mortensen

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @id           TwilioCallAndSMSZohoCRM
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
    //waitForKeyElements ("#header_MOBILE", AnotheractionFunction);
    waitForKeyElements ("#secHead_CustomModule1_Information", AnotherSMSFunction);



    /***
    ** Add Nodes to DOM
    **/
    function actionFunction (jNode) {
        //$('#twilioPage').remove();
        var html1 = "<span> From </span> <span> <select class='twilioFromPhone'><option>Select</option><option> +18602000045</option><option> +12027512775</option> </select> </span>";
        var html2 = "<span> <button class='sendSMS'> SMS </button> </span>";
        $('#header_PHONE').append(html1);
        $('#header_MOBILE').append(html1);
        $('#secHead_CustomModule1_Information .contHeadInfo').append(html1);
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
        var mobile = $('#headervalue_MOBILE span').html();
        var phone = $('#headervalue_PHONE span').html();
        var send_string = '?mobile=' + mobile + '&phone=' + phone;
        $('#remainingList #RelatedListCommonDiv').eq(4).after('<iframe src="https://zohocrmtwilioapp-mymizan.rhcloud.com/sms.php' + send_string + '" style="width:100%;height:700px;overflow:hidden;border:none;outline:none;"></iframe>');
    }
    
    /**
    * Changing number for SMS extension
    **/
    function AnotherSMSFunction(jNode){
        var html1 = "<span> From </span> <span> <select class='twilioFromSms'><option>Select</option><option> +18602000045</option><option> +12027512775</option> </select> </span>";
        $('#secHead_CustomModule1_Information .contHeadInfo').append(html1);
        $('body').append("<iframe id='twilioSmsExtensionPage' style='display:none;' src='/crm/ShowSetup.do?tab=webInteg&subTab=marketPlace&nameSpace=twilio&portalName=platform'></iframe>");
    }
    
    /**
    ** Handle SMS Number Changing
    **/
    $('.twilioFromSms').live('change',function(){
        var twilio_phone_number = $('option:selected', $(this)).text();
        if (twilio_phone_number == 'Select'){
            return false;
        }
        $('#twilioSmsExtensionPage').contents().find('#orgVariableForm #cov_fupdate_id_2135217000000224818').val(twilio_phone_number);
        $('#twilioSmsExtensionPage').contents().find('#orgVariableForm input[name=Submit]').click();
        //$('#orgVariableForm #cov_fupdate_id_2135217000000224818').val(twilio_phone_number);
        //$('#orgVariableForm input[name=Submit]').click();
    });
})();
