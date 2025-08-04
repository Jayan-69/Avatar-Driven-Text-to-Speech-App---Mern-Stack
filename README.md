# Avatar-Driven Text-to-Speech App - MERN Stack

A web application that converts text to speech with animated 3D avatars using the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Text-to-Speech Conversion**: Uses the Web Speech API for voice synthesis
- **Mode-Specific Voice Characteristics**:
  - News: Formal, slightly faster (rate 1.1), standard pitch
  - Podcast: Conversational, slightly slower (rate 0.95), slightly higher pitch
  - Vlogging: Energetic, faster pace (rate 1.15), higher pitch
- **Gender Selection**: Choose between male and female voices
- **Avatar Animation**: 3D avatar with synchronized mouth movements during speech playback
- **Word Highlighting**: Visual highlighting of words as they are spoken

## Technologies Used

- **Frontend**: React.js, Three.js (for 3D avatar)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Speech Synthesis**: Web Speech API

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Jayan-69/Avatar-Driven-Text-to-Speech-App---Mern-Stack.git
   cd Avatar-Driven-Text-to-Speech-App---Mern-Stack
   ```

2. Install dependencies for both client and server:
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Start the development servers:
   ```
   # Start the backend server
   cd ../server
   npm start

   # In a new terminal, start the frontend
   cd ../client
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter text in the input field
2. Select voice mode (News, Podcast, Vlogging)
3. Choose gender (Male/Female)
4. Click "Speak" to hear the text with the animated avatar
