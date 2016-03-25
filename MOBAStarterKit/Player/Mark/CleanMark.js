function OnTriggerEnter (other : Collider) {
	if(other.gameObject.tag == "Player") {
		gameObject.SetActive(false);
		//Destroy(gameObject);
	}
}