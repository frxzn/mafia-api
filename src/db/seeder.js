const seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
seeder.connect(process.env.MONGODB_URL, function() {

  // Load Mongoose models
  seeder.loadModels([
    'src/models/role'
  ]);

  // Clear specified collections
  seeder.clearModels(['Role'], function() {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });

  });
});

// Data array containing seed data - documents organized by Model
var data = [
    {
        'model': 'Role',
        'documents': [
            {
                "role": "apprenticeMafia",
                "skills": {
                    "vote": false,
                    "shoot": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Shoot"]
                },
                "description": "Allied with the mafia. Can shoot a player every night only if there's no other ally alive with a higher rank.",
                "display": "Apprentice",
                "log": [
                    {"global": false, "event": "Your role is Apprentice Mafia. It's night-time."},
                ],
                "sided": "mafia"
            },
            {
                "role": "assassinMafia",
                "skills": {
                    "vote": false,
                    "shoot": false,
                    "specialShot": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Shoot", "Special Shot"]
                },
                "description": "Allied with the mafia. Can shoot a player every night, only when the Leader has been eliminated. Furthermore, you have an additional shot per game.",
                "display": "Assassin",
                "log": [
                    {"global": false, "event": "Your role is Assassin Mafia. It's night-time."},
                ],
                "sided": "mafia"
            },
            {
                "role": "butcher",
                "skills": {
                    "vote": false,
                    "cutTongue": false,
                    "cutArm": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Cut Tongue", "Cut Hand"]
                },
                "description": "Allied with the village. Once per game, you can cut a players hand and/or tongue, preventing the victim from voting and/or chatting for the entire game.",
                "display": "Butcher",
                "log": [
                    {"global": false, "event": "Your role is Butcher. It's night-time."},
                ],
                "sided": "civilians"
            },
            {
                "role": "cop",
                "skills": {
                    "vote": false,
                    "investigate": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Investigate"]
                },
                "description": "Allied with the village. Can investigate a player every night and find out who's he sided with.",
                "display": "Cop",
                "log": [
                    {"global": false, "event": "Your role is Cop. It's night-time."},
                ],
                "sided": "civilians"
            },
            {
                "role": "leaderMafia",
                "skills": {
                    "vote": false,
                    "shoot": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Shoot"]
                },
                "description": "Allied with the mafia. Can shoot a player every night.",
                "display": "Leader",
                "log": [
                    {"global": false, "event": "Your role is Leader Mafia. It's night-time."},
                ],
                "sided": "mafia"
            },
            {
                "role": "medic",
                "skills": {
                    "vote": false,
                    "heal": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Heal"]
                },
                "description": "Allied with the village. Can heal a player every night, which will be saved from the Mafia's shot and the Butcher's skills.",
                "display": "Medic",
                "log": [
                    {"global": false, "event": "Your role is Medic. It's night-time."},
                ],
                "sided": "civilians"
            },
            {
                "role": "thiefMafia",
                "skills": {
                    "vote": false,
                    "shoot": false,
                    "steal": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Shoot", "Steal"]
                },
                "description": "Allied with the mafia. Can shoot a player every night, only when the Leader and Assassin have been eliminated. Furthermore, you can inquire a players role once per game.",
                "display": "Thief",
                "log": [
                    {"global": false, "event": "Your role is Thief Mafia. It's night-time."},
                ],
                "sided": "mafia"
            },
            {
                "role": "vagabond",
                "skills": {
                    "vote": false,
                    "beg": false
                },
                "displaySkills": {
                    "day": ["Vote"],
                    "night": ["Beg"]
                },
                "description": "Allied with the village. Can beg for money.",
                "display": "Mendigo",
                "log": [
                    {"global": false, "event": "Your role is Vagabond. It's night-time."},
                ],
                "sided": "civilians"
            }
        ]
    }
];