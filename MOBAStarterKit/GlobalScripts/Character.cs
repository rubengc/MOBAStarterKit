using UnityEngine;
using System.Collections;

public class Character : MonoBehaviour {

	/*
	 * Enums
	 */
	public enum Attribute {
		Level,
		Experience,
		HealthPoints,
		ManaPoints,
		Attack,
		Defense,
		SpecialAttack,
		SpecialDefense,
		Speed
	}

	public enum Type {
		Player,
		Minion,
		Tower
	}

	public enum AttackClass {
		Melee,
		Ranged
	}

	public int team;

	public Character.Type type;

	public int level = 1; // Level is based on experience
	public int maximumLevel = 20;

	public int experience = 100; // Base experience for the first level, the value of this attribute will be used for calculate how much experience need at each level

	// Base attributes used for calculate the current and maximum attributes
	public int healthPoints = 120;
	public int manaPoints = 90;
	public int attack = 30;
	public int defense = 20;
	public int specialAttack = 30;
	public int specialDefense = 20;
	public int speed = 5;

	// The current attributes
	private int currentExperience;
	
	private int currentHealthPoints;
	private int currentManaPoints;
	private int currentAttack;
	private int currentDefense;
	private int currentSpecialAttack;
	private int currentSpecialDefense;
	private int currentSpeed;

	public Character.AttackClass attackClass;

	// Static variables (don't increment by level)
	public int attackSpeed = 5;
	public int attackRange = 5;
	public int visionRange = 5;

	public GameObject projectile;
	public Transform shootPosition;

	// Variables for regeneration per second
	public bool hasRegeneration = false;
	public int healthPointsRegenerationPerSecond = 5;
	public int manaPointsRegenerationPerSecond = 5;

	private Transform target;
	private bool isMovingToTarget;
	private bool isAttacking;

	public Animator animator;

	void OnEnable() {
		if(hasRegeneration)
			InvokeRepeating("Regeneration", 0, 1); // Starts the regeneration invoke at second 0 and repeat the method invocation each seccond
	}

	void OnDisable() {
		if(hasRegeneration)
			CancelInvoke(); // Cancel the regeneration invoke
	}
	
	void Start () {
		// Initialize all current attributes
		currentExperience = CalculateMaximumValue(experience);

		currentHealthPoints = CalculateMaximumValue(healthPoints);
		currentManaPoints = CalculateMaximumValue(manaPoints);
		currentAttack = CalculateMaximumValue(attack);
		currentDefense = CalculateMaximumValue(defense);
		currentSpecialAttack = CalculateMaximumValue(specialAttack);
		currentSpecialDefense = CalculateMaximumValue(specialDefense);
		currentSpeed = CalculateMaximumValue(speed);
	}

	void Update () {
		if(animator != null) {
			animator.SetBool("isMovingToTarget", isMovingToTarget);
		}
	}

	public void MoveToTarget() {
		if(transform.position != target.position) {
			isMovingToTarget = true;

			Vector3 direction = target.position - transform.position;
			float distance = direction.magnitude;      
			float movement = (GetCurrentAttribute(Character.Attribute.Speed)/4) * Time.deltaTime;

			// Normalize the movement speed
			if(distance > movement) {
				//controller.Move(direction.normalized * movement);
			} 
			else {
				//controller.Move(direction);
			}
			
			// Rotate to target
			direction.y = 0; // Prevent rotation in Y axys
			transform.forward = Vector3.Slerp(transform.forward, direction, Time.deltaTime * 5); 
		} 
	}

	public void Move (Vector3 move, bool crouch, bool jump, Vector3 lookPos) {
		
		if (move.magnitude > 1) move.Normalize();

		isMovingToTarget = true;
		
		// grab current velocity, we will be changing it.
		Vector3 velocity = rigidbody.velocity;
		
		Vector3 localMove = transform.InverseTransformDirection (move);
		float turnAmount = Mathf.Atan2 (localMove.x, localMove.z);
		float forwardAmount = localMove.z;
		
		float turnSpeed = Mathf.Lerp (180, 360, forwardAmount);
		transform.Rotate (0, turnAmount * turnSpeed * Time.deltaTime, 0);
		
		Ray ray = new Ray (transform.position + Vector3.up * .1f, -Vector3.up);
		RaycastHit[] hits = Physics.RaycastAll (ray, .5f);
		RayHitComparer rayHitComparer = new RayHitComparer ();
		System.Array.Sort (hits, rayHitComparer);
		
		if (velocity.y < 2 * .5f) {;
			rigidbody.useGravity = true;
			foreach (var hit in hits) {
				// check whether we hit a non-trigger collider (and not the character itself)
				if (!hit.collider.isTrigger) {
					// this counts as being on ground.
					
					// stick to surface - helps character stick to ground - specially when running down slopes
					if (velocity.y <= 0) {
						rigidbody.position = Vector3.MoveTowards (rigidbody.position, hit.point, Time.deltaTime * 5.0f);
					}

					rigidbody.useGravity = false;
					break;
				}
			}
		}
		
		velocity.y = 0;
		
		if (move.magnitude == 0) {
			// when not moving this prevents sliding on slopes:
			velocity.x = 0;
			velocity.z = 0;
		}
		
		// reassign velocity, since it will have been modified by the above functions.
		rigidbody.velocity = velocity;
	}

	//used for comparing distances
	class RayHitComparer: IComparer
	{
		public int Compare(object x, object y)
		{
			return ((RaycastHit)x).distance.CompareTo(((RaycastHit)y).distance);
		}	
	}

	public void StopMoveToTarget() {
		this.isMovingToTarget = false;
	}
	
	public void Attack() {
		
	}
	
	public void TakeDamage(int damage) {
		DecreaseAttribute(Character.Attribute.HealthPoints, (damage - currentDefense));
	}

	public void TakeMagicDamage(int damage) {
		DecreaseAttribute(Character.Attribute.HealthPoints, (damage - currentSpecialDefense));
	}

	public void Regeneration() {
		IncreaseAttribute(Character.Attribute.HealthPoints, healthPointsRegenerationPerSecond);
		IncreaseAttribute(Character.Attribute.ManaPoints, manaPointsRegenerationPerSecond);
	}

	public void IncreaseAttribute(Character.Attribute attribute, int increment) {
		int currentValue = GetCurrentAttribute(attribute);
		int maximumValue = GetMaximumAttribute(attribute);

		if(currentValue < maximumValue) {
			if((currentValue + increment) > maximumValue)
				SetCurrentAttribute(attribute, maximumValue);
			else
				SetCurrentAttribute(attribute, (currentValue + increment));
		}
	}

	public void DecreaseAttribute(Character.Attribute attribute, int decrement) {
		int currentValue = GetCurrentAttribute(attribute);

		if(currentValue > 0) {
			if((currentValue - decrement) < 0)
				SetCurrentAttribute(attribute, 0);
			else
				SetCurrentAttribute(attribute, (currentValue - decrement));
		}
	}

	/*
	 * Private methods
	 */
	private int CalculateMaximumValue(int attributeValue) {
		return attributeValue + ((attributeValue * level) / maximumLevel);
	}

	public int GetExperienceForTheNextLevel() {
		return experience + ((experience * (level + 1)) / maximumLevel);
	}

	/*
	 * Getters y setters of current and maximum attributes
	 */
	public int GetCurrentAttribute(Character.Attribute attribute) {
		switch(attribute) {
			case Character.Attribute.Level: return level;
			case Character.Attribute.Experience: return currentExperience;
			case Character.Attribute.HealthPoints: return currentHealthPoints;
			case Character.Attribute.ManaPoints: return currentManaPoints;
			case Character.Attribute.Attack: return currentAttack;
			case Character.Attribute.Defense: return currentDefense;
			case Character.Attribute.SpecialAttack: return currentSpecialAttack;
			case Character.Attribute.SpecialDefense: return currentSpecialDefense;
			case Character.Attribute.Speed: return currentSpeed;
			default: return 0;
		}
	}

	public bool SetCurrentAttribute(Character.Attribute attribute, int value) {
		switch(attribute) {
			case Character.Attribute.Experience: 
				currentExperience = value;
				break;
			case Character.Attribute.HealthPoints: 
				currentHealthPoints = value;
				break;
			case Character.Attribute.ManaPoints: 
				currentManaPoints  = value;
				break;
			case Character.Attribute.Attack: 
				currentAttack = value;
				break;
			case Character.Attribute.Defense: 
				currentDefense = value;
				break;
			case Character.Attribute.SpecialAttack: 
				currentSpecialAttack = value;
				break;
			case Character.Attribute.SpecialDefense: 
				currentSpecialDefense = value;
				break;
			case Character.Attribute.Speed:
				currentSpeed = value;
				break;
			default: return false;
		}

		return true;
	}

	public int GetMaximumAttribute(Character.Attribute attribute) {
		switch(attribute) {
			case Character.Attribute.Level: return this.maximumLevel;
			case Character.Attribute.Experience: return CalculateMaximumValue(this.experience);
			case Character.Attribute.HealthPoints: return CalculateMaximumValue(this.healthPoints);
			case Character.Attribute.ManaPoints: return CalculateMaximumValue(this.manaPoints);
			case Character.Attribute.Attack: return CalculateMaximumValue(this.attack);
			case Character.Attribute.Defense: return CalculateMaximumValue(this.defense);
			case Character.Attribute.SpecialAttack: return CalculateMaximumValue(this.specialAttack);
			case Character.Attribute.SpecialDefense: return CalculateMaximumValue(this.specialDefense);
			case Character.Attribute.Speed: return CalculateMaximumValue(this.speed);
			default: return 0;
		}
	}

	public bool IsMovingToTarget() {
		return this.isMovingToTarget;
	}

	public bool IsAttacking() {
		return this.isAttacking;
	}

	public void SetTarget(Transform target) {
		this.target = target;
	}

	public Transform GetTarget() {
		return this.target;
	}
}
