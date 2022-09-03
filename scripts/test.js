function login() {
  jQuery.support.cors = true;
  $.ajax({
    type: "post",
    url: "http://org.xjtu.edu.cn/openplatform/g/admin/login",
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    data: '{"loginType":1,"username":"2196113525","pwd":"oQziUK4UbnzOJ/PXe0vWFA==","jcaptchaCode":""}',
    success: function (res) {
      console.log(res);
      setCookie("open_Platform_User", res.data.tokenKey);
      setCookie("memberId", res.data.orgInfo.memberId);
      if (res.data.state == "xjdCas") {
        //跳转选择身份页面
        getUserIdentity(res.data.orgInfo.memberId);
      } else {
        //   redirectUrl(); //IE兼容
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}

function getUserIdentity(memberId) {
  jQuery.support.cors = true; //写在$.ajax()前面
  $.ajax({
    type: "get",
    url: "http://org.xjtu.edu.cn/openplatform/g/admin/getUserIdentity",
    contentType: "application/json;charset=utf-8",
    cache: false,
    crossDomain: true,
    data: { memberId: memberId },
    cache: false,
    crossDomain: true,
    success: function (res) {
      console.log(res);
      if (res.code == 0) {
        var param = {
          userType: res.data[0].userType,
          personNo: res.data[0].personNo,
        };
        redirectUrl1(param);
      }
    },
    error: function (res) {
      showMessage(res.message, 0);
    },
  });
}

function redirectUrl1(param) {
  jQuery.support.cors = true;
  $.ajax({
    type: "get",
    url:
      "http://org.xjtu.edu.cn/openplatform/oauth/auth/getRedirectUrl?userType=" +
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

login();
