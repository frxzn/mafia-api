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
                "role": "assassinMafia",
                "skills": {
                    "vote": false,
                    "shoot": false,
                    "specialShot": false
                },
                "displaySkills": {
                    "day": ["Votar"],
                    "night": ["Disparar", "Tiro Especial"]
                },
                "description": "Aliado con los Mafias. Puedes disparar a un jugador todas las noches, siempre y cuando el Mafia Lider haya sido eliminado. Ademas, tienes un tiro adicional una vez por partida!",
                "display": "Mafia Asesino",
                "log": [
                    {"global": false, "event": "You are the Assassin Mafia"},
                    {"global": false, "event": "It's night-time"},
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
                    "day": ["Votar"],
                    "night": ["Cortar Lengua", "Cortar Mano"]
                },
                "description": "Aliado con los Civiles. Una vez por partida, puedes cortarle la lengua y/o la mano a un jugador, evitando que pueda hablar y/o votar, respectivamente, durante el dia.",
                "display": "Carnicero",
                "log": [
                    {"global": false, "event": "You are the Butcher"},
                    {"global": false, "event": "It's night-time"},
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
                    "day": ["Votar"],
                    "night": ["Investigar"]
                },
                "description": "Aliado con los Civiles. Puedes investigar un jugador todas las noches y averiguar su bando!",
                "display": "Policia",
                "log": [
                    {"global": false, "event": "You are the Cop"},
                    {"global": false, "event": "It's night-time"},
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
                    "day": ["Votar"],
                    "night": ["Disparar"]
                },
                "description": "Aliado con los Mafias. Puedes dispararle a un jugador todas las noches.",
                "display": "Mafia Lider",
                "log": [
                    {"global": false, "event": "You are the Leader Mafia"},
                    {"global": false, "event": "It's night-time"},
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
                    "day": ["Votar"],
                    "night": ["Curar"]
                },
                "description": "Aliado con los Civiles. Puedes curar un jugador todas las noches, el cual no se vera afectado por el disparo de los mafias, ni las habilidades del carnicero.",
                "display": "Medico",
                "log": [
                    {"global": false, "event": "You are the Medic"},
                    {"global": false, "event": "It's night-time"},
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
                    "day": ["Votar"],
                    "night": ["Disparar", "Robar"]
                },
                "description": "Aliado con los Mafias. Puedes disparar un jugador todas las noches, siempre y cuando el Mafia Lider y Mafia Asesino hayan sido eliminados. Ademas, puedes averiguar el rol de un jugador una vez por partida!",
                "display": "Mafia Ladron",
                "log": [
                    {"global": false, "event": "You are the Thief Mafia"},
                    {"global": false, "event": "It's night-time"},
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
                    "day": ["Votar"],
                    "night": ["Mendigar"]
                },
                "description": "Aliado con los Civiles. Solo puedes mendigar.",
                "display": "Mendigo",
                "log": [
                    {"global": false, "event": "You are the Vagabond"},
                    {"global": false, "event": "It's night-time"},
                ],
                "sided": "civilians"
            }
        ]
    }
];