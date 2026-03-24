import json
import asyncio
import edge_tts
import os

VOICE = "af-ZA-AdriNeural"
INPUT_FILE = "src/data/words.json"
OUTPUT_DIR = "public/audio/narratives"

async def generate_all_tts():
    # 1. Create the output folder if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 2. Load the Woordreis dictionary
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    # 3. Iterate through all the words in the "words" dictionary
    for word_key, word_data in data.get("words", {}).items():
        segments = word_data.get("narrative_segments", [])
        
        for i, segment in enumerate(segments):
            text = segment.get("text")
            if not text:
                continue
                
            # Generate a secure filename (e.g. koeksister_0.mp3)
            filename = f"{word_key}_{i}.mp3"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            # Smart resumption: skip if the file was already downloaded!
            if os.path.exists(filepath):
                print(f"Skipping {filename} (already exists)")
                continue
                
            print(f"Generating {filename}...")
            
            # 4. Await the edge-tts generation and save
            communicate = edge_tts.Communicate(text, VOICE)
            await communicate.save(filepath)
            
            # Add a tiny delay to be polite to the Microsoft Edge endpoint
            await asyncio.sleep(0.5)

    print("All audio files generated successfully!")

if __name__ == "__main__":
    # Execute the asynchronous loop
    asyncio.run(generate_all_tts())
