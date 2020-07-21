export function updateGoombaBoxPosition(goombaElem, i) {
  goombaContainerIdArray[i].position.set(
    goombaElem.position.x,
    goombaElem.position.y + 1.8,
    goombaElem.position.z
  );
  var goombaContainerPos = goombaContainerIdArray[i].position.clone();
  goombaContainerIdArray[i].position.copy(goombaContainerPos);
  goombaContainerIdArray[i].rotation.set(0, 0, 0);
  goombaContainerIdArray[i].__dirtyPosition = true;
  goombaContainerIdArray[i].__dirtyRotation = true;

  goombaContainerTopArray[i].position.set(
    goombaElem.position.x,
    goombaElem.position.y + 4.5,
    goombaElem.position.z
  );
  var goombaContainerTopPos = goombaContainerTopArray[i].position.clone();
  goombaContainerTopArray[i].position.copy(goombaContainerTopPos);
  goombaContainerTopArray[i].rotation.set(0, 0, 0);
  goombaContainerTopArray[i].__dirtyPosition = true;
  goombaContainerTopArray[i].__dirtyRotation = true;
}
