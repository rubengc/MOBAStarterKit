#pragma strict
var markPrefab : GameObject;
var attackMarkPrefab : GameObject;

private var createdMark : GameObject;
private var createdAttackMark : GameObject;

var alertPingPrefab : GameObject;
var warningPingPrefab : GameObject;

var alertSound : AudioClip;
var warningSound : AudioClip;

var player : GameObject;

private var playerTeam : int;
private var mobaController : MOBACharacterController;
private var spellController : SpellsController;

var messagesController : MessagesController;

var minimapCamera : Camera;

private var isOnMinimap : boolean;

private var ray : Ray;
private var hit : RaycastHit;

function Start() {
	playerTeam = player.GetComponent(CharacterInformation).team;
	mobaController = player.GetComponent(MOBACharacterController);
	spellController = player.GetComponent(SpellsController);
}

function Update () {	
	var leftControl : boolean;
	
	if(Input.GetKey("left ctrl"))
    	leftControl = true;
	else
    	leftControl = false;

	// If the mouse is over the minimap then cast the ray hit from the minimap camera
	if( Input.mousePosition.x > minimapCamera.pixelRect.x && Input.mousePosition.x < minimapCamera.pixelRect.xMax
		&& Input.mousePosition.y > minimapCamera.pixelRect.y && Input.mousePosition.y < minimapCamera.pixelRect.yMax )
		isOnMinimap = true;
	else
		isOnMinimap = false;
		

	var shaders : GameObject[];
	
	// Construct a ray from the camera to the mouse position
	if(!isOnMinimap)
		ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	else
		ray = minimapCamera.ScreenPointToRay(Input.mousePosition);

	if (Physics.Raycast(ray, hit)) {
		if(hit.collider.tag == "Ground" || hit.collider.tag == "SpellMark") {
		
			if (leftControl && Input.GetMouseButtonDown(0)) {
				CreatePing(alertPingPrefab, alertSound, "Don't go to this place");
			} else if(leftControl && Input.GetMouseButtonDown(1)) {
				CreatePing(warningPingPrefab, warningSound, "Warning!!!");
			} else if (Input.GetMouseButtonDown(0)) {
				CreateMark();
				mobaController.state = 0;
			} else if(Input.GetMouseButtonDown(1)) {
				CreateAttackMark();
				mobaController.state = 1;
			}
			
			if(!isOnMinimap) {
				shaders = GameObject.FindGameObjectsWithTag("Shader");
				
				for(var shader in shaders)
					shader.SetActive(false); 
			}
			
		} else if (hit.transform.Find("Shader") != null) {
			if(!isOnMinimap) {
				shaders = GameObject.FindGameObjectsWithTag("Shader");
				
				for(var shader in shaders)
					shader.SetActive(false);
				 	
				hit.transform.Find("Shader").gameObject.SetActive(true);
			}
			
			var targetTeam : int;
			var targetTag : String;
			
			if (leftControl && Input.GetMouseButtonDown(0)) {				
				if ( hit.transform.parent.GetComponent(CharacterInformation) != null) {
					targetTeam = hit.transform.parent.GetComponent(CharacterInformation).team;
					targetTag = hit.transform.gameObject.tag;
				}  else if(hit.transform.GetComponent(CharacterInformation) != null) {
					targetTeam = hit.transform.GetComponent(CharacterInformation).team;
					targetTag = hit.transform.gameObject.tag;
				}
				
				if(targetTeam != playerTeam) {
					CreatePing(null, alertSound, "Careful with this "+targetTag.ToLower()+"!");
				} else {
					CreatePing(null, alertSound, "Be careful "+targetTag.ToLower()+"!!!");
				}
			} else if (leftControl && Input.GetMouseButtonDown(1)) {				
				if ( hit.transform.parent.GetComponent(CharacterInformation) != null) {
					targetTeam = hit.transform.parent.GetComponent(CharacterInformation).team;
					targetTag = hit.transform.gameObject.tag;
				}  else if(hit.transform.GetComponent(CharacterInformation) != null) {
					targetTeam = hit.transform.GetComponent(CharacterInformation).team;
					targetTag = hit.transform.gameObject.tag;
				}
				
				if(targetTeam != playerTeam) {
					CreatePing(null, warningSound, "Go away from this "+targetTag.ToLower()+"!!!");
				} else {
					CreatePing(null, warningSound, "Come back "+targetTag.ToLower()+"!!!");
				}
			} else if(Input.GetMouseButtonDown(1)) {
				if ( hit.transform.parent.GetComponent(CharacterInformation) != null) {
					CleanMarks();
					
					if(hit.transform.parent.GetComponent(CharacterInformation).team != playerTeam) {
						// Set the new target to moba controller
						mobaController.SetTarget(hit.transform.parent.transform);
					}
				} else if(hit.transform.GetComponent(CharacterInformation) != null) {
					CleanMarks();
					
					// Fix for towers detection
					if(hit.transform.GetComponent(CharacterInformation).team != playerTeam) {
						// Set the new target to moba controller
						mobaController.SetTarget(hit.transform.parent.transform);
					}
				}
			}
		}
		
		if( Input.GetButtonDown("Spell0") 
			|| Input.GetButtonDown("Spell1")
			|| Input.GetButtonDown("Spell2")
			|| Input.GetButtonDown("Spell3") ) {
			if( spellController )	{
				if(!spellController.IsCasting()) {
					if(Input.GetButtonDown("Spell0"))
						spellController.PrepareToCast(0, hit.point, "Spell0");
					
					if(Input.GetButtonDown("Spell1"))
						spellController.PrepareToCast(1, hit.point, "Spell1");
						
					if(Input.GetButtonDown("Spell2"))
						spellController.PrepareToCast(2, hit.point, "Spell2");
						
					if(Input.GetButtonDown("Spell3"))
						spellController.PrepareToCast(3, hit.point, "Spell3");
				}
			}
		}
	}		
}

function CreateMark() {
	CleanMarks();
	// Create a mark if hit
	if(createdMark != null) {
		createdMark.transform.position = hit.point;
		createdMark.SetActive(true);
	} else {
		createdMark = Instantiate (markPrefab, hit.point, Quaternion(0,0,0,0));
	}
}

function CreateAttackMark() {
	CleanMarks();
	// Create a mark if hit
	if(createdAttackMark != null) {
		createdAttackMark.transform.position = hit.point;
		createdAttackMark.SetActive(true);
	} else {
		createdAttackMark = Instantiate (attackMarkPrefab, hit.point, Quaternion(0,0,0,0));
	}
}

function CleanMarks() {
	if(player != null) {
		if( spellController )	{
			spellController.ClearSpellMark();
		}
	}

	if(createdMark != null)
		createdMark.SetActive(false);
		//Destroy(createdMark);
		
	if(createdAttackMark != null)
		createdAttackMark.SetActive(false);
		//Destroy(createdAttackMark);
}

function CreatePing(pingPrefab : GameObject, clip : AudioClip, message : String) {
	if(pingPrefab != null) {
		if(pingPrefab.GetComponent(MinimapIcon))
			pingPrefab.GetComponent(MinimapIcon).minimapCamera = minimapCamera;
			
		Instantiate (pingPrefab, hit.point, Quaternion(0,0,0,0));		
	}
	
	if(clip != null)
		AudioSource.PlayClipAtPoint(clip, hit.point);
		
	if(message != "")
		messagesController.DisplayMessageToPlayer(message);
}