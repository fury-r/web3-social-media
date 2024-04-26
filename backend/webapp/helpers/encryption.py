from Crypto.Cipher import AES

def encrypt_text(data,key):
    cipher=AES.new(bytes(key,'utf-8'),AES.MODE_EAX)
    nonce=cipher.nonce
    cipher_text,tag=cipher.encrypt_and_digest(bytes(data,'utf-8'))
    return cipher_text,nonce,tag


def decrypt_text(data,key,nonce):
    cipher=AES.new(bytes(key,'utf-8'),AES.MODE_EAX,nonce)

    return cipher.decrypt(data).decode()