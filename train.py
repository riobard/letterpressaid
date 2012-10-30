#!/usr/bin/env python

import sys

def decompose(word):
    freq = [0] * 26
    A = ord("A")
    for each in [ord(char) - A for char in word.upper()]:
        if 0 <= each < 26:
            freq[each] += 1
    if any(n > 9 for n in freq):
        raise Exception("bad word: %s" % word)
    return "".join(str(each) for each in freq)


def train(source):
    d = {}
    for each in source:
        each = each.strip()
        if len(each) > 1:
            try:
                rep = decompose(each)
                if rep in d:
                    d[rep].add(each)
                else:
                    d[rep] = set([each])
            except Exception as e:
                print >> sys.stderr, e

    res = []
    for k, v in sorted(d.items()):
        res.append(",".join(v))

    return ";".join(res)


print train(sys.stdin)
