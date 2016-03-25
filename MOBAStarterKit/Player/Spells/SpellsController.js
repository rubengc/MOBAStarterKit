#pragma strict

var playerInformation : CharacterInformation;
var spellMark : GameObject;
var spellScripts : SpellScript[] = new SpellScript[4];
var messageController : MessagesController;
var countStyle : GUIStyle;

private var ray : Ray;
private var hits : RaycastHit[];
private var spellToCast : int;
private var isPreparingToCast : boolean = false;
private var timeToCast : float;
private var buttonToCast : String = "";
private var instantiateMark : GameObject = null;

function Start () {

}

function Update () {
	if(isPreparingToCast) {	
		if(spellScripts[spellToCast].instantCast) {
			// Try instant cast spell
			if(spellScripts[spellToCast].currentCoolDown < Time.time && spellScripts[spellToCast].manaCost < playerInformation.manaPoints) {
				if(spellScripts[spellToCast].CastSpell()) {
					playerInformation.SubstractMana(spellScripts[spellToCast].manaCost);
					spellScripts[spellToCast].currentCoolDown = spellScripts[spellToCast].coolDown + Time.time;
				}
			} else {
				if(spellScripts[spellToCast].currentCoolDown > Time.time)
					messageController.DisplayMessageToPlayer("Spell in cooldown");
				else
					messageController.DisplayMessageToPlayer("You don't have mana");
			}
			
			ClearSpellMark();
		} else {	
			ray = Camera.main.ScreenPointToRay (Input.mousePosition);
			hits = Physics.RaycastAll(ray);
			
			for(var i = 0;i < hits.Length; i++) {
				var hit : RaycastHit = hits[i];
				if(hit.collider.tag == "Ground") {
					instantiateMark.transform.position = Vector3(hit.point.x, 0.01, hit.point.z);
				}
			}
					
			if(Input.GetButtonDown(buttonToCast) && timeToCast < Time.time) {
				// Try cast a normal spell
				if(spellScripts[spellToCast].currentCoolDown < Time.time && spellScripts[spellToCast].manaCost < playerInformation.manaPoints) {
					if(spellScripts[spellToCast].CastSpell()) {
						playerInformation.SubstractMana(spellScripts[spellToCast].manaCost);
						spellScripts[spellToCast].currentCoolDown = spellScripts[spellToCast].coolDown + Time.time;
						ClearSpellMark();
					}
				} else {
					if(spellScripts[spellToCast].currentCoolDown > Time.time)
						messageController.DisplayMessageToPlayer("Spell in cooldown");
					else
						messageController.DisplayMessageToPlayer("You don't have mana");
						
					ClearSpellMark();
				}						
			}
		}	
	}
}

function PrepareToCast(spell : int, position : Vector3, buttonName : String) {
	if(instantiateMark == null)	
		instantiateMark = Instantiate(spellMark, position, Quaternion(0,0,0,0));
		
	spellToCast = spell;
	isPreparingToCast = true;
	timeToCast = Time.time + 0.1;
	buttonToCast = buttonName;
}

function IsCasting() {
	return isPreparingToCast;
}

function ClearSpellMark() {
	if(instantiateMark != null) {
		isPreparingToCast = false;
		
		Destroy(instantiateMark);
		instantiateMark = null;
	}
}

function OnGUI() {
	var keys : String[] = new String[4];
	keys[0] = "Q";
	keys[1] = "W";
	keys[2] = "E";
	keys[3] = "R";
	
	for(var i = 0; i < spellScripts.length; i++) {
		GUI.DrawTexture(Rect(Screen.width/2-90+(60*i),Screen.height-70,50,50), spellScripts[i].spellIcon, ScaleMode.StretchToFill, true, 10.0f);
		GUI.Label (Rect(Screen.width/2-70+(60*i),Screen.height-20,50,50), keys[i]);
		
		if(spellScripts[i].currentCoolDown > Time.time) {			
			GUI.Label (Rect(Screen.width/2-90+(60*i),Screen.height-70,50,50), ""+Mathf.Ceil(spellScripts[i].currentCoolDown - Time.time), countStyle);
		}
	}
}