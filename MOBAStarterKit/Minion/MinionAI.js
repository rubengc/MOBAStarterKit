private var controller : CharacterController;
private var team : int;

var waypoint : Transform[];
var currentWaypoint = 0;
var target : Transform;

var speed : float = 5;
var rotationSpeed : float = 5;
var visionRange : float = 5;
var attackRange : float = 1;
var attackRate : float = 1;
private var tmpAttackRate : float;
private var gravity : float = 5;

var projectile : GameObject;

var attackAnimation : Animation;

/*
 * 0 = Come to waypoint and searching enemies
 * 1 = Attack
 * 2 = Dead
 */
var state : int = 0;

function Start () {
	controller = GetComponent(CharacterController);
	team = transform.GetComponent(CharacterInformation).team;
    target = waypoint[currentWaypoint];
}

function OnEnable() {
	// This fix a problem with the animation of inactive minions (they respawn with the last eyes position in the animation)
	// I need do this because I haven't a walk animation over minion, but if you have one, only replace the name of animation clip
	if(attackAnimation != null) {
		attackAnimation.Play("Attack");
    }
}

function Update () {
    if(state == 2) {
        return;
    }

    // Change to next waypoint
    if( Vector3.Distance(transform.position, waypoint[currentWaypoint].position) <= visionRange 
        && currentWaypoint+1 < waypoint.length
        && state == 0 ) {
        currentWaypoint++;
        target = waypoint[currentWaypoint];
    }

    // Move to waypoint
    if(state == 0) {
        // Waiting for a target
        var hitColliders = Physics.OverlapSphere(transform.position, visionRange);
        for (var i = 0; i < hitColliders.Length; i++) {
            if(hitColliders[i].transform.GetComponent(CharacterInformation)
                && !hitColliders[i].transform.GetComponent(Bullet)) {
                if(hitColliders[i].transform.GetComponent(CharacterInformation).team != team ) {
            		target = hitColliders[i].transform.Find("attackPoint").transform;
                    state = 1;
                    tmpAttackRate = Time.time + attackRate;
                }
            }
        }

        MoveTo(target);
    } else if( state == 1) {
        if(target != null && target.gameObject.activeInHierarchy) {
            // Rotate to target
            var rotate = Quaternion.LookRotation(target.position - transform.position);
            transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rotationSpeed);
            transform.localEulerAngles.x = 0; // Prevent rotation in X axi

            if(Vector3.Distance(transform.position, target.position) > attackRange) {
                // If target isn't in range
                MoveTo(target);
                tmpAttackRate = Time.time + attackRate;
            } else {
                // Attack
                if(Time.time > tmpAttackRate) {
                    // Attack animation
                    if(attackAnimation != null) {
                        attackAnimation.Play("Attack");
                    }

                    // Instatiate a projectile
                    var clone : GameObject = Instantiate(projectile, transform.position, transform.rotation);
                    clone.transform.GetComponent(CharacterInformation).team = team;

                    tmpAttackRate = Time.time + attackRate;
                }
            }
            
            // If target get out of our range vision, come to waypoint
		    if( Vector3.Distance(transform.position, target.position) >= visionRange ) {
		    	state = 0;
		    	target = waypoint[currentWaypoint];
		    }
        } else {
            state = 0;
            target = waypoint[currentWaypoint];
        }
    }
}

function MoveTo(target : Transform) {
    if(transform.postion != target.position) {
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
        
        // Move to right if can't move
        if(controller.velocity.magnitude < 1) {
        	var newDir : Vector3 = Vector3(1,0,0)+transform.position;
    		controller.Move(newDir.normalized * move);
    	}

        // Rotate to target
        dir.y = 0;
        transform.forward = Vector3.Slerp(transform.forward, dir, Time.deltaTime * rotationSpeed);      
    }    
}

function OnDrawGizmosSelected () {
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere (transform.position, visionRange);
}