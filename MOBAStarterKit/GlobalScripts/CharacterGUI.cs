using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
public class CharacterGUI : MonoBehaviour {

	public Character character;
	
	private bool isVisible = true;

	public bool displayHealthPointsBar;
	public Texture2D healthPointsBarTexture;
	public float healthPointsBarHeight = 10.0F;
	public float healthPointsBarWidth = 100.0F;
	public float healthPointsBarX = 0.0F;
	public float healthPointsBarY = 0.0F;

	public bool displayManaPointsBar;
	public Texture2D manaPointsBarTexture;
	public float manaPointsBarHeight = 10.0F;
	public float manaPointsBarWidth = 100.0F;
	public float manaPointsBarX = 0.0F;
	public float manaPointsBarY = 0.0F;

	public bool displayExperienceBar;
	public Texture2D experienceBarTexture;
	public float experienceBarHeight = 10.0F;
	public float experienceBarWidth = 100.0F;
	public float experienceBarX = 0.0F;
	public float experienceBarY = 0.0F;

	public Texture2D backgroundBarTexture;

	public bool displayLevel;
	public Texture2D levelBackgroundTexture;

	public int GUIDepth = 2;
	
	void Start () {
	
	}

	void Update () {
	
	}

	void OnBecameVisible() {
		isVisible = true;
	}

	void OnBecameInvisible() {
		isVisible = false;
	}

	void OnGUI() {
		if(character == null) return;
		//if(!isVisible) return;

		GUI.depth = GUIDepth;

		// Position of the transform in the screen
		Vector3 screenPosition = Camera.main.WorldToScreenPoint(transform.position);

		if(displayHealthPointsBar) {
			// Draws the background of health points bar
			if(backgroundBarTexture != null)
				GUI.DrawTexture(
					new Rect(
						screenPosition.x + healthPointsBarX, 
						screenPosition.y + healthPointsBarY,
						healthPointsBarWidth + 2,
						healthPointsBarHeight + 2
					),
					backgroundBarTexture
				);

			// Draws the health points bar
			if(healthPointsBarTexture != null)
				GUI.DrawTexture(
					new Rect(
						screenPosition.x + (healthPointsBarX + 1),
						screenPosition.y + (healthPointsBarY + 1),
						(healthPointsBarWidth * character.GetCurrentAttribute(Character.Attribute.HealthPoints)) / character.GetMaximumAttribute(Character.Attribute.HealthPoints),
						healthPointsBarHeight
					),
					healthPointsBarTexture
				);
		}

		if(displayManaPointsBar) {
			// Draws the background of mana points bar
			if(backgroundBarTexture != null)
				GUI.DrawTexture(
					new Rect(
						screenPosition.x + manaPointsBarX, 
						screenPosition.y + manaPointsBarY,
						manaPointsBarWidth + 2,
						manaPointsBarHeight + 2
					),
					backgroundBarTexture
				);
			
			// Draws the mana points bar
			if(manaPointsBarTexture != null)
				GUI.DrawTexture(
					new Rect(
						screenPosition.x + (manaPointsBarX + 1),
						screenPosition.y + (manaPointsBarY + 1),
						(manaPointsBarWidth * character.GetCurrentAttribute(Character.Attribute.ManaPoints)) / character.GetMaximumAttribute(Character.Attribute.ManaPoints),
						manaPointsBarHeight
					),
					manaPointsBarTexture
				);
		}

		// TODO: test the experience bar
		if(displayExperienceBar) {
			// Draws the background of experience bar
			if(backgroundBarTexture != null)
				GUI.DrawTexture(
					new Rect(
						screenPosition.x + experienceBarX, 
						screenPosition.y + experienceBarY,
						experienceBarWidth + 2,
						experienceBarHeight + 2
					),
					backgroundBarTexture
				);

			// Draws the experience bar
			if(experienceBarTexture != null)
				GUI.DrawTexture(
					new Rect(
						screenPosition.x + (experienceBarX + 1),
						screenPosition.y + (experienceBarY + 1),
						(experienceBarWidth * character.GetCurrentAttribute(Character.Attribute.Experience)) / character.GetExperienceForTheNextLevel(),
						experienceBarHeight
					),
					experienceBarTexture
				);
		}

		if(displayLevel) {

		}
	}
}
