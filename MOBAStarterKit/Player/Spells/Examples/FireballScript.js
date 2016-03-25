#pragma strict

public class FireballScript extends SpellScript {
	public var fireball : GameObject;
	public var shootPosition : Transform;
	
	function Start() {
		currentCoolDown = 0;
	}
	
	public function HealScript() {
		
	}
	
	public function CastSpell() : boolean {
		super();
		var spellMark : GameObject = GameObject.FindWithTag("SpellMark");
		
		 // Rotate to target
    	var rotate = Quaternion.LookRotation(spellMark.transform.position - player.transform.position);
    	player.transform.rotation = rotate;
    	player.transform.localEulerAngles.x = 0; // Prevent rotation in X axi	
			
		var clone : GameObject = Instantiate(fireball, shootPosition.position, player.transform.rotation);
   	 	clone.transform.GetComponent(CharacterInformation).team = player.transform.GetComponent(CharacterInformation).team;
    	
		return true;
	}
}