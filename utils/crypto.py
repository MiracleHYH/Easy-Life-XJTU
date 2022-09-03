import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


def encrypt(pwd, publicKey='0725@pwdorgopenp'):
    pwd = pwd.encode('utf-8')
    publicKey = publicKey.encode('utf-8')
    cryptos = AES.new(publicKey, AES.MODE_ECB)
    encrypts = cryptos.encrypt(pad(pwd, 16, 'pkcs7'))
    encrypts = base64.b64encode(encrypts)

    return encrypts


def decrypt(word, key):
    word = base64.b64decode(word)
    key = key.encode("utf-8")
    cipher = AES.new(key, AES.MODE_ECB)

    a = cipher.decrypt(word)

    a = a.decode('utf-8', 'ignore')
    a = a.rstrip('\n')
    a = a.rstrip('\t')
    a = a.rstrip('\r')
    a = a.replace('\x06', '')
    return a