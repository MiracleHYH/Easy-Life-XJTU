import requests


headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "Content-Type": "application/json; charset=UTF-8",
}

data = {"loginType":1,"username":"2196113525","pwd":"oQziUK4UbnzOJ/PXe0vWFA==","jcaptchaCode":""}

res = requests.post(
    url="http://org.xjtu.edu.cn/openplatform/g/admin/login",
    headers=headers,
    json=data
)

print(res.text)