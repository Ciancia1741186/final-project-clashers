import TWEEN from "./build/tween.js-master/dist/tween.esm.js";
import { setIdlePosition } from "./index.js";

export function fall() {
  console.log("falling");
  tweenStartFall = {
    y: yoshi.position.y,
  };
  tweenGoalFall = {
    y: -14.3,
  };
  tweenFall = new TWEEN.Tween(tweenStartFall)
    .to(tweenGoalFall, 400)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function () {
      if (!collidedTop) {
        //?
        yoshi.position.y = tweenStartFall.y;
      }
    })
    .onComplete(function () {
      collidedTop = false; //?
      collidedLeft = false;
      collidedRight = false;
      //setIdlePosition();
    })
    .start();
}