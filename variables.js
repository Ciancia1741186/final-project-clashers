var head;
var scene;
var landscape;
var upperArm_right;
var upperArm_left;
var upperLeg_right;
var upperLeg_left;
var lowerLeg_right;
var lowerLeg_left;
var handRight;
var torso;
var spine;
var thumb1_right;
var thumb2_right;
var finger1_right;
var finger1_2_right;
var finger2_right;
var finger2_2_right;
var finger3_right;
var finger3_2_right;
var handLeft;
var thumb1_left;
var thumb2_left;
var finger1_left;
var finger1_2_left;
var finger2_left;
var finger2_2_left;
var finger3_left;
var finger3_2_left;

var tweenStartScale;
var tweenGoalScale;
var tweenBackScale;
var tweenStartRight;
var tweenGoalRight;
var tweenStartLeft;
var tweenGoalLeft;
var tweenIdle;
var tween;
var tweenBack;
var tweenJump;
var tweenJumpBack;
var tweenFlex;

var ground;

var yoshi;
var mario;
var luigi;
var brick;
var emptyBlock;
var castle;
var pipe;
var flagpole;
var coin;
var powerUp;
var questionBox;
var goomba;

var camera;
var dPressed = false;
var aPressed = false;
var spacePressed = false;
var isRotatedRight = true;
var isWalking = false;
var isJumping = false;
var isJumpingLeft = false;
var isJumpingRight = false;
var dirLight;
var ambientLight;
var controls;
var keysPressed = {};

var yoshiBox;
var questionBoxContainer;
var geometryMaterial;
var pipeContainer;
var pipeContainerTop;

var dir;
var collision;

var collidedLeft = false;
var collidedRight = false;
var collidedTop = false;

var isCollided = false;
var otherObj;
var contactNormalY;
