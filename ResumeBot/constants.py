# users/constants.py
SUPERUSER = 1
PROUSER = 2
BASICUSER = 4

USER_TYPE_CHOICES = (
      (SUPERUSER, 'superuser'),
      (PROUSER, 'prouser'),
      (BASICUSER, 'basicuser'),
  )
