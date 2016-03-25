private var controller : CharacterController;
private var team : int;
var speed : float = 5;
var rotationSpeed : float = 5;

var visionRange : float = 5;

var attackRange : float = 5;
var attackRate : float = 1;
private var tmpAttackRate : float;

var attackAnimation : Animation;

var projectile : GameObject;
var shootPosition : Transform;

/*
 * 0 = Come to mark
 * 1 = Come to attack mark (and waiting enemies)
 * 2 = Attack
 * 3 = Dead
 */
var state : int = 0;

private var target : Transform;

// back up of attributes (for RestoreAttributes()) you can add more if you need
private var backUpSpeed : float;
private var backUpRotationSpeed : float;
private var backUpAttackRate : float;
private var isWaitingForRestore : boolean = false;
private var timeToRestore : float;

function Start () {
	controller = transform.GetComponent(CharacterController);
	team = transform.GetComponent(CharacterInformation).team;
	
	backUpSpeed = speed;
	backUpRotationSpeed = rotationSpeed;
	backUpAttackRate = attackRate;
}

function Update () {
	if(state == 3) {
        return;
    }
    
    var mark : GameObject;
    
    if(state == 0) {
		mark = GameObject.FindWithTag("Mark");

		if(mark != null && mark.activeInHierarchy) {
			target = mark.transform;
			MoveTo(target);
		}
	} else if(state == 1) {
		mark = GameObject.FindWithTag("Mark");

		if(mark != null && mark.activeInHierarchy) {
			target = mark.transform;
			MoveTo(target);
		} else {
			// Waiting for a enemy target
	        var hitColliders = Physics.OverlapSphere(transform.position, visionRange);
	        for (var i = 0; i < hitColliders.Length; i++) {
	            if(hitColliders[i].transform.GetComponent(CharacterInformation)
	                && !hitColliders[i].transform.GetComponent(Bullet)) {
	                if(hitColliders[i].transform.GetComponent(CharacterInformation).team != team) {
	                    target = hitColliders[i].transform.Find("attackPoint").transform;
	                    state = 2;
	                    tmpAttackRate = Time.time + attackRate;
	                }
	            }
	        }
		}
	} else if( state == 2 ) {
		if(target != null && target.gameObject.activeInHierarchy) {
            // Rotate to target
            var rotate = Quaternion.LookRotation(target.position - transform.position);
            transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rotationSpeed);
            transform.localEulerAngles.x = 0; // Prevent rotation in X axi

            if(Vector3.Distance(transform.position, target.position) > attackRange) {
                // If target isn't in range
                MoveTo(target);
                //tmpAttackRate = Time.time + attackRate;
            } else {
                // Attack
                if(Time.time > tmpAttackRate) {
                    // Attack animation
					if(attackAnimation != null) {
						attackAnimation.Play("Attack");
					}
                    // Instatiate a projectile
                    var clone : GameObject = Instantiate(projectile, shootPosition.position, Quaternion.LookRotation(target.position - shootPosition.position) );
                    clone.transform.GetComponent(CharacterInformation).team = team;

                    tmpAttackRate = Time.time + attackRate;
                }
            }
        } else {
            state = 0;
        }
	}
	
	if(isWaitingForRestore) {
		if(timeToRestore < Time.time) {
			speed = backUpSpeed;
			rotationSpeed = backUpRotationSpeed;
			attackRate = backUpAttackRate;
			isWaitingForRestore = false;
		}
	}
}

function MoveTo(target : Transform) {
    if(transform.position != target.position) {
    	// Calculate the distance
    	var dir : Vector3 = target.position - transform.position;
    	var dist : float = dir.magnitude;       
    	var move : float = speed * Time.deltaTime;

        if(dist > move) {
        	controller.Move(dir.normalized * move);
        } 
        else {
	        controller.Move(dir);
        }

        // Rotate to target
        dir.y = 0;
        transform.forward = Vector3.Slerp(transform.forward, dir, Time.deltaTime * rotationSpeed); 
    }    
}

function SetTarget(newTarget : Transform) {
	target = newTarget;
	state = 2;
}

function RestoreAttributes(time : float) {
	timeToRestore = time + Time.time;
	isWaitingForRestore = true;
}

function OnDrawGizmosSelected () {
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere (transform.position, visionRange);
}