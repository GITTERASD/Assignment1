# BeatLab Strudel Interactive Music Web Application

BeatLab is a browser-based interactive music application built with React and Strudel. It lets users edit Strudel music code, preprocess playback settings, play the result in the browser, adjust BPM, pitch, volume, and instrument layers, then save or export their settings as JSON.

The project focuses on live music control, real-time UI feedback, Web Audio playback, and a practical settings workflow for experimenting with generated or remixed music patterns.

## Tech Stack

- React 19
- React Router
- Bootstrap 5
- Strudel CodeMirror
- Strudel Core, Mini, Draw, Tonal, Transpiler, WebAudio, and SoundFonts
- D3.js
- JavaScript
- HTML/CSS
- Browser localStorage
- JSON import/export

## Technical Overview

The app uses a central controller in `App.js` to manage song text, playback state, and user settings. These settings include BPM, master volume, and pitch semitone changes. The controller is passed into the home screen and settings overlay so both parts of the interface stay synchronized.

The main music workspace is built in `Home.jsx`. It initializes a Strudel CodeMirror editor, registers Web Audio output, loads Strudel sound modules, and draws a piano-roll style visual output using Strudel Draw. When users preprocess the song, the app generates playback code by adding BPM control, pitch speed adjustment, master gain, and the selected instrument mix.

The live graph uses D3.js and a console log listener. Strudel playback events are captured from `[hap]` console logs, converted into gain values, and displayed as a moving line chart while the music is running.

Settings are stored in the browser with `localStorage` under `beatlab-settings-v1`. Users can also export the current settings to a JSON file and import a JSON settings file back into the app.

## Features

### Composer and Strudel Editor

- Editable composer text area for modifying the Strudel tune.
- Embedded Strudel CodeMirror editor for generated playback code.
- Preprocess button that updates the editor without starting playback.
- Proc & Play button that preprocesses the tune and immediately plays it.
- Play and Stop controls for browser-based Strudel playback.
- Piano-roll canvas output generated with Strudel Draw.

### Music Playback Controls

- BPM input for controlling song speed.
- Master volume slider from silent to full volume.
- Pitch slider from -12 to +12 semitones.
- Boy pitch and Girl pitch preset buttons for quick pitch changes.
- Real-time Deck Info panel showing BPM, pitch, volume percentage, and selected instrument mix.

### Instrument Mix Options

- Original tune only.
- Extra drums layer using tech drums and hi-hats.
- Supersaw chords layer.
- Full band boost combining drums and chords.
- Instrument mix selection updates the generated Strudel playback code.

### Settings Overlay

- Settings panel opens as an overlay through the app route.
- BPM, pitch, and volume changes stay synchronized with the playback workspace.
- Save button stores current settings in the browser.
- Load button restores the saved browser settings.
- Export button downloads the current settings as `beatlab-settings.json`.
- Import button loads a JSON settings file and applies it to the app.
- Success, info, and error messages explain save/load/import/export results.

### Live D3 Audio Graph

- Captures Strudel playback log output.
- Extracts gain values from recent playback events.
- Draws a live D3 line chart while playback events are available.
- Reflects changes in volume and generated audio intensity.

## Project Structure

```text
src/
  App.js
  tunes.js
  beats.json
  console-monkey-patch.js
  components/
    Home.jsx
    ProcessTextArea.jsx
    PlayButtons.jsx
    PlayProButtons.jsx
    BeatSelector.jsx
    DeckInfo.jsx
    D3Graph.jsx
    Setting.jsx
    BpmControl.jsx
    VolumeControl.jsx
    PitchControl.jsx
    StorageButtons.jsx
    SettingsAlert.jsx
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm start
```

Build for production:

```bash
npm run build
```

## Notes

The default tune is a Strudel remix inspired by Algorave Dave's example code and uses public sample sources loaded in `tunes.js`. The project is intended as an interactive browser music experiment with practical UI controls, live playback, and JSON-based settings management.
