import pywhatkit
import sys

def play_on_youtube():
    url = pywhatkit.playonyt(sys.argv[1], True, False)
    print(url)

play_on_youtube()