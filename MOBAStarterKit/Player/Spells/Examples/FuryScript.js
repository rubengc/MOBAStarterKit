#pragma strict

public class FuryScript extends SpellScript {
	public var attackRate : float;
	public var timeOfBuff : float;
	
	function Start() {
		currentCoolDown = 0;
	}
	
	public function HealScript() {
		
	}
	
	public function CastSpell() : boolean {
		super();		
		player.GetComponent(MOBACharacterController).attackRate = attackRate;
		player.GetComponent(MOBACharacterController).RestoreAttributes(timeOfBuff);
			
		return true;
	}
}