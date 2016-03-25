#pragma strict
var timeToDestroy : float = 5;

function Start () {
	yield WaitForSeconds(timeToDestroy);
	Destroy(gameObject);
}

function Update () {

}