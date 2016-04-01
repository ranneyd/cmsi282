from random import randint
import time

def bozo(nums_dont_touch):
    nums = nums_dont_touch[:]
    if len(nums) <= 1:
        return nums

    while( not isSorted(nums) ):
        a = randint(0, len(nums) - 1)
        b = randint(0, len(nums) - 1)
        while a == b:
            b = randint(0, len(nums) - 1)
        temp = nums[a]
        nums[a] = nums[b]
        nums[b] = temp
    return nums

def isSorted(nums):
    for i in range(1, len(nums)):
        if nums[i] < nums[i - 1]:
            return False
    return True
        
arrs = [
    ([1, 2, 3], True),
    ([3, 2, 1], False),
    ([], True),
    ([1], True),
    ([2, 1], False),
    ([1, 3, 5, 7], True),
    ([5, 5, 5, 5], True),
    ([3, 5, 5, 5], True),
    ([5, 5, 5, 3], False),
    # Above this line are just confirm-it-works tests
    ([7, 3, 5], False),
    ([5, 7, 3, 1], False),
    ([5, 7, 1, 6, 6], False),
    ([5, 7, 1, 12, 6, 9], False),
    ([5, 7, 1, 12, 6, 9, 2], False),
    ([5, 7, 1, 12, 6, 9, 2, 5], False),
    ([5, 7, 1, 12, 6, 9, 2, 5, 8], False),
    ([5, 7, 1, 12, 6, 9, 2, 5, 9, 11], False),
]

NUM_RUNS = 20
SCALE = 1000

for test in range(0, len(arrs)):
    if isSorted(arrs[test][0]) is not arrs[test][1]:
        print"{0} : got wrong sorting value".format(test)

    times = []
    for i in range(0, NUM_RUNS):
        start = time.time()
        result = bozo(arrs[test][0])
        end = time.time()
        if not isSorted(result):
            print"{0} : got wrong sorting value post-sorting".format(test)
        times.append(end - start)
    sum = 0
    print(str(len(arrs[test][0])) + "\t"),
    for i in times:
        sum = sum + i
        print("{:10.6f}\t".format(i * SCALE)),
    print( SCALE * sum / NUM_RUNS )