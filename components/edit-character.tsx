import { Character } from "types";

import { useState } from "react";
import { useRouter } from "next/router";

import { editCharacter } from "@api-client/characters/characters-api";

import Stepper from "@components/stepper";

import styles from "./edit-character.module.css";

type EditCharacterProps = {
  initialCharacter: Character;
};

export default function EditCharacter({
  initialCharacter,
}: EditCharacterProps): JSX.Element {
  const router = useRouter();
  const [error, setError] = useState();
  // TODO use a reducer for handling form state
  const [skillPoints, setSkillPoints] = useState(initialCharacter.skillPoints);
  const [health, setHealth] = useState(initialCharacter.health);
  const [attack, setAttack] = useState(initialCharacter.attack);
  const [defense, setDefense] = useState(initialCharacter.defense);
  const [magik, setMagik] = useState(initialCharacter.magik);

  return (
    <>
      <h1 className={styles.title}>Edit {initialCharacter.name}</h1>
      <p className={styles.description}>Level: {initialCharacter.level}</p>
      <p className={styles.description}>Skill points: {skillPoints}</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await editCharacter(initialCharacter.id, {
              health,
              attack,
              defense,
              magik,
            });
            router.push("/");
          } catch (error) {
            setError(error.message);
          }
        }}
      >
        <Stepper
          id="health"
          value={health}
          label="Health"
          handleChange={(newHealth) => {
            setHealth(newHealth);
            setSkillPoints(
              newHealth > health ? skillPoints - 1 : skillPoints + 1
            );
          }}
          min={initialCharacter.health}
          max={skillPoints + health}
        />
        <Stepper
          id="attack"
          value={attack}
          label="Attack"
          handleChange={(newAttack) => {
            setAttack(newAttack);
            setSkillPoints(getSkillPoints(attack, newAttack, skillPoints));
          }}
          min={initialCharacter.attack}
          max={getMaxForSkill(attack, skillPoints)}
        />
        <Stepper
          id="defense"
          value={defense}
          label="Defense"
          handleChange={(newDefense) => {
            setDefense(newDefense);
            setSkillPoints(getSkillPoints(defense, newDefense, skillPoints));
          }}
          min={initialCharacter.defense}
          max={getMaxForSkill(defense, skillPoints)}
        />
        <Stepper
          id="magik"
          value={magik}
          label="Magik"
          handleChange={(newMagik) => {
            setMagik(newMagik);
            setSkillPoints(getSkillPoints(magik, newMagik, skillPoints));
          }}
          min={initialCharacter.magik}
          max={getMaxForSkill(magik, skillPoints)}
        />
        <button type="button" onClick={() => router.back()}>
          Click here to go back
        </button>
        <button type="submit">Submit</button>
        {error ? <div>{error}</div> : null}
      </form>
    </>
  );
}

function getSkillPoints(
  skillValue: number,
  newSkillValue: number,
  skillPoints: number
) {
  return newSkillValue > skillValue
    ? skillPoints - (Math.ceil(skillValue / 5) || 1)
    : skillPoints + (Math.ceil(skillValue / 5) || 1);
}

export function getMaxForSkill(skill: number, skillPoints: number): number {
  return skillPoints > 0 && skillPoints >= (Math.ceil(skill / 5) || 1)
    ? skill + Math.floor(skillPoints / (Math.ceil(skill / 5) || 1))
    : skill;
}
