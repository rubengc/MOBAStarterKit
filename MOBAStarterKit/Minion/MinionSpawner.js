#pragma strict
/**
 * This is the minions spawner script and his function is instatiate minions or respawn the dead minion
 * 
 *
 * Ruben Garcia Canto (rubengc)
 * MOBA Starter Kit
 */
var gameManager : GameManager;
var minimapCamera : Camera;
var minions : GameObject[];
var minionsPerWave : int[];

var team : int = 0;
var wayPoints : Transform[];

var timeFirstWave : float;
var timeBetweenWaves : float;
@HideInInspector
var countDown : float;
@HideInInspector
var startCountDown : boolean;


function Start () {
	countDown = timeBetweenWaves;
	startCountDown = false;
	yield WaitForSeconds(timeFirstWave);
	createWave();
}

function Update () {

	if(countDown <= 0) {
		countDown = timeBetweenWaves;
		startCountDown = false;
		createWave();
	}

	if(startCountDown) {
		countDown -= Time.deltaTime;
	}
}

function createWave() {
	for (var i = 0; i < minions.length; i++) {
		for (var j = 0; j < minionsPerWave[i]; j++) {
			yield WaitForSeconds(0.8);
			var deadMinion : GameObject = gameManager.GetDeadMinionByName(minions[i].name+"(Clone)");
			
			if(deadMinion != null && !deadMinion.activeInHierarchy) {
				deadMinion.transform.position = transform.position;
				deadMinion.transform.rotation = transform.rotation;
				deadMinion.GetComponent(MinionAI).waypoint = wayPoints;
				deadMinion.GetComponent(MinionAI).currentWaypoint = 0;
				deadMinion.GetComponent(MinionAI).target = wayPoints[0];
				deadMinion.GetComponent(MinionAI).state = 0;
				
				deadMinion.SetActive(true);
			} else {
				minions[i].GetComponent(MinionAI).waypoint = wayPoints;
				minions[i].GetComponent(CharacterInformation).team = team;
				minions[i].GetComponent(CharacterInformation).gameManager = gameManager;
				minions[i].GetComponent(CharacterInformation).minimapCamera = minimapCamera;
				minions[i].GetComponent(MinimapIcon).minimapCamera = minimapCamera;

				Instantiate(minions[i], transform.position, transform.rotation);
			}
		}
	}

	startCountDown = true;
}