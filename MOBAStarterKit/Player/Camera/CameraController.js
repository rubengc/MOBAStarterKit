#pragma strict
var target : Transform;
var isLocked : boolean = true;
var cameraMovementSpeed : float = 5;

function Start () {

}

function Update () {
	if(isLocked) {
		if(target != null) {
			// Follow the target
			transform.position = target.position;
		} else {
			isLocked = false;
		}
	} else {
		// Free look
		if(Input.mousePosition.x >= Screen.width-10) { // Move to right
			transform.position += Vector3.forward * (Time.deltaTime * cameraMovementSpeed);
		} else if(Input.mousePosition.x  <= 10) { // Move to left
			transform.position += Vector3.back * (Time.deltaTime * cameraMovementSpeed);
		}

		if(Input.mousePosition.y >= Screen.height-10) { // Move to up
			transform.position += Vector3.left * (Time.deltaTime * cameraMovementSpeed);
		} else if(Input.mousePosition.y  <= 10) { // Move to down
			transform.position += Vector3.right * (Time.deltaTime * cameraMovementSpeed);
		}
	}

	if (Input.GetButtonDown ("LockCamera")) {
			isLocked = !isLocked;
	}
	
	if(Input.GetKeyDown("escape")) {
		Application.LoadLevel ("SelectDemoScreen");
	}
}