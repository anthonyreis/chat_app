import speech_recognition as sr
import os
    
def RecognizeSpeech():
    recognizer = sr.Recognizer()

    recognizer.energy_threshold = 300

    audio_file = sr.AudioFile("newFile.wav")

    with audio_file as source:
        recognizer.adjust_for_ambient_noise(source)
        audio_file = recognizer.record(source)
        result = recognizer.recognize_google(audio_data=audio_file, language='pt-BR')
        print(result)
        
    os.remove("newFile.wav")
    
    return result

RecognizeSpeech()
