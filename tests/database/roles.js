const cop = {
    role: 'cop',
    skills: {
        vote: false,
        investigate: false
    },
    displaySkills: {
        day: ['Votar'],
        night: ['Investigar']
    },
    description: 'Aliado con los Civiles. Puedes investigar un jugador todas las noches y averiguar su bando!',
    display: 'Policia',
    log: [
        {global: false, event: 'Tu rol es Policia.'},
        {global: false, event: 'La partida ha comenzado.'},
        {global: false, event: 'Es de noche.'}
    ],
    sided: 'civilians'
}

const medic = {
    role: 'medic',
    skills: {
        vote: false,
        heal: false
    },
    displaySkills: {
        day: ['Votar'],
        night: ['Curar']
    },
    description: 'Aliado con los Civiles. Puedes curar un jugador todas las noches, el cual no se vera afectado por el disparo de los mafias, ni las habilidades del carnicero.',
    display: 'Medico',
    log: [
        {global: false, event: 'Tu rol es Medico.'},
        {global: false, event: 'La partida ha comenzado.'},
        {global: false, event: 'Es de noche.'}
    ],
    sided: 'civilians'
}

const leaderMafia = {
    role: 'leaderMafia',
    skills: {
        vote: false,
        shoot: false
    },
    displaySkills: {
        day: ['Votar'],
        night: ['Disparar']
    },
    description: 'Aliado con los Mafias. Puedes dispararle a un jugador todas las noches.',
    display: 'Mafia Lider',
    log: [
        {global: false, event: 'Tu rol es Mafia Lider.'},
        {global: false, event: 'La partida ha comenzado.'},
        {global: false, event: 'Es de noche.'}
    ],
    sided: 'mafia'
}

module.exports = {
    cop,
    medic,
    leaderMafia
}