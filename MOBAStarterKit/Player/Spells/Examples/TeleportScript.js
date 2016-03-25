#pragma strict

public class TeleportScript extends SpellScript {
	public var range : float;
	
	function Start() {
		currentCoolDown = 0;
	}
	
	public function HealScript() {
		
	}
	
	public function CastSpell() : boolean {
		super();		
		var spellMark : GameObject = GameObject.FindWithTag("SpellMark");
		
		player.transform.position = Vector3(spellMark.transform.position.x, player.transform.position.y, spellMark.transform.position.z);
		
		var marks : GameObject[];
	
		// Search and destroy another marks in scene
		marks = GameObject.FindGameObjectsWithTag ("Mark");
		for (var mark in marks)
			Destroy(mark);
			
		return true;
	}
}