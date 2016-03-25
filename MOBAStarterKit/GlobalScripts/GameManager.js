/**
 * This is the game manager script
 * For the moment only manage the player respawn and the minions inactive objects
 * But here you can manage another thing like the jungle respawns, or the rules of your project
 *
 * Ruben Garcia Canto (rubengc)
 * MOBA Starter Kit
 */
#pragma downcast
// This variables are used for respawn some players at their respectives positions and times
private var respawnPlayers : Array = new Array();
private var respawnPositions : Array = new Array();
private var respawnTimes : Array = new Array();

private var deadMinions : Array = new Array();

function Start () {

}

function Update () {
	if(respawnPlayers.length > 0) {
		for(var i : int = 0; i < respawnPlayers.length; i++) {
			var respawnTime : float = respawnTimes[i];
			
			if(respawnTime < Time.time) {
				var respawnPlayer : GameObject = respawnPlayers[i];
				var respawnPosition : Transform = respawnPositions[i];
				
				respawnPlayer.transform.position = respawnPosition.position;
				respawnPlayer.transform.rotation = respawnPosition.rotation;
				respawnPlayer.SetActive(true);
				
				respawnPlayers.RemoveAt(i);
				respawnPositions.RemoveAt(i);
				respawnTimes.RemoveAt(i);
			}
		}
	}
}

function Respawn(object : GameObject, position : Transform, time : float) {
		respawnPlayers.Add(object);
		respawnPositions.Add(position);
		respawnTimes.Add(time);
}

function AddDeadMinion(minion : GameObject) {
		deadMinions.Add(minion);
}

function GetDeadMinionByName(name : String) {
	if(deadMinions.length > 0) {
		for(var i : int = 0; i < deadMinions.length; i++) {
			var deadMinion : GameObject = deadMinions[i];
			
			if(deadMinion.name == name) {
				deadMinions.RemoveAt(i);
				return deadMinion;
			}
		}
	}
	
	return null;
}