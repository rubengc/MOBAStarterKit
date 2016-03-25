#pragma strict

public class MeteorScript extends SpellScript {
	public var meteor : GameObject;
	public var meteorPosition : Transform;
	
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
    	
		meteorPosition.rotation = Quaternion.LookRotation(spellMark.transform.position - meteorPosition.position);;	
			
		var clone : GameObject = Instantiate(meteor, meteorPosition.position, meteorPosition.rotation);
   	 	clone.transform.GetComponent(CharacterInformation).team = player.transform.GetComponent(CharacterInformation).team;
    	
		return true;
	}
}