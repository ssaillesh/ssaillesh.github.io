#!/usr/bin/env python3
"""Trim fully-transparent padding from an RGBA PNG. Stdlib only."""
import struct, zlib, sys

def read_png(path):
    data = open(path, 'rb').read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', 'not a PNG'
    pos, idat, meta = 8, b'', None
    while pos < len(data):
        ln, typ = struct.unpack('>I', data[pos:pos+4])[0], data[pos+4:pos+8]
        body = data[pos+8:pos+8+ln]
        if typ == b'IHDR':
            meta = struct.unpack('>IIBBBBB', body)
        elif typ == b'IDAT':
            idat += body
        pos += 12 + ln
    w, h, depth, color, comp, filt, inter = meta
    assert depth == 8 and color in (2, 6), f'need 8-bit RGB/RGBA (got depth={depth} color={color})'
    assert inter == 0, 'interlaced PNG unsupported'
    nch = 4 if color == 6 else 3
    raw, stride, out, prev = zlib.decompress(idat), w * nch, bytearray(), bytearray(w * nch)
    p = 0
    for _ in range(h):
        f = raw[p]; p += 1
        line = bytearray(raw[p:p+stride]); p += stride
        for i in range(stride):
            a = line[i-nch] if i >= nch else 0
            b = prev[i]
            c = prev[i-nch] if i >= nch else 0
            if f == 1: line[i] = (line[i] + a) & 255
            elif f == 2: line[i] = (line[i] + b) & 255
            elif f == 3: line[i] = (line[i] + (a + b) // 2) & 255
            elif f == 4:
                pa, pb, pc = abs(b-c), abs(a-c), abs(a+b-2*c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 255
        out += line; prev = line
    if nch == 3:                       # RGB -> RGBA, fully opaque
        rgba = bytearray(w * h * 4)
        for j in range(w * h):
            rgba[j*4:j*4+3] = out[j*3:j*3+3]
            rgba[j*4+3] = 255
        out = rgba
    return w, h, out

def write_png(path, w, h, px):
    raw = b''.join(b'\x00' + bytes(px[y*w*4:(y+1)*w*4]) for y in range(h))
    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    open(path, 'wb').write(
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(raw, 9))
        + chunk(b'IEND', b''))

def background_floor(px, w, h, frame=0.02):
    """Brightest luminance in the outer frame = the background level.

    Handles a flat black background, and also a transparency checkerboard
    that got baked into pixels by a screenshot.
    """
    m = max(2, int(min(w, h) * frame))
    best = 0
    for y in range(h):
        edge_row = y < m or y >= h - m
        for x in range(w):
            if edge_row or x < m or x >= w - m:
                i = (y * w + x) * 4
                lum = max(px[i], px[i+1], px[i+2])
                if lum > best:
                    best = lum
    return best


def key_white_artwork(px, w, h, floor):
    """Rebuild alpha for white artwork sitting on a darker background."""
    span = max(255 - floor, 1)
    for i in range(0, len(px), 4):
        lum = max(px[i], px[i+1], px[i+2])
        a = 0 if lum <= floor else min(255, round((lum - floor) * 255 / span))
        px[i] = px[i+1] = px[i+2] = 255      # normalise to pure white
        px[i+3] = a
    return px


def main(src, dst, pad=2, thresh=8):
    w, h, px = read_png(src)
    opaque = sum(1 for i in range(3, len(px), 4) if px[i] > 250)
    if opaque > 0.98 * w * h:
        floor = background_floor(px, w, h)
        kind = 'checkerboard/flat backdrop' if floor > 40 else 'black backdrop'
        print(f'  note: no alpha channel -> rebuilding it ({kind}, floor={floor})')
        px = key_white_artwork(px, w, h, floor + 8)
    xs, ys = [], []
    for y in range(h):
        row = y * w * 4
        for x in range(w):
            if px[row + x*4 + 3] > thresh:
                xs.append(x); ys.append(y)
    if not xs:
        sys.exit('image is fully transparent')
    x0, x1 = max(min(xs)-pad, 0), min(max(xs)+pad, w-1)
    y0, y1 = max(min(ys)-pad, 0), min(max(ys)+pad, h-1)
    nw, nh = x1-x0+1, y1-y0+1
    crop = bytearray()
    for y in range(y0, y1+1):
        crop += px[(y*w + x0)*4 : (y*w + x1 + 1)*4]
    write_png(dst, nw, nh, crop)
    print(f'{src}: {w}x{h} -> {nw}x{nh}  (content box x{x0}-{x1} y{y0}-{y1}, aspect {nw/nh:.2f})')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
