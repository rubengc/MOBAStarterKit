/**
 * This script manage the static GUI elements of the minimap (background and borders)
 *
 * Ruben Garcia Canto (rubengc)
 * MOBA Starter Kit
 */
#pragma strict
@script ExecuteInEditMode

var minimapCamera : Camera;

var background : Texture;
var backgroundPaddingTop : float;
var backgroundPaddingBottom : float;
var backgroundPaddingLeft : float;
var backgroundPaddingRight : float;

// Center details (top, left, right and bottom)
var topCenterDetail : Texture;
var leftCenterDetail : Texture;
var rightCenterDetail : Texture;
var bottomCenterDetail : Texture;

// Center paddings
var topCenterPadding : float;
var leftCenterPadding : float;
var rightCenterPadding : float;
var bottomCenterPadding : float;

// Corner details (left top, right top, left bottom and right bottom)
var leftTopDetail : Texture;
var rightTopDetail : Texture;
var leftBottomDetail : Texture;
var rightBottomDetail : Texture;

// Corner paddings
var leftTopPaddingVertical : float;
var leftTopPaddingHorizontal : float;

var rightTopPaddingVertical : float;
var rightTopPaddingHorizontal : float;

var leftBottomPaddingVertical : float;
var leftBottomPaddingHorizontal : float;

var rightBottomPaddingVertical : float;
var rightBottomPaddingHorizontal : float;

function Start () {

}

function Update () {

}

function OnGUI(){   
	GUI.depth = 1;
	// BACKGROUND
	if(background)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.x + backgroundPaddingLeft - backgroundPaddingRight,
				(Screen.height - minimapCamera.pixelRect.yMin) - minimapCamera.pixelHeight + backgroundPaddingTop - backgroundPaddingBottom,
				minimapCamera.pixelWidth,
				minimapCamera.pixelHeight
			),
			background,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
	
	// CENTER DETAILS
	// Top center texture
	if(topCenterDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.x + (minimapCamera.pixelWidth/2) - (topCenterDetail.width/2),
				(Screen.height - minimapCamera.pixelRect.yMax) - topCenterDetail.height - topCenterPadding,
				topCenterDetail.width,
				topCenterDetail.height
			),
			topCenterDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);

	// Left center texture
	if(leftCenterDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.x - leftCenterDetail.width - leftCenterPadding,
				(Screen.height - minimapCamera.pixelRect.yMin) - (minimapCamera.pixelHeight/2) - (leftCenterDetail.height/2),
				leftCenterDetail.width,
				leftCenterDetail.height
			),
			leftCenterDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);

	// right center texture
	if(rightCenterDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.xMax + rightCenterPadding,
				(Screen.height - minimapCamera.pixelRect.yMin) - (minimapCamera.pixelHeight/2) - (rightCenterDetail.height/2),
				rightCenterDetail.width,
				rightCenterDetail.height
			),
			rightCenterDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);

	// Bottom center texture
	if(bottomCenterDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.x + (minimapCamera.pixelWidth/2) - (bottomCenterDetail.width/2),
				(Screen.height - minimapCamera.pixelRect.yMin) + bottomCenterPadding,
				bottomCenterDetail.width,
				bottomCenterDetail.height
			),
			bottomCenterDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
	// END CENTER DETAILS
	
	// CORNER DETAILS
	// Left top detail
	if(leftTopDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.x - (leftTopDetail.width/2) - leftTopPaddingHorizontal,
				(Screen.height - minimapCamera.pixelRect.yMax) - leftTopDetail.height - leftTopPaddingVertical,
				leftTopDetail.width,
				leftTopDetail.height
			),
			leftTopDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
			
	// Right top detail
	if(rightTopDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.xMax + rightTopPaddingHorizontal,
				(Screen.height - minimapCamera.pixelRect.yMax) - rightTopDetail.height - rightTopPaddingVertical,
				rightTopDetail.width,
				rightTopDetail.height
			),
			rightTopDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
	
	// Left bottom detail	
	if(leftBottomDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.x - (leftBottomDetail.width/2) - leftBottomPaddingHorizontal,
				(Screen.height - minimapCamera.pixelRect.yMin) + leftBottomPaddingVertical,
				leftBottomDetail.width,
				leftBottomDetail.height
			),
			leftBottomDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
			
	// Right bottom detail	
	if(rightBottomDetail)
		GUI.DrawTexture(
			Rect(
				minimapCamera.pixelRect.xMax + rightBottomPaddingHorizontal,
				(Screen.height - minimapCamera.pixelRect.yMin) + rightBottomPaddingVertical,
				rightBottomDetail.width,
				rightBottomDetail.height
			),
			rightBottomDetail,
			ScaleMode.ScaleToFit,
			true,
			0.0f);
	// END CORNER DETAILS
}