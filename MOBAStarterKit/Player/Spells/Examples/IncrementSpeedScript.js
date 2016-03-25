#pragma strict

public class IncrementSpeedScript extends SpellScript {
	public var speed : float;
	public var timeOfBuff : float;
	
	function Start() {
		currentCoolDown = 0;
	}
	
	public function HealScript() {
		
	}
	
	public function CastSpell() : boolean {
		super();		
		player.GetComponent(MOBACharacterController).speed += speed;
		player.GetComponent(MOBACharacterController).RestoreAttributes(timeOfBuff);
			
		return true;
	}
}