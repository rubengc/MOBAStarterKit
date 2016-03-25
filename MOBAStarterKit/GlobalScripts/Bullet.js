var damage : int = 50;
var speed : float = 15;
var timeToDestroy = 5;

function Start() {
	transform.rigidbody.velocity = transform.TransformDirection (Vector3.forward * speed);
	
	yield WaitForSeconds(timeToDestroy);
	Destroy(gameObject);
}

function Update() {

}

function OnTriggerEnter (other : Collider) {
	if(other.transform.GetComponent(CharacterInformation) != null
		&& other.transform.GetComponent(Bullet) == null) {
		if(other.transform.GetComponent(CharacterInformation).team != transform.GetComponent(CharacterInformation).team) {
			other.transform.GetComponent(CharacterInformation).ApplyDamage(damage);
			Destroy(gameObject);
		}
	} else if(other.gameObject.tag == "Ground") {
		Destroy(gameObject);
	}
}