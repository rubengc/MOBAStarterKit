#pragma strict

var style : GUIStyle;
/*
 * 0 = Minions have spawned
 * 1 = Tower have been destroyed
 * 2 = Enemy tower have been destroyed
 */
var sounds : AudioClip[];
var messages : String[];

// Variables for a global message (displayed in the middle of the screen)
private var messageToDisplay : int = 0;
private var timeToNext : float = 6; // Time of first wave spawned
private var receiveMessage : boolean = true;
private var canDraw : boolean = false;
private var timeDrawing : float;

// Variables for a player message (displayed over the spells space)
private var messageToPlayer : String;
private var isMessageToPlayer : boolean = false;
private var timeMessageToPlayer : float;

// Variables for display a count down in the middle of the screen
private var countDownTime : float = 0;
private var startCountDown : boolean = false;

function Start () {
	timeToNext += Time.time;
}

function Update () {
	if(timeToNext < Time.time && receiveMessage) {
		audio.PlayOneShot(sounds[messageToDisplay], 1);
		timeToNext = Time.time + sounds[messageToDisplay].length + 1;
		receiveMessage = false;
		
		canDraw = true;
		timeDrawing  = Time.time + sounds[messageToDisplay].length + 3;
	}
	
	if(isMessageToPlayer) {
		if(timeMessageToPlayer < Time.time) {
			isMessageToPlayer = false;
		}
 	} 
 	
 	if(countDownTime < Time.time)
 		startCountDown = false;
	
}

function OnGUI () {
	if(canDraw && timeDrawing > Time.time) {
		GUI.Label (Rect (Screen.width/2-20, 50, 100, 50), messages[messageToDisplay], style);
	}
	
	if(isMessageToPlayer) {
		GUI.Label (Rect (Screen.width/2-90, Screen.height - 90, 200, 50), messageToPlayer);
	}
	
	if(startCountDown) {
		GUI.Label (Rect (Screen.width/2-5, 90, 50, 50), ""+Mathf.Ceil(countDownTime - Time.time), style);
	}
}

function DisplayMessage(message : int) {
	messageToDisplay = message;
	receiveMessage = true;
}

function DisplayMessageToPlayer(message : String) {
	messageToPlayer = message;
	isMessageToPlayer = true;
	timeMessageToPlayer = Time.time + 2;
}

function DisplayCountDown(time : float) {
	countDownTime = time + Time.time;
	startCountDown = true;
}