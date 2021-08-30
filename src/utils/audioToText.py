import speech_recognition as sr
import os
import sys
from pydub import AudioSegment

orig_song = f"public/audioSent/{sys.argv[1]}.ogg"
dest_song = f"public/audioSent/{sys.argv[1]}.wav"

def convert_ogg_to_wav():
    song = AudioSegment.from_ogg(orig_song)
    song.export(dest_song, format="wav")
    RecognizeSpeech()    
    
def RecognizeSpeech():
    recognizer = sr.Recognizer()

    recognizer.energy_threshold = 300

    audio_file = sr.AudioFile(f"public/audioSent/{sys.argv[1]}.wav")

    with audio_file as source:
        recognizer.adjust_for_ambient_noise(source)
        audio_file = recognizer.record(source)
        result = recognizer.recognize_google(audio_data=audio_file, language='pt-BR')
        print(result)
    
    os.remove(f"public/audioSent/{sys.argv[1]}.ogg")
    
    return result

convert_ogg_to_wav()
