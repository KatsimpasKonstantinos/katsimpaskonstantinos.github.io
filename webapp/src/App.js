import { computed, effect, signal } from '@preact/signals-react';
import './App.css';
import GameView from "./views/GameView.js";
import StartView from './views/StartView.js';
import InvalidScreen from './components/InvalidScreen.js';
import { useEffect } from 'react';
import SettingsView from './views/SettingsView.js';
import BrowserVersion from './components/BrowserVersion.js';

const keyMap = {
  "ArrowUp": "up",
  "ArrowDown": "down",
  "ArrowRight": "right",
  "ArrowLeft": "left",
  "w": "up",
  "s": "down",
  "d": "right",
  "a": "left"
}

let stratagemsData = [];
import("./media/stratagemsData.js").then((module) => {
  stratagemsData = module.default;
  // Preload stratagem images
  for (let stratagem of stratagemsData) {
    let url = process.env.PUBLIC_URL + "/media/stratagems/" + stratagem.name + ".svg"
    let img = new Image();
    img.src = url;
  }
});

function App(props) {
  console.log("Rendering App");
  const mainScreenString = signal("start");
  let keyPressed = signal("");

  let keyBlockedUp = false;
  let keyBlockedDown = false;
  let keyBlockedRight = false;
  let keyBlockedLeft = false;

  function playKeySound() {
    let audio = new Audio(process.env.PUBLIC_URL + "/media/sounds/keyInput.ogg");
    audio.play();
  }

  window.addEventListener('keydown', function (event) {
    switch (keyMap[event.key]) {
      case "up":
        if (keyBlockedUp) return;
        keyPressed.value = "up";
        keyBlockedUp = true;
        playKeySound();
        break;
      case "down":
        if (keyBlockedDown) return;
        keyPressed.value = "down";
        keyBlockedDown = true;
        playKeySound();
        break;
      case "right":
        if (keyBlockedRight) return;
        keyPressed.value = "right";
        keyBlockedRight = true;
        playKeySound();
        break;
      case "left":
        if (keyBlockedLeft) return;
        keyPressed.value = "left";
        keyBlockedLeft = true;
        playKeySound();
        break;
    }
  });

  window.addEventListener('keyup', function (event) {
    switch (keyMap[event.key]) {
      case "up":
        keyBlockedUp = false;
        break;
      case "down":
        keyBlockedDown = false;
        break;
      case "right":
        keyBlockedRight = false;
        break;
      case "left":
        keyBlockedLeft = false;
        break;
    }
  });


  let screen = computed(() => {
    switch (mainScreenString.value.split(" ")[0]) {
      case "start":
        return <StartView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
        //return <BrowserVersion />;
      case "game":
        return <GameView mainScreenString={mainScreenString} keyPressed={keyPressed} stratagemsData={stratagemsData} />;
      case "settings":
        return <SettingsView mainScreenString={mainScreenString} keyPressed={keyPressed} />;
      default:
        return <InvalidScreen />;
    }
  });

  useEffect(() => {
    return () => {
      console.log("Unmounting App");
    }
  }, []);

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
