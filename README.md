# GlassChords - Frontend

## Project Overview

GlassChords is an interactive AI-powered chord generator that allows users to explore how different factors impact the chords generated by an AI model. This frontend is built with React and provides users with an intuitive interface to input chords, generate new progressions, and interact with various controllable elements to see how they influence the music.

## Features

- **Interactive Piano Roll**: Allows users to input and visualize chords.
- **Controllable Elements**: Adjust training level, temperature, and key awareness settings.
- **Chord Generation**: Generate new chords based on the user's input.
- **User Guidance**: Helpful explanations and tips provided for each controllable element.
- **Survey Integration**: After using the chord generator, users can proceed to a survey to provide feedback.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/glasschords-frontend.git
   cd glasschords-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Usage

1. Follow the instructions on the landing page to input your initial chord progression.
2. Click the "Generate" button to see the AI-generated chords.
3. Adjust the controllable elements (Training Level, Temperature, Key Aware Loss) to see how they impact the output.
4. Once you're satisfied with your progressions, you can proceed to the survey.

## Technologies Used

- **React**: JavaScript library for building the user interface.
- **Tone.js**: Used for handling audio playback of the chords.
- **Axios**: For making HTTP requests to the backend API.
- **Bootstrap**: For styling and layout.

## Deployment

The frontend is deployed using [Heroku](https://www.heroku.com/). The deployment process involves pushing the code to Heroku's Git repository, which automatically builds and serves the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.