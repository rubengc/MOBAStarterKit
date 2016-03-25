#pragma strict

public class CannonBallsScript extends SpellScript {
	public var cannonBall : GameObject;
	public var shootPosition : Transform;
	public var numberOfWaves : int; 
	private var waves : int;
	private var rotate : Quaternion;
	private var playerTeam : int;
	
	function Start() {
		currentCoolDown = 0;
		playerTeam = player.transform.GetComponent(CharacterInformation).team;
	}
	
	public function HealScript() {
		
	}
	
	public function CastSpell() : boolean {
		super();
		var spellMark : GameObject = GameObject.FindWithTag("SpellMark");
		
		 // Rotate to target
    	rotate = Quaternion.LookRotation(spellMark.transform.position - player.transform.position);
    	player.transform.rotation = rotate;
    	player.transform.localEulerAngles.x = 0; // Prevent rotation in X axi	
    	
    	var mobaController : MOBACharacterController = player.GetComponent(MOBACharacterController);
    	
    	mobaController.speed = 0;
    	mobaController.rotationSpeed = 0;
		mobaController.RestoreAttributes(numberOfWaves/2);
		
		waves = numberOfWaves;
		
		InvokeRepeating("LaunchCannonBalls", 0, 0.5);		
    	
		return true;
	}
}

function LaunchCannonBalls() {
	if(waves < 0) {
		CancelInvoke();
	}
	
	var values : float[] = new float[4];
	values[0] = -0.09;
	values[1] = -0.03;
	values[2] = 0.03;
	values[3] = 0.09;
	
	for(var j : int = 0; j < 4; j++) {
		var clone : GameObject = Instantiate(
			cannonBall, 
			Vector3(shootPosition.position.x, shootPosition.position.y-0.5, shootPosition.position.z), 
			Quaternion(player.transform.rotation.x, rotate.y+values[j], rotate.z, 1)
		);
 		clone.transform.GetComponent(CharacterInformation).team = playerTeam;
	}
	
	waves--;
}