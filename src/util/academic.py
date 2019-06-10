from datetime import datetime

def find_academic_year(joined = None):
    now = datetime.now()
    if now.month in (4,5,6,7,8,9,10,11,12):
        if joined:
            return str(now.year) + '-' + str(now.year + 1)[:2]
        else:
            return str(now.year) , str(now.year + 1)
    else:
        if joined:
            return str(now.year - 1) + '-' + str(now.year)[:2]
        else:
            return str(now.year - 1) , str(now.year)
