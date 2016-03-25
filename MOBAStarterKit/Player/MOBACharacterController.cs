using UnityEngine;
using System.Collections;

public class MOBACharacterController : MonoBehaviour {

	public Character character;

	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
		GameObject mark;

		if(!character.IsAttacking()) {
			mark = GameObject.FindWithTag("Mark");
			
			if(mark != null && mark.activeInHierarchy) {
				character.SetTarget(mark.transform);
				character.Move( (mark.transform.position - transform.position).normalized, false, false, mark.transform.position );
			} else {
				character.StopMoveToTarget();
				//character.Move ( Vector3.zero, false, false, transform.position + transform.forward * 100 );
			}
		}
	}

	void OnDrawGizmosSelected () {
		Gizmos.color = Color.red;
		Gizmos.DrawWireSphere (transform.position, character.visionRange);
	}
}