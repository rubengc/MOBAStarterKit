#pragma strict
private var team : int;

var visionRange : float = 5;
var fireRate : float = 0.7;
private var tmpFireRate : float;
var projectile : GameObject;

/*
 * 0 = Waiting a target
 * 1 = Attack
 * 2 = Dead
 */
var state : int = 0;

private var target : Transform;

function Start () {
	team = transform.GetComponent(CharacterInformation).team;
}

function Update () {
	if(state == 2) {
		return;
	}	

	if(state == 0) {
		// Waiting for a target
		var hitColliders = Physics.OverlapSphere(transform.position, visionRange);
		for (var i = 0; i < hitColliders.Length; i++) {
			if( hitColliders[i].transform.GetComponent(CharacterInformation) 
				&& !hitColliders[i].transform.GetComponent(Bullet) ) {
				if(hitColliders[i].transform.GetComponent(CharacterInformation).team != team) {
					target = hitColliders[i].transform;
					state = 1;
					tmpFireRate = Time.time + fireRate;
				}
			}
		}
	} else if( state == 1) {
		if(target != null && target.gameObject.activeInHierarchy) {

			if(Vector3.Distance(target.transform.position, transform.position) > visionRange) {
				state = 0;
				target = null;
			} else {
				// Shoot
				if(Time.time > tmpFireRate) {
					// Rotate the clone to the target position 
					var clone : GameObject = Instantiate(projectile, transform.position, Quaternion.LookRotation(target.position - transform.position));
					clone.transform.GetComponent(CharacterInformation).team = transform.GetComponent(CharacterInformation).team;

					tmpFireRate = Time.time + fireRate;
				}
			}
		} else {
			state = 0;
		}
	}
}



function OnDrawGizmosSelected () {
	Gizmos.color = Color.red;
	Gizmos.DrawWireSphere (transform.position, visionRange);
}