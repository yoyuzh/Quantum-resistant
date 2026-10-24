from cryptography.hazmat.primitives.asymmetric import rsa


def repeated_signing(key, payload):
    first = key.sign(payload, None, None)
    second = key.sign(payload, None, None)
    return first, second


def different_purposes(key, ciphertext):
    signature = key.sign(ciphertext, None, None)
    plaintext = key.decrypt(ciphertext, None)
    return signature, plaintext


def reassigned(key, payload):
    value = key.sign(payload, None, None)
    value = key.decrypt(payload, None)
    return value


def branch_use(key, payload, should_sign):
    if should_sign:
        return key.sign(payload, None, None)
    return key.decrypt(payload, None)
