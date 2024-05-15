import bcrypt

def make_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(password, hashed_password):
    print(password, hashed_password)
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')).decode('utf-8')

def decode_password(hashed_password):
    return hashed_password.decode('utf-8')