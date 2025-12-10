var MonstersCustom = [
  {
    "name": "Goblin Psi Brawler",
    "size": "Small",
    "creature_type": "aberration",
    "alignment": "any",
    "ac": 15,
    "hp": 31,
    "hit_dice": "7d6+7",
    "speed": {
      "walk": "30 ft."
    },
    "str": 9,
    "dex": 17,
    "con": 12,
    "int": 16,
    "wis": 15,
    "cha": 10,
    "saving_throws": {
      "Int": "+5",
      "Wis": "+4"
    },
    "skills": {
      "Perception": "+2",
      "Stealth": "+4"
    },
    "damage_vulnerabilities": [],
    "damage_resistances": [
      "psychic"
    ],
    "damage_immunities": [],
    "condition_immunities": [],
    "senses": {
      "darkvision": "120 ft.",
      "passive_perception": 12
    },
    "languages": [
      "Common",
      "Goblin",
      "telepathy 30 ft."
    ],
    "cr": 2,
    "traits": [
      {
        "name": "Mental Burst",
        "desc": "When the goblin dies, its pent-up mental energy explodes in a psychic blast. Each creature within 5 feet of it must succeed on a DC 13 Intelligence saving throw or take 5 (2d4) psychic damage."
      },
      {
        "name": "Mental Fortitude",
        "desc": "The goblin has advantage on saving throws against effects that would make it have the charmed or frightened condition."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The goblin makes two Unarmed Strike attacks",
        "attack_bonus": "",
        "damage": [
          {
            "damage_type": {
              "index": "",
              "name": "",
              "url": ""
            },
            "damage_dice": ""
          }
        ]
      },
      {
        "name": "Unarmed Strike",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) psychic damage.",
        "attack_bonus": 4,
        "damage": [
          {
            "damage_type": {
              "index": "psychic",
              "name": "Psychic",
              "url": "/api/2014/damage-types/psychic"
            },
            "damage_dice": "1d4+3"
          }
        ]
      }
    ],
    "bonus_actions": [
      {
        "name": "Nimble Escape",
        "desc": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
      },
      {
        "name": "Telekinetic Shove",
        "desc": "The goblin targets one creature it can see within 30 ft of itself with a thrust of telekinetic force. The target must succeed on a DC 13 Strength saving throw or have the prone condition."
      }
    ],
    "legendary_actions": [],
    "reactions": [],
    "lair_actions": [],
    "regional_effects": [],
    "sources": [
      {
        "source": "PaB:tSO",
        "page": "215"
      }
    ],
    "id": "mo-PaB-1697"
  },
  {
    "name": "Fungal Zombie",
    "size": "Medium",
    "creature_type": "undead",
    "alignment": "neutral evil",
    "ac": 8,
    "hp": 22,
    "hit_dice": "3d8+9",
    "speed": {
      "walk": "25 ft."
    },
    "cr": 0.25,
    "str": 13,
    "dex": 6,
    "con": 16,
    "int": 2,
    "wis": 6,
    "cha": 1,
    "saving_throws": {},
    "skills": {},
    "damage_vulnerabilities": [],
    "damage_resistances": [],
    "damage_immunities": [],
    "condition_immunities": [],
    "traits": [],
    "actions": [
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 +1 ) bludgeoning damage."
      }
    ],
    "skills": {},
    "damage_immunities": [],
    "condition_immunities": [],
    "languages": ["understands Common but can\u2019t speak"],
    "xp": 50,
    "legendary_actions": [],
    "reactions": [],
    "lair_actions": [],
    "regional_effects": [],
    "sources": [
      {
        "source": "TMoKH",
        "page": "43"
      }
    ],
    "id": "mo-TMoKH-2022"
  },
  {
    "name": "Fungal Zombie, Greater",
    "size": "Medium",
    "creature_type": "Undead",
    "alignment": "Neutral Evil",
    "ac": 15,
    "hp": 97,
    "hit_dice": "13d8+39",
    "speed": {
      "walk": "20 ft."
    },
    "cr": 5,
    "str": 18,
    "dex": 10,
    "con": 17,
    "int": 2,
    "wis": 6,
    "cha": 1,
    "saving_throws": {},
    "skills": {},
    "damage_vulnerabilities": [],
    "damage_resistances": [],
    "damage_immunities": [],
    "condition_immunities": [],
    "traits": [],
    "actions": [
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 +1 ) bludgeoning damage."
      }
    ],
    "skills": {},
    "damage_immunities": [],
    "condition_immunities": [],
    "languages": ["understands the languages it knew in life but can\u2019t speak"],
    "xp": 1800,
    "legendary_actions": [],
    "reactions": [],
    "lair_actions": [],
    "regional_effects": [],
    "sources": [
      {
        "source": "TMoKH",
        "page": "43"
      }
    ],
    "id": "mo-TMoKH-2023"
  },
  {
    "name": "Fungal Zombie, Ogre",
    "size": "Large",
    "creature_type": "Undead",
    "alignment": "Neutral Evil",
    "ac": 8,
    "hp": 85,
    "hit_dice": "9d10+35",
    "speed": {
      "walk": "20 ft."
    },
    "cr": 2,
    "str": 13,
    "dex": 6,
    "con": 16,
    "int": 2,
    "wis": 6,
    "cha": 1,
    "saving_throws": {},
    "skills": {},
    "damage_vulnerabilities": [],
    "damage_resistances": [],
    "damage_immunities": [],
    "condition_immunities": [],
    "traits": [],
    "actions": [
      {
       "name": "Slam",
       "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 +1 ) bludgeoning damage."
      }
    ],
    "senses": {
      "blindsight": "30 ft.",
      "passive Perception": 8
    },
    "damage_immunities": ["Poison"],
    "condition_immunities": ["Poisoned", "Blinded", "Charmed", "frightened", "Paralyzed"],
    "languages": ["understands Common but can\u2019t speak"],
    "xp": 450,
    "legendary_actions": [],
    "reactions": [],
    "lair_actions": [],
    "regional_effects": [],
    "sources": [
      {
        "source": "TMoKH",
        "page": "44"
      }
    ],
    "id": "mo-TMO-2024"
  }
];