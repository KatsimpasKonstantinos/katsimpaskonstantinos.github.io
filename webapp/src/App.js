import { computed, effect, signal } from '@preact/signals-react';
import './App.css';
import GameView from "./views/GameView.js";
import StartView from './views/StartView.js';
import InvalidScreen from './components/InvalidScreen.js';

export const mainScreenString = signal("start");

function App(props) {
  console.log("Rendering App");
  let screen = computed(() => renderScreen())
  let keyPressed = signal("");
  let keyBlocked = false;


  window.addEventListener('keydown', function (event) {
    if (!keyBlocked) {
      keyPressed.value = event.key;
      let audio = new Audio(process.env.PUBLIC_URL + "/media/sounds/backgroundMusic.ogg");
      console.log(audio);
      audio.play();
    }
  });

  window.addEventListener('keyup', function (event) {
    keyBlocked = false;
  });


  function renderScreen() {
    switch (mainScreenString.value) {
      case "start":
        return <StartView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
      case "game":
        return <GameView />;
      default:
        return <InvalidScreen />;
    }
  }

  return (
    <div className="App">
      <div className="BackgroundImage" />
      <div className="whiteLine top"></div>
      {screen}
      <div className="whiteLine bottom"></div>
    </div>
  );
}

export default App;