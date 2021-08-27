import youtube_dl
import sys
    
def my_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')

def downloadVideo():
    ydl_opts = {
       'format': 'bestaudio/best',
       'postprocessors': [{
           'key': 'FFmpegExtractAudio',
           'preferredcodec': 'mp3',
           'preferredquality': '192',
       }],
       'ffmpeg-location': './',
       'outtmpl': "./public/downloadMusic/%(id)s.%(ext)s",
       'keepvideo': 'True'
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        videoUrl = 'https://www.youtube.com/watch?v=' + sys.argv[1]
        
        ydl.extract_info(videoUrl, True)
    

downloadVideo()