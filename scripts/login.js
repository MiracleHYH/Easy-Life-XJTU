$(function () {
  //jQuery.support.cors = true;   //写在$.ajax()前面
  //初始化页面样式:
  $(".span_username").hide();
  $(".span_password").hide();
  $(".span_img").hide();
  //短信验证码登录
  $(".phoneVal_span").hide();
  $(".code_span").hide();

  //鼠标滑动到移动交通大学app上生成的二维码展示
  $("#img_2").qrcode({
    render: "table",
    width: 70,
    height: 70,
    text: "https://org.xjtu.edu.cn/h5/download.html",
  });
  $("#qrCodeIcoimg").attr("src", "images/logo_red1.png");
  //点击认证信息生成二维码
  $("#new_query").qrcode({
    render: "table",
    width: 150,
    height: 150,
    text: "https://org.xjtu.edu.cn/h5/download.html",
  });
  $("#qrCodeIco").attr("src", "images/logo_red1.png");

  $("#new_query1").qrcode({
    render: "table",
    width: 150,
    height: 150,
    text: "https://org.xjtu.edu.cn/h5/download.html",
  });
  $("#qrCodeIco1").attr("src", "images/logo_red1.png");
  $("input, textarea").placeholder(); //处理IE兼容问题

  if (isMobile) {
    loadStyle("css/login/loginMobil.css" + "?v=" + new Date().getTime());
    loadStyle("css/popMobile.css" + "?v=" + new Date().getTime());
    setTimeout(function () {
      $(".loginBox").show();
      $(".organizational").hide();
      $(".isMObil").show();
      $(".username").focus();
    }, 10);
  } else {
    loadStyle("css/login/login.css" + "?v=" + new Date().getTime());
    loadStyle("css/Popup.css" + "?v=" + new Date().getTime());
    setTimeout(function () {
      $(".loginBox").show();
      $(".organizational").show();
      $(".isMObil").hide();
      $(".username").focus();
    }, 10);
  }

  initImg(); //初始化图片验证
  getAppNameAndAdminContent(); //应用名称和管理员内容
  keyupSubmit(); //点击回车进行登录
  //  $('.username').focus()
  if (!".username".value) {
    isPasswordError();
  }

  //var BASE_URL = 'http://org.xjtu.edu.cn/openplatform';
  // 获取banner图
  $.ajax({
    type: "get",
    url: BASE_URL + "/inner/app/banner/getBannerInfoList",
    contentType: "application/x-www-form-urlencoded",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: { state: 1, orgId: 1 },
    success: function (res) {
      var list = [];
      list = res.data;
      var html = "";
      for (var i = 0; i < list.length; i++) {
        html += " <div class='swiper-slide' text=" + list[i].url + ">";
        html += "<img  src=" + list[i].bannerPic + " alt='' />";
        html += "</div>";
      }
      $(".swiper-wrapper").append(html);

      var mySwiper = new Swiper(".swiper-container", {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的	父元素时，自动初始化swiper
        loop: true,
        autoplay: true,
        speed: 800,
        autoplay: {
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
        },
      });
    },
    error: function (res) {
      //提示报错信息
    },
  });

  $(".swiper-wrapper").on("click", "div", function () {
    if ($(this).attr("text") != "") {
      window.open($(this).attr("text"));
    }
  });
  //			是否显示banner
  $.ajax({
    type: "get",
    url: BASE_URL + "/inner/app/banner/getShowStatus",
    contentType: "application/x-www-form-urlencoded",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: { orgId: 1 },
    success: function (res) {
      if (res.data == 1) {
        $(".miniBg").hide();
        $(".swiper-container").show();
      } else {
        $(".miniBg").show();
        $(".swiper-container").hide();
      }
    },
    error: function (res) {
      //提示报错信息
    },
  });
  //点击扫码切换页面
  var flag = true;
  var timer;
  var a = 1;
  function qrcode() {
    if (flag == true) {
      // 防止用户频繁点击
      flag = false;
      clearInterval(timer);
      jQuery.support.cors = true; //写在$.ajax()前面  IE兼容  [后端生成唯一的值来生成二维码，前后请求接口拿到]
      $.ajax({
        type: "get",
        url: BASE_URL + "/g/qrcode/getQRCode",
        contentType: "application/x-www-form-urlencoded",
        cache: false,
        crossDomain: true,
        data: {
          width: 215,
          height: 215,
        },
        success: function (res) {
          if (res.code == 0) {
            // 1 表示二维码生成成功
            var erweimaImg = "data:image/png;base64," + res.data.baseCode;
            $(".erweima").attr("src", erweimaImg);
            var username = res.data.token;
            timer = setInterval(function () {
              jQuery.support.cors = true; //写在$.ajax()前面  IE兼容  [后端生成唯一的值来生成二维码，前后请求接口拿到]
              $.ajax({
                // 轮循判断二维码是否过期或者扫码成功
                type: "get",
                url: BASE_URL + "/g/qrcode/getQrCodeStatus",
                contentType: "application/x-www-form-urlencoded",
                cache: false,
                crossDomain: true,
                data: { uuid: res.data.token },
                success: function (res) {
                  switch (res.data.qrcodeStatus * 1) {
                    case 0: //二维码过期,清除定时器，提示用户重新获取二维码
                      $(".sweep-success").css("display", "none");
                      $(".refresh-code").css("display", "block");
                      clearInterval(timer);
                      break;
                    case 1: //未扫描
                      break;
                    case 2: // 表示用户扫描了二维码  已扫描未授权，已扫描是原生通知后台，拿到信息到了我的页面
                      break;
                    default: //扫码成功
                      $(".sweep-success").css("display", "block");
                      $(".refresh-code").css("display", "none");
                      clearInterval(timer);
                      //根据接口返回成功，所以调用登录接口直接跳转第三方应用或是跳转身份选择页面
                      setTimeout(scanCodeLogin(username, 3), 1000); //延迟1秒调用扫码登录接口,根据情况跳转身份选择页面还是第三方应用信息
                  }
                },
              });
            }, 2000);
          } else {
            showMessage(res.message, 0);
          }
        },
      });
      setTimeout(function () {
        // 设置点击频率
        flag = true;
      }, 2000);
      a++;
    } else {
      showMessage("点击过于频繁", 0);
      a--;
    }
  }
  function scanCodeLogin(username, loginType) {
    var params = {
      username: username,
      loginType: loginType,
    };
    login(params);
  }
  $(".loginSwich").on("click", function () {
    if ($(this).attr("src") == "./images/qrcodes.png") {
      $(this).attr("src", "./images/accountNumber.png");
      $(".loginState").hide();
      $(".qrCode").show();
      //李永健请求二维码接口
      qrcode();
    } else {
      $(this).attr("src", "./images/qrcodes.png");
      $(".loginState").show();
      $(".qrCode").hide();
      //清除轮询定时器
      clearInterval(timer);
    }
  });
  //    李永健二维码过期点击刷新图标
  $(".refresh-ma").on("click", function () {
    $(".sweep-success").css("display", "none");
    $(".refresh-code").css("display", "none");
    qrcode();
  });
});
function pageResize(target) {
  var client_h = $(window).height();
  $(window).on("resize", function () {
    var body_h = $(this).height();
    if (body_h < client_h) {
      $(target).hide();
    } else {
      $(target).show();
    }
  });
}
pageResize(".footer");

// 动态加载css
function loadStyle(url) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  $("head").find("title").before(link);
}

//声明路径
//var BASE_URL = 'http://t100xjd.zhengtoon.com/openplatform';
//jq效果呈现
$(".span").hover(
  function () {
    //鼠标滑动
    $(".div_img").show();
  },
  function () {
    $(".div_img").hide();
  }
);
//点击短信验证码登录
var judge = 1; // 1代表账号登录   2  短信登录
$(".message").on("click", function () {
  //短信登录
  $(".main_info_send").show(0, function () {
    $(".phoneVal").val("");
    $(".code").val("");
  });
  $(".main_info").hide();
  judge = 2;
  getAppNameAndAdminContent();
});

//点击账号密码登录
$(".account").on("click", function () {
  $(".main_info_send").hide();
  $(".main_info").show(0, function () {
    $(".username").val("");
    $(".pwd").val("");
    $(".text_yan").val("");
  });
  judge = 1;
  getAppNameAndAdminContent();
  $(".username").focus();
});
//点击图片验证码请求接口
$(".img_span").click(function () {
  initImg(); //图片验证接口
});

//点击新用户认证信息
$(".newAdd").on("click", function () {
  window.location.href = "basicInformation.html";
  //  if(isMobile) {
  //   $('.van-dialog').show();
  //   $('.van-overlay').show()
  //  } else {
  //     $('.mark').fadeIn(0,function(){
  //       $(this).css({'filter':'alpha(opacity=30)','opacity':'0.3'})
  //     })
  //     $('.new_pop').fadeIn()
  //  }
});

//点击下载移动交通大学App
$(".downloadApp").on("click", function () {
  if (BASE_URL == "http://t100xjd.zhengtoon.com/openplatform") {
    //测试环境的h5
    window.location.href = "http://t100xjd.zhengtoon.com/h5/download.html";
  } else {
    //线上h5
    window.location.href = "https://org.xjtu.edu.cn/h5/download.html";
  }
});

//点击忘记密码
$(".forget").on("click", function () {
  window.location.href = "forgetPassword.html";
});
//点击弹出框关闭按钮则弹出框隐藏
$(".title_right").on("click", function () {
  $(".mark").fadeOut();
  $(".new_pop").fadeOut();
  $(".van-dialog1").fadeOut();
  $(".van-dialog2").fadeOut();
});
//点击遮罩层弹出框消失
$(".mark").on("click", function () {
  $(".mark").fadeOut();
  $(".new_pop").fadeOut();
});

$(".new_info_btn").on("click", function () {
  $(".mark").fadeOut();
  $(".new_pop").fadeOut();
  $(".van-dialog").fadeOut();
  $(".van-overlay").fadeOut();
});

//点击短信登录时获取验证码
$(".codeSend").on("click", function () {
  $(".phoneVal_span").hide();
  $(".phone").removeClass("phoneVal_input");
  getCode(); //点击获取验证码
});

//点击认证操作说明:
$(".new_info_2").on("click", function () {
  window.location.href = "registrationSteps.html";
});

//点击回车实现登录效果:
function keyupSubmit() {
  document.onkeydown = function (e) {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;
    if (code == 13) {
      if (judge == 1) {
        account_login();
      } else if (judge == 2) {
        message_login();
      }
    }
  };
}
//点击账号密码登录展示
var isShowCode = false;
$(".username").blur(function () {
  isPasswordError();
});

// 是不密码输错三次

function isPasswordError() {
  var param = {
    userName: $(".username")[1].value || $(".username")[0].value,
  };
  $.ajax({
    type: "get",
    url: BASE_URL + "/g/admin/getIsShowJcaptchaCode",
    contentType: "application/x-www-form-urlencoded",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: param,
    success: function (res) {
      if (res.code == 0) {
        isShowCode = res.data;
        if (isShowCode) {
          $(".codeBox").show();
        } else {
          $(".codeBox").hide();
        }
      }
    },
    error: function (res) {
      //提示报错信息
      // showMessage(res.message,0);
    },
  });
}
function account_login() {
  //添加验证并且进行提交
  $(".span_username").hide();
  $(".span_password").hide();
  $(".span_img").hide();
  $(".username").removeClass("input_username");
  $(".pwd").removeClass("input_password");
  $(".text_yan").removeClass("input_img");
  var usernameVal = $(".username")[1].value || $(".username")[0].value;
  var pwdVal = $(".pwd")[1].value || $(".pwd")[0].value;
  var textYanVal = $(".text_yan")[1].value || $(".text_yan")[0].value;
  if (isShowCode) {
    if (usernameVal == "" && pwdVal == "" && textYanVal == "") {
      $(".span_username").show();
      $(".username").addClass("input_username");
      $(".span_password").show(0, function () {
        $(this).text("请输入密码(Please enter the password)");
      });
      $(".pwd").addClass("input_password");
      $(".span_img").show();
      $(".text_yan").addClass("input_img");
    }
  } else {
    if (usernameVal == "" && pwdVal == "") {
      $(".span_username").show();
      $(".username").addClass("input_username");
      $(".span_password").show(0, function () {
        $(this).text("请输入密码(Please enter the password)");
      });
      $(".pwd").addClass("input_password");
    }
  }
  if (isShowCode) {
    if (pwdVal == "" && textYanVal == "") {
      $(".span_password").show(0, function () {
        $(this).text("请输入密码(Please enter the password)");
      });
      $(".pwd").addClass("input_password");
      $(".span_img").show();
      $(".text_yan").addClass("input_img");
    }
  } else {
    if (pwdVal == "") {
      $(".span_password").show(0, function () {
        $(this).text("请输入密码(Please enter the password)");
      });
      $(".pwd").addClass("input_password");
    }
  }

  if (usernameVal == "" && pwdVal == "") {
    $(".span_username").show();
    $(".username").addClass("input_username");
    $(".span_password").show(0, function () {
      $(this).text("请输入密码(Please enter the password)");
    });
    $(".pwd").addClass("input_password");
  }
  if (isShowCode) {
    if (usernameVal == "" && textYanVal == "") {
      $(".span_username").show();
      $(".username").addClass("input_username");
      $(".span_img").show();
      $(".text_yan").addClass("input_img");
    }
  }

  if (usernameVal == "") {
    //用户名
    $(".span_username").show();
    $(".username").addClass("input_username");
  }
  if (pwdVal == "") {
    //密码
    $(".span_password").show(0, function () {
      $(this).text("请输入密码(Please enter the password)");
    });
    $(".pwd").addClass("input_password");
  }

  if (textYanVal == "" && isShowCode) {
    //图片验证码
    $(".span_img").show();
    $(".text_yan").addClass("input_img");
  }
  if (pwdVal != "") {
    if (pwdVal.length < 6 || pwdVal.length > 16) {
      $(".span_password").show(0, function () {
        $(this).text("密码的长度需要控制到6-16位");
      });
      $(".pwd").addClass("input_password");
    }
  }
  if (!isShowCode) {
    if (
      $(".username").hasClass("input_username") == false &&
      $(".pwd").hasClass("input_password") == false
    ) {
      //输入正确数据之后进行保存
      //判断密码等级问题
      if (
        removeRepeatStr(pwdVal).length == 1 ||
        lxStr(pwdVal) == true ||
        pwdVal.length < 6 ||
        pwdVal.length > 16
      ) {
        $(".van-dialog2").show();
        $(".van-overlay").show();
        $(".mark").fadeIn(0, function () {
          $(this).css({ filter: "alpha(opacity=30)", opacity: "0.3" });
        });
      } else {
        getPublicKey(); //获取公钥并且登录
      }
    }
  } else {
    if (
      $(".username").hasClass("input_username") == false &&
      $(".pwd").hasClass("input_password") == false &&
      $(".text_yan").hasClass("input_img") == false
    ) {
      //输入正确数据之后进行保存
      //判断密码等级问题
      if (
        removeRepeatStr(pwdVal).length == 1 ||
        lxStr(pwdVal) == true ||
        pwdVal.length < 6 ||
        pwdVal.length > 16
      ) {
        $(".van-dialog2").show();
        $(".van-overlay").show();
        $(".mark").fadeIn(0, function () {
          $(this).css({ filter: "alpha(opacity=30)", opacity: "0.3" });
        });
      } else {
        getPublicKey(); //获取公钥并且登录
      }
    }
  }
}

//点击密码等级确定弹出框展示
$(".passTip2_btn").on("click", function () {
  $(".van-dialog2").hide();
  $(".van-overlay").hide();
  $(".mark").hide();
});

//点击重置密码跳转到忘记密码页面
$(".resJumpforgert").on("click", function () {
  window.location.href = "forgetPassword.html";
});

//点击账号密码登录
$(".account_login").on("click", function () {
  account_login();
});

//点击短信验证码登录
$(".message_login").on("click", function () {
  message_login();
});
function message_login() {
  $(".phoneVal_span").hide();
  $(".code_span").hide();
  $(".phone").removeClass("phoneVal_input");
  $(".VerificationCode").removeClass("code_input");
  var phoneVal = isMobile ? $(".phoneVal")[1].value : $(".phoneVal")[0].value;
  var codeVal = isMobile ? $(".code")[1].value : $(".code")[0].value;
  if (phoneVal == "" && codeVal == "") {
    $(".phoneVal_span").show(0, function () {
      $(this).text("请输入手机号(Please enter phone number)");
    });
    $(".phone").addClass("phoneVal_input");
    $(".code_span").show(0, function () {
      $(this).text("请输入验证码(please enter verification code)");
    });
    $(".VerificationCode").addClass("code_input");
  }
  if (phoneVal == "") {
    $(".phoneVal_span").show(0, function () {
      $(this).text("请输入手机号(Please enter phone number)");
    });
    $(".phone").addClass("phoneVal_input");
  }
  if (codeVal == "") {
    $(".code_span").show(0, function () {
      $(this).text("请输入验证码(please enter verification code)");
    });
    $(".VerificationCode").addClass("code_input");
  }
  if (phoneVal != "") {
    var pattern = /^1[2-9]\d{9}$/;
    if (!pattern.test(phoneVal)) {
      $(".phoneVal_span").show(0, function () {
        $(this).text("手机号格式不正确(Incorrect phone number format)");
      });
      $(".phone").addClass("phoneVal_input");
    }
  }
  if (codeVal != "") {
    if (isNaN(codeVal)) {
      $(".code_span").show(0, function () {
        $(this).text("验证码必须是数字(Verification code must be a number)");
      });
      $(".VerificationCode").addClass("code_input");
    } else if (codeVal.toString().length !== 6) {
      $(".code_span").show(0, function () {
        $(this).text("请输入6位验证码(Please enter 6-digit verification code)");
      });
      $(".VerificationCode").addClass("code_input");
    }
  }

  //输入数据正确时请求登录接口
  if (
    $(".phone").hasClass("phoneVal_input") == false &&
    $(".VerificationCode").hasClass("code_input") == false
  ) {
    var params = {
      loginType: 2,
      veriType: "sms",
      username: parseInt(phoneVal),
      captcha: parseInt(codeVal),
    };
    login(params);
  }
}

function initImg() {
  //获取图片验证码信息  2
  jQuery.support.cors = true; //写在$.ajax()前面  IE兼容
  $.ajax({
    type: "post",
    url: BASE_URL + "/g/admin/getJcaptchaCode",
    contentType: "application/x-www-form-urlencoded",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: {},
    success: function (res) {
      var veriImg = "data:image/png;base64," + res.data;
      $(".img_span").attr("src", veriImg);
    },
    error: function (res) {
      //提示报错信息
      showMessage(res.message, 0);
    },
  });
}

//获取验证码接口展示
var canClickSend = true; //获取验证码防重
function getCode() {
  //2
  if (!canClickSend) {
    return false;
  }
  if ($(".codeSend").html() != "获取验证码") {
    showMessage("发送中，请耐心等待(Sending, please wait patiently)", 0);
    return false;
  }
  var phoneVal = isMobile ? $(".phoneVal")[1].value : $(".phoneVal")[0].value;
  if (phoneVal == "") {
    $(".phoneVal_span").show(0, function () {
      $(this).text("请输入手机号(Please enter phone number)");
    });
    $(".phone").addClass("phoneVal_input");
  }
  if (phoneVal != "") {
    var pattern = /^1[2-9]\d{9}$/;
    if (!pattern.test(phoneVal)) {
      $(".phoneVal_span").show(0, function () {
        $(this).text("手机号格式不正确(Incorrect phone number format)");
      });
      $(".phone").addClass("phoneVal_input");
    }
  }
  if ($(".phone").hasClass("phoneVal_input") == false) {
    jQuery.support.cors = true; //写在$.ajax()前面
    canClickSend = false;
    var params = {
      veriType: "sms",
      username: parseInt(phoneVal),
      templeType: "smscode",
      optionType: "login",
    };
    $.ajax({
      //IE兼容
      type: "post",
      url: BASE_URL + "/g/admin/sendVeriCodeLogin",
      //dataType : "json",
      contentType: "application/json;charset=utf-8",
      cache: false,
      crossDomain: true,
      data: JSON.stringify(params),
      success: function (res) {
        canClickSend = true;
        if (res.code === 0 || res.code === "0") {
          countdown(); //发送验证码 倒计时
        } else if (res.code == "60001") {
          //新用户认证弹出框展示
          $(".mark").fadeIn(0, function () {
            $(this).css({ filter: "alpha(opacity=30)", opacity: "0.3" });
          });
          $(".new_pop").fadeIn();
        } else {
          // 发送验证码失败（手机号不存在)
          showMessage(res.message, 0);
        }
      },
      error: function (res) {
        canClickSend = true;
        showMessage(res.message, 0);
      },
    });
  }
}

var loginInfor = ""; //登录信息
$(".passTip_btn").click(function () {
  $(".van-dialog1").hide();
  $(".van-overlay").hide();
  $(".mark").hide();
  if (loginInfor.state == "xjdCas") {
    //跳转选择身份页面
    getUserIdentity(loginInfor.orgInfo.memberId);
  } else {
    redirectUrl(); //IE兼容
  }
});

// 获取手机验证码
function countdown() {
  var sec = 59;
  $(".codeSend").html(sec + "s");
  var timer = setInterval(function () {
    --sec;
    if (sec < 0) {
      clearInterval(timer);
      canClickSend = true;
      $(".codeSend").html("获取验证码");
    } else {
      $(".codeSend").html(sec + "s");
    }
  }, 1000);
}

// 获取公钥--接口
function getPublicKey() {
  //  2 IE兼容
  var publicKey = "0725@pwdorgopenp"; //定义key
  //密码进行AES加密
  var pwdVal = $(".pwd")[1].value || $(".pwd")[0].value;
  var encrypts = CryptoJS.AES.encrypt(
    pwdVal,
    CryptoJS.enc.Utf8.parse(publicKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  var params = {
    loginType: 1, //登录方式
    username: $(".username")[1].value || $(".username")[0].value,
    pwd: encrypts,
    jcaptchaCode: $(".text_yan")[1].value || $(".text_yan")[0].value,
  };
  login(params);
}
//点击登录请求接口
function login(params) {
  //2  IE兼容
  var pwdVal = $(".pwd")[1].value || $(".pwd")[0].value;
  jQuery.support.cors = true; //写在$.ajax()前面
  $.ajax({
    type: "post",
    url: BASE_URL + "/g/admin/login",
    //dataType : "json",
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    data: JSON.stringify(params),
    success: function (res) {
      if (res.code == 0) {
        setCookie("open_Platform_User", res.data.tokenKey);
        setCookie("memberId", res.data.orgInfo.memberId);
        if (res.data.orgInfo.addNew == 1) {
          //提示新用户下载app
          $(".mark").fadeIn(0, function () {
            $(this).css({ filter: "alpha(opacity=30)", opacity: "0.3" });
          });
          $(".new_pop").fadeIn();
        } else {
          if (params.loginType == 1) {
            if (
              pwdVal.length < 6 ||
              removeRepeatStr(pwdVal).length == 1 ||
              lxStr(pwdVal) == true
            ) {
              $(".van-dialog1").show();
              $(".van-overlay").show();
              $(".mark").fadeIn(0, function () {
                $(this).css({ filter: "alpha(opacity=30)", opacity: "0.3" });
              });
              loginInfor = res.data;
            } else {
              if (res.data.state == "xjdCas") {
                //跳转选择身份页面
                getUserIdentity(res.data.orgInfo.memberId);
              } else {
                redirectUrl(); //IE兼容
              }
            }
          } else {
            if (res.data.state == "xjdCas") {
              //跳转选择身份页面
              getUserIdentity(res.data.orgInfo.memberId);
            } else {
              redirectUrl(); //IE兼容
            }
          }
        }
      } else if (res.code == 400003) {
        isShowCode = true;
        $(".codeBox").show();
        showMessage(res.message, 0);
      } else {
        //提示报错信息
        showMessage(res.message, 0);
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}
// 根据用户Id获取身份
function getUserIdentity(memberId) {
  //2  ie兼容
  jQuery.support.cors = true; //写在$.ajax()前面
  $.ajax({
    type: "get",
    url: BASE_URL + "/g/admin/getUserIdentity",
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: { memberId: memberId },
    cache: false,
    crossDomain: true,
    success: function (res) {
      if (res.code == 0) {
        if (res.data.length == 1) {
          var param = {
            userType: res.data[0].userType,
            personNo: res.data[0].personNo,
          };
          redirectUrl1(param);
        } else {
          window.location.replace("identitySelection.html");
          localStorage.setItem("memberId", memberId);
        }
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}

function redirectUrl1(param) {
  //2  ie兼容
  jQuery.support.cors = true; //写在$.ajax()前面
  $.ajax({
    type: "get",
    url:
      BASE_URL +
      "/oauth/auth/getRedirectUrl?userType=" +
      param.userType +
      "&personNo=" +
      param.personNo,
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    cache: false,
    crossDomain: true,
    data: {},
    success: function (res) {
      if (res.code == 0) {
        location.href = res.data;
      } else {
        showMessage(res.message, 0);
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}

//修改成功后跳转到组织应用
function redirectUrl() {
  //2  ie兼容
  jQuery.support.cors = true; //写在$.ajax()前面
  $.ajax({
    type: "get",
    url: BASE_URL + "/oauth/auth/getRedirectUrl",
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: {},
    cache: false,
    crossDomain: true,
    success: function (res) {
      if (res.code == 0) {
        location.href = res.data;
      } else {
        showMessage(res.message, 0);
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}
//获取应用名称和管理员内容
function getAppNameAndAdminContent() {
  //2  ie兼容
  jQuery.support.cors = true; //写在$.ajax()前面
  $.ajax({
    type: "get",
    url: BASE_URL + "/g/admin/getAppNameAndAdminContent",
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    //dataType : "json",
    data: {},
    cache: false,
    crossDomain: true,
    success: function (res) {
      if (res.code == 0) {
        if (res.data) {
          if (judge == 1) {
            $(".teach").html("【" + res.data.appName + "】");
            $(".xitong").html(res.data.adminContent);
            //  $(".login-mian-title").show(0,function(){
            //   $('.teach').html('【'+res.data.appName+'】')
            //   $('.xitong').html(res.data.adminContent)
            //  })
          } else if (judge == 2) {
            $(".teach").html("【" + res.data.appName + "】");
            $(".xitong").html(res.data.adminContent);
            // $(".login-mian-title").show(0,function(){
            //   $('.teach').html('【'+res.data.appName+'】')
            //   $('.xitong').html(res.data.adminContent)
            //  })
          }
        } else {
          // $(".login-mian-title").hide()
        }
      } else {
        // showMessage(res.message,0);
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}

//密码不能为相同字符:
function removeRepeatStr(str) {
  var newStr = "";
  var len = str.length;
  for (var i = 0; i < len; i++) {
    if (newStr.indexOf(str[i]) == -1) {
      newStr = newStr + str[i];
    }
  }
  return newStr;
}

//判断密码不能输入连续字符
function lxStr(str) {
  var flag = true;
  for (var i = 1; i < str.length; i++) {
    flag = flag && str.charCodeAt(i) == str.charCodeAt(i - 1) + 1;
  }
  return flag;
}
