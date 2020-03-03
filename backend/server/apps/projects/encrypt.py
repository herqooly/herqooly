from cryptography.fernet import Fernet

# should be regenerated for production
FERNET_KEY = "ewSMcXeCkJRLJbUXWz3BPUnWBzgEo8pEsppUvVprqGc="


def str_encrypt(data):
    cipher_suite = Fernet(str.encode(FERNET_KEY))
    ciphered_text = cipher_suite.encrypt(data.encode())
    return ciphered_text.decode("utf-8")


def str_decrypt(ciphered_text):
    cipher_suite = Fernet(str.encode(FERNET_KEY))

    if isinstance(ciphered_text, str):
        ciphered_text = ciphered_text.encode()  # bytes(ciphered_text, "utf-8")

    unciphered_text = cipher_suite.decrypt(
        ciphered_text
    )  ## bytes(ciphered_text, encoding='utf-8')) # bytes

    return unciphered_text.decode()
