#pragma strict

public class HealScript extends SpellScript {
	public var heal : int;
	private var maxHealthPoints : int;
	
	function Start() {
		currentCoolDown = 0;
		maxHealthPoints = player.GetComponent(CharacterInformation).healthPoints;
	}
	
	public function HealScript() {
		
	}
	
	public function CastSpell() : boolean {
		super();		
		
		if(player.GetComponent(CharacterInformation).healthPoints < maxHealthPoints) {
			if((player.GetComponent(CharacterInformation).healthPoints + heal) < maxHealthPoints) {
				player.GetComponent(CharacterInformation).healthPoints += heal;
			} else {
				player.GetComponent(CharacterInformation).healthPoints = maxHealthPoints;
			}
			
			return true;
		}
		
		
		return false;
	}
}