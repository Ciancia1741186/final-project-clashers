import {
  fall,
  setIdlePosition,
  objectAnimation,
  goombaAnimation,
} from "./tween_functions.js";

export function setCharacterStuff() {
  if (character == "yoshi") {
    boxId = yoshiBox._physijs.id;
    lowerBoxId = yoshiLowerBox._physijs.id;
    upperBoxId = yoshiUpperBox._physijs.id;
    touchesBox = yoshiBox._physijs.touches;
    touchesUpper = yoshiUpperBox._physijs.touches;
    touchesLower = yoshiLowerBox._physijs.touches;
    model = yoshi;
  }
  if (character == "luigi") {
    boxId = luigiBox._physijs.id;
    lowerBoxId = luigiLowerBox._physijs.id;
    upperBoxId = luigiUpperBox._physijs.id;
    touchesBox = luigiBox._physijs.touches;
    touchesUpper = luigiUpperBox._physijs.touches;
    touchesLower = luigiLowerBox._physijs.touches;
    model = luigi;
  }
  if (character == "mario") {
    boxId = marioBox._physijs.id;
    lowerBoxId = marioLowerBox._physijs.id;
    upperBoxId = marioUpperBox._physijs.id;
    touchesBox = marioBox._physijs.touches;
    touchesUpper = marioUpperBox._physijs.touches;
    touchesLower = marioLowerBox._physijs.touches;
    model = mario;
  }
}

export function onGroupContainerCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  if (other_object._physijs.id == boxId) {
    //impostiamo il flag che dice che ha colliso lateralmente
    console.log("Collided Side");
    collidedSide = true;
    //isWalking = false; //capiamo bene se serve
  }
}

export function onGroupContainerTopCollision1(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  if (other_object._physijs.id == lowerBoxId) {
    console.log("Collided Top1, Yoshi position: " + model.position.y);
    collidedTop1 = true;
    collidedTop2 = false;
    //collidedSide = false;
  }
}

export function onGroupContainerTopCollision2(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  if (other_object._physijs.id == lowerBoxId) {
    console.log("Collided Top2, Yoshi position: " + model.position.y);
    collidedTop2 = true;
    collidedTop1 = false;
    //collidedSide = false;
  }
}

export function onBottomCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  if (other_object._physijs.id == upperBoxId) {
    console.log("collision bottom");
    collidedBottom = true;

    tweenJump.stop();
    fall(model);
    //tweenJumpBack.start();

    var id = this._physijs.id;

    for (var i in questionBoxArray) {
      if (questionBoxArray[i]._physijs.id == id) {
        objectAnimation(objectArray[i], i);
      }
    }
  }
}

export function onPipeCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();

  //risolvere il fatto che una volta che ha colliso non si stacca dalla pipe

  if (other_object._physijs.id == yoshiBox._physijs.id) {
    //impostiamo il flag che dice che ha colliso lateralmente
    collidedSide = true;
    //isWalking = false; //capiamo bene se serve
  }
}

export function onCharacterCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
}

export function onCharacterLowerCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  /*for (var i in coinContainerArray) {
    if (other_object._physijs.id == coinContainerArray[i]._physijs.id) {
      isCoin = true;
    }
  }*/
  if (contact_normal.y == -1) {
    var checkTouch = function () {
      for (var i = 0; i < touchesLower.length; i++) {
        if (touchesLower[i] == other_object._physijs.id) return;
      }
      collidedTop1 = false; //serve per non farlo passare attraverso il livello 1 quando scende dal livello 2
      //collidedTop2 = false;
      //collidedSide = false;
      if (!isJumping) {
        //serve per non fare il fall appena salta e si stacca da terra
        fall(model);
      }

      scene.removeEventListener("update", checkTouch);
    };
    scene.addEventListener("update", checkTouch);
  }
}

export function onCharacterUpperCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
}

export function onGroupCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  //setCharacterStuff();
}

export function onGoombaTopCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();

  if (other_object._physijs.id == lowerBoxId) {
    if (other_object instanceof Physijs.Mesh) {
      var id = this._physijs.id;
      for (var i in goombaContainerTopArray) {
        if (goombaContainerTopArray[i]._physijs.id == id) {
          goombaElemArray[i].scale.set(0.07, 0.01, 0.07);
          //in caso STOPPARE PER FARE CONTENTA MARTINA TURBESSI
        }
      }
    }
  }
}

export function onGoombaCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();

  if (other_object._physijs.id == boxId) {
    if (other_object instanceof Physijs.Mesh) {
      var id = this._physijs.id;
      for (var i in goombaContainerIdArray) {
        if (goombaContainerIdArray[i]._physijs.id == id) {
          goombaElemArray[i].scale.set(0.07, 0.01, 0.07);
        }
      }
    }
  }
}

export function onCoinCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  if (other_object._physijs.id == boxId) {
    var id = this._physijs.id;
    for (var i in coinContainerArray) {
      if (coinContainerArray[i]._physijs.id == id) {
        score += 1;
        scene.remove(coinArray[i]);
        scene.remove(coinContainerArray[i]);
        //isCoin = false;
      }
    }
  }
  text.innerHTML = score;
}

export function onPowerUpCollision(
  other_object,
  relative_velocity,
  relative_rotation,
  contact_normal
) {
  setCharacterStuff();
  if (other_object._physijs.id == boxId) {
    var id = this._physijs.id;
    for (var i in coinContainerArray) {
      if (coinContainerArray[i]._physijs.id == id) {
        score += 1;
        scene.remove(coinArray[i]);
        scene.remove(coinContainerArray[i]);
      }
    }
  }
  text.innerHTML = score;
}
