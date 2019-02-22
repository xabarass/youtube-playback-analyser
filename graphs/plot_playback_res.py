import matplotlib.pyplot as plt
import json
from pprint import pprint
import re
import sys

SAMPLE_TIME = 0.250

CURR_RES_REGEX = r'Current \/ Optimal Res[0-9]*x([0-9]*)'
EST_BW_REGEX = r'Connection Speed([0-9]*)'

def frange(x, y, jump):
    while x < y:
        yield x
        x += jump

def findEmptyBuffRange(buff_len):
    start = -1
    end = -1
    res = []
    for i in range(1, len(buff_len)):
            if buff_len[i] < 0.02 and buff_len[i-1]>0.02:
                start = i*SAMPLE_TIME
            elif buff_len[i] >0.02 and buff_len[i-1]<0.020:
                end = i*SAMPLE_TIME
                res.append( (start, end,) )
    return res

def plot_stuff_on_graph(place, x,y,y1, video_stopped, title, y_axis):
    plt.subplot(place)
    plt.title(title)
    for bad_range in video_stopped:
        plt.axvspan(bad_range[0], bad_range[1], color='r', alpha=0.3, lw=0)
    plt.xlabel("playback time (s)")
    plt.ylabel(y_axis)
    if y1!=None:
        plt.plot(x, y, x, y1)
    else:
        plt.plot(x,y)



if len(sys.argv) < 2:
    print("You must provide input file name")
    sys.exit(1)

with open(sys.argv[1]) as f:
    data = json.load(f)
    print(len(data))
    pprint(data[12])

samples = len(data)
x_axis = [ d for d in frange(0, samples * SAMPLE_TIME , SAMPLE_TIME) ]
available_bw = [ d['bw'] for d in data]
buffer_length = [ float(d['stats[]'][11].strip('Buffer Health')[:-2]) for d in data ]
video_stopped = findEmptyBuffRange(buffer_length)
resolution = [ int(re.search(CURR_RES_REGEX, d['stats[]'][2]).group(1)) for d in data ]
est_bw = [ int(re.search(EST_BW_REGEX, d['stats[]'][9]).group(1)) for d in data ]

plot_stuff_on_graph(311, x_axis, available_bw, est_bw, video_stopped, "Available and estimated bandwidth", "Kbps")
plot_stuff_on_graph(312, x_axis, resolution, None, video_stopped, "Playing resolution", "Vertical resolution")
plot_stuff_on_graph(313, x_axis, buffer_length, None, video_stopped, "Buffer length", "seconds")
plt.show()

