import speech_recognition as sr
import base64
import os

def createFile():
    #audioFile = codecs.open("newFile.wav", 'rb')
    #fileContent = audioFile.read()
    with open('newFile.txt', 'r') as a:
        audioContent = a.read()
    
    #bufferFile = base64.b64encode(fileContent)
    b64File = f'{audioContent}'.encode()
    
    readOldFile = base64.decodebytes(b64File)
    
    with open("newFile.wav", 'wb') as n:
        n.write(readOldFile)
        
    #new_file.close()
    
def RecognizeSpeech():
    #fileName = datetime.datetime.now().timestamp()
    
    #createFile()
    recognizer = sr.Recognizer()

    recognizer.energy_threshold = 300

    audio_file = sr.AudioFile("newFile.wav")

    with audio_file as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.7)
        audio_file = recognizer.record(source)
        result = recognizer.recognize_google(audio_data=audio_file, language='pt-BR')
        print(result)
        
    os.remove("newFile.wav")
    
    return result

RecognizeSpeech()
