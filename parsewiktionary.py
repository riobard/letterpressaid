#!/usr/bin/env python
import xml.parsers.expat as expat
import sys
from StringIO import StringIO


class Parser(object):
    def __init__(self):
        p = expat.ParserCreate()
        p.StartElementHandler = self.start
        p.EndElementHandler = self.end
        p.CharacterDataHandler = self.char
        self.p = p
        self.in_page = False
        self.tag = 0
        self.buf = StringIO()

    def parse(self, f):
        self.p.ParseFile(f)

    def start(self, name, attrs):
        if self.in_page:
            if name == "title":
                self.tag = 1
            elif name == "ns":
                self.tag = 2
            elif name == "text":
                self.tag = 3
            else:
                self.tag = 0
        else:
            self.tag = 0
            if name == "page":
                self.in_page = True

    def end(self, name):
        self.tag = 0
        if name == "page":
            self.in_page = False
            if self.ns == u"0":
                process(self.title, self.text)
        elif name == "title":
            self.title = self.buf.getvalue()
            self.buf.truncate(0)
        elif name == "ns":
            self.ns = self.buf.getvalue()
            self.buf.truncate(0)
        elif name == "text":
            self.text = self.buf.getvalue()
            self.buf.truncate(0)

    def char(self, data):
        if self.tag > 0:
            self.buf.write(data)


A = ord("A")
Z = ord("Z")
a = ord("a")
z = ord("z")

def process(title, text):
    ords = map(ord, title)
    if all( A <= n <= Z or a <= n <= z for n in ords):
        if (u"==English==" in text):
            caps = sum(1 if A <= n <= Z else 0 for n in ords)
            if caps <= 1:
                print title

p = Parser()
p.parse(sys.stdin)
