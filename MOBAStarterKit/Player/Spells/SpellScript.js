#pragma strict
/**
 * This is the base class for all the spells that you are using in your project
 * It contains the basic method (CastSpell) and variables that all your new scripts will be inherit
 *
 * Ruben Garcia Canto (rubengc)
 * MOBA Starter Kit
 */
public class SpellScript extends MonoBehaviour {
	public var player : GameObject;
	public var spellIcon : Texture;
	public var manaCost : int;
	public var coolDown : float;
	public var currentCoolDown : float;
	public var instantCast : boolean = false;
	
	function start() {
		
	}
	
	public function SpellScript() {
	
	}
	
	public function CastSpell() : boolean {
	
	}
}