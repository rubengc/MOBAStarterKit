#pragma strict

function Start () {

}

function Update () {

}

function OnGUI() {
	if (GUI.Button (Rect (180,50,200,100), "Ranged Player")) {
		Application.LoadLevel ("RangedPlayerDemo");
	}
	
	if (GUI.Button (Rect (410,50,200,100), "Melee Player")) {
		Application.LoadLevel ("MeleePlayerDemo");
	}
	
	if (GUI.Button (Rect (640,50,200,100), "Minions")) {
		Application.LoadLevel ("MinionsAndTurrets");
	}
	
	GUI.Label (Rect (Screen.width/2-60, Screen.height-170, 60, 50), "Left click to move");
	GUI.Label (Rect (Screen.width/2+30, Screen.height-170, 70, 50), "Right click to attack");
	
	GUI.Label (Rect (Screen.width/2-60, Screen.height-125, 60, 50), "Ctrl+Left to ping");
	GUI.Label (Rect (Screen.width/2+30, Screen.height-125, 90, 50), "Ctrl+Right to second ping");
	
	GUI.Label (Rect (Screen.width/2-60, Screen.height-80, 200, 200), "Space to lock/unlock camera");
	
	GUI.Label (Rect (Screen.width/2-60, Screen.height-50, 200, 200), "Press ESC to come back");
}