/**
 * This is a generic script with information of all elements in the scene like minions, players or towers
 *
 * Ruben Garcia Canto (rubengc)
 * MOBA Starter Kit
 */
#pragma strict
var gameManager : GameManager;
var minimapCamera : Camera;

var team : int = 0;

var healthPoints : int = 500;
private var maxHealthPoints : int;

var manaPoints : int = 250;
private var maxManaPoints : int;

var hasRegeneration : boolean = false;
var healthRegenPerSecond : int = 5;
var manaRegenPerSecond : int = 3;

var replacement : GameObject;
var destroy : boolean = true;
var respawn : boolean = false;
var respawnPosition : Transform;
var respawnTime : float;

var drawBars : boolean = true;
private var isVisible : boolean = true;

var hpBarTexture : Texture2D;
var hpbarHeight : float = 10;
var hpbarWidth : float = 100;

var mpBarTexture : Texture2D;
var mpbarHeight : float = 5;
var mpbarWidth : float = 80;

var backgroundBarTexture : Texture2D;


var messagesController : MessagesController;
// The messageToDisplay variables is used when the gameObject dies and only if messagesController has been assigned
var messageToDisplay : int = 1; // The position in array of messages in MessagesController script (0 = not display anything)

function Start() {
	maxHealthPoints = healthPoints;
	maxManaPoints = manaPoints;
	
	if(hasRegeneration)
		InvokeRepeating("Regeneration", 0, 1);
	
	// Check if we have the gameManager for respawn the gameObject
	if(respawn && gameManager == null)
		respawn = false;
}

function ApplyDamage(damage : int) {
	healthPoints -= damage;

	if(healthPoints <= 0) {
		// Display a message in screen when the gameObject dies, I suppose the 0 never will be used, because this is the "Minions have spawned" message
		if(messagesController != null && messageToDisplay != 0) {
			messagesController.DisplayMessage(messageToDisplay);
		}
		
		if(replacement.GetComponent(MinimapIcon))
			replacement.GetComponent(MinimapIcon).minimapCamera = minimapCamera;
		
		// Instantiate the replacement
		Instantiate(replacement, transform.position, transform.rotation);
		
		// Check if this gameObject will be destroyed or respawned by the gameManager
		if(destroy && !respawn) {
			if(hasRegeneration)
				CancelInvoke(); // Cancel the invoke of health and mana regeneration
				
			Destroy(gameObject);
		} else {
			if(gameObject.tag == "Minion")
				gameManager.AddDeadMinion(gameObject);
			else
				gameManager.Respawn(gameObject, respawnPosition, respawnTime+Time.time);
			
			if(messagesController != null)
				messagesController.DisplayCountDown(respawnTime);
				
			healthPoints = maxHealthPoints;
			manaPoints = maxManaPoints;
				
			gameObject.SetActive(false);
		}
	}
}

function SubstractMana(quantity : int) {
	manaPoints -= quantity;
}

function Regeneration() {
	if(maxManaPoints > 0) {
		if((manaPoints + manaRegenPerSecond) > maxManaPoints)
			manaPoints = maxManaPoints;
		else
			manaPoints += manaRegenPerSecond;
	}
	
	if((healthPoints + healthRegenPerSecond) > maxHealthPoints)
		healthPoints = maxHealthPoints;
	else
		healthPoints += healthRegenPerSecond;	
}

function OnGUI(){
	if(!drawBars) return;
 	if (!isVisible) return;
 	
 	GUI.depth = 2;
 	
	// Position fo the transform on screen
 	var screenPosition : Vector3 = Camera.main.WorldToScreenPoint(transform.position);
	screenPosition.y = Screen.height - (screenPosition.y + 30);
	
	// Don't draw the mana bars that has been assigned to 0
	if(maxManaPoints != 0) {
		// Background mana bar
		if(backgroundBarTexture != null)
			GUI.DrawTexture(Rect(screenPosition.x-41, screenPosition.y - 15 + hpbarHeight, mpbarWidth+2, mpbarHeight+2), backgroundBarTexture);
		
		// Current mana bar
		if(mpBarTexture != null)
			GUI.DrawTexture(Rect(screenPosition.x-40, screenPosition.y - 14 + hpbarHeight, (mpbarWidth*manaPoints)/maxManaPoints, mpbarHeight), mpBarTexture);
    }

	// Background health bar
	if(backgroundBarTexture != null)
			GUI.DrawTexture(Rect(screenPosition.x-41, screenPosition.y - 17, hpbarWidth+2, hpbarHeight+2), backgroundBarTexture);
	
	// Current health bar
	if(hpBarTexture != null)
			GUI.DrawTexture(Rect(screenPosition.x-40, screenPosition.y - 16, (hpbarWidth*healthPoints)/maxHealthPoints, hpbarHeight), hpBarTexture);
}

function OnBecameVisible () {
	isVisible = true;
}

function OnBecameInvisible () {
	isVisible = false;
}