

## Controls

 **Composer text area**
  - This is the Strudel tune code for the song. This is the text that gets preprocessed and edited.

 **Preprocess**
  - Updates the studel code.

 **Proc & Play**
  - Preprocesses the code and immediately starts play with the current settings.

 **Play**
  - Plays the current code in the Strudel editor again without changing any settings.

 **Stop**
  - Stops play.

 **Instrument mix (radio buttons)**
  - Four options of instruments.
  - Each option adds a different extra drum or chord layer on the bottom of the tune.

 **Deck Info**
  - Displays the current BPM, pitch, volume and selected mix intruments in real-time.

 **Settings**
  - Opens the overlay with all main controls.

 **BPM input**
  - Number field for song speed. Used to calculate Strudel setcps.

 **Master Volume slider**
  - Controls overall loudness of the song.

 **Pitch (semitones) slider**
  - Shifts pitch up or down in semitones.

 **Boy pitch / Girl pitch buttons**
  - Quick presets that set the pitch slider to lower / higher values.

 **Save**
  - Saves the current settings (BPM, volume, pitch) into localStorage like the storage key v1.

 **Load**
  - Restores settings from localStorage that has been saved.

 **Export**
   - Downloads the current settings as a JSON file.

 **Import**
  - Loads settings from a JSON file and applies them.

 **Live D3 graph**
  - Shows the recent gain values of the audio as a moving line while the song plays.

---

## Usage Guidelines

**Composer vs editor**
  - Edit the tune in the Composer text area.
  - Preprocess and Proc & Play regenerate the playback code in the Strudel editor.  
  - Manual edits in the editor will be updated immediately in the composer.

**BPM**
  - Very low BPM values may make it sound like the song has almost stopped. 
  - Very high BPM can sound clipped.  
  - Max Bpm is 200 and Min Bpm is 40

**Pitch (semitones)**
  - Use **Boy pitch** and **Girl pitch** buttons to quickly jump to sensible presets. (+4,-4)
  - Boy is more deep so the pitch will be lower which is -4 and girl is higher so thats +4
  - A code will appear under the composer and when the raw pitch changes, the speed of the code will change as well.
  

**Volume**
  - Volume below **0.1** may be hard to hear.  
  - Volume near **1.0** can be very loud.  
  - The D3 graph will show higher spikes when the volume is higher.
  - code All gain will show at the bottom of the strudel code just like pitch and intrument mix works 

**Deck Info**
  - Deck Info is read-only. It shows the *current* BPM, pitch, volume and selected mix.  
  - If you are not happy with the DeckInfo you can simply change it.

**Settings Overlay Panel**
  - You can see a gear icon that represents the settings
  - This is a overlay interface on the home page.
  - It Synchronously updates the bpm,pitch and volume while the music is playing.
  - The json handling is also involved in the setting panel 

**JSON handling**
  - Save pressed successfully will show message.
  - Load will load the previously saved version.
  - Exort will download current version.
  - Import expects a JSON object with keys like bpm, volume, pitchSemitones.  
  - All Invalid JSON will show an error message.

 **D3 graph**
  - The graph only animates while the tune is playing and logging events.
  - The graph is simple with minimal styling and the size not fully responsive.
  - The line mainly changes when the volume changes, because i only plot the logged gain values in the d3 ui piece.