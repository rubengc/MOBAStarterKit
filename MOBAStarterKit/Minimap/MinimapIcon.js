/**
 * This script draws an icon of an object inside the minimap
 *
 * Ruben Garcia Canto (rubengc)
 * MOBA Starter Kit
 */
#pragma strict
@script ExecuteInEditMode

var minimapCamera : Camera;

var icon : Texture;
var width : float = 0;
var height : float = 0;

function Start () {
	if(width == 0)
		width = icon.width;
		
	if(height == 0)
		height = icon.height;
}

function Update () {

}

function OnGUI(){ 
	GUI.depth = 0;
	
	var position : Vector3 = minimapCamera.WorldToScreenPoint(transform.position);
	
	if(icon)
		GUI.DrawTexture(
			Rect(
				position.x - (width/2),
				Screen.height - position.y - (height/2),
				width,
				height
			),
			icon,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
}