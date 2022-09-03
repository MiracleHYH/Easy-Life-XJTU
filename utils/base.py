import yaml
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

class Base:
    def __init__(self) -> None:
        with open('../conf/user.yaml', 'r', encoding='utf-8') as f:
            self.user = yaml.load(f, Loader=yaml.FullLoader)

    
    def encrypt(pwd, publicKey='0725@pwdorgopenp'):
        pwd = pwd.encode('utf-8')
        publicKey = publicKey.encode('utf-8')
        cryptos = AES.new(publicKey, AES.MODE_ECB)
        encrypts = cryptos.encrypt(pad(pwd, 16, 'pkcs7'))
        encrypts = base64.b64encode(encrypts)

        return encrypts
