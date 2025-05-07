import React from "react";

const OmraProgram = () => {
    const commonStyles = {
        boxSizing: "border-box",
        color: "rgb(33, 37, 41)",
        fontFamily: "Poppins, sans-serif",
        fontSize: "14px",
    };

    const paragraphStyles = {
        ...commonStyles,
        marginTop: "0px",
        marginBottom: "1rem",
    };

    const listStyles = {
        ...commonStyles,
        paddingLeft: "2rem",
        margin: "0px 0px 1.5em 2em",
    };

    const listItemStyles = {
        ...commonStyles,
        boxSizing: "border-box",
    };

    const boldSpanStyles = {
        ...commonStyles,
        boxSizing: "border-box",
        fontWeight: "bolder",
    };

    const days = [
        { id: 1, title: "Jour 1 : Arrivée à Médina", activities: [{ time: "Heure", description: "Arrivée à l'aéroport de Médina." }, { time: "Transfert", description: "Transfert à l'hôtel Arjowan Rose." }, { time: "Matinée", description: "Repos à l'hôtel après le voyage." }, { time: "Après-midi", description: "Visite de la Mosquée du Prophète (Masjid al-Nabawi)." }, { time: "Soirée", description: "Dîner à l'hôtel ou dans un restaurant local." }] },
        { id: 2, title: "Jour 2 : Médina", activities: [{ time: "Matin", description: "Prière à la Mosquée du Prophète, visite de la tombe du Prophète Muhammad (paix soit sur lui)." }, { time: "Après-midi", description: "Visite de sites historiques (Mosquée Quba, Montagne Uhud)." }, { time: "Soir", description: "Temps libre pour explorer les marchés locaux." }] },
        { id: 3, title: "Jour 3 : Médina", activities: [{ time: "Matin", description: "Prière à la Mosquée du Prophète." }, { time: "Après-midi", description: "Visite de la mosquée Qiblatain et du cimetière de Baqi." }, { time: "Soir", description: "Dîner et temps libre." }] },
        { id: 4, title: "Jour 4 : Départ pour La Mecque", activities: [{ time: "Matin", description: "Dernière prière à la Mosquée du Prophète." }, { time: "Transfert", description: "Départ pour La Mecque (environ 4 heures de route)." }, { time: "Arrivée", description: "Arrivée à l'hôtel Kasr El Janadriya, installation." }, { time: "Soir", description: "Prière à la Mosquée Sacrée (Masjid al-Haram)." }] },
        { id: 5, title: "Jour 5 : La Mecque", activities: [{ time: "Matin", description: "Prière et Tawaf autour de la Kaaba." }, { time: "Après-midi", description: "Visite de la colline de Safa et Marwah pour le Sa'i." }, { time: "Soir", description: "Temps libre pour prier et méditer." }] },
        { id: 6, title: "Jour 6 : La Mecque", activities: [{ time: "Matin", description: "Prière à la Mosquée Sacrée." }, { time: "Après-midi", description: "Visite de la montagne de Arafat (si possible) et de Muzdalifah." }, { time: "Soir", description: "Dîner et temps libre." }] },
        { id: 7, title: "Jour 7 : La Mecque", activities: [{ time: "Matin", description: "Prière et Tawaf supplémentaire." }, { time: "Après-midi", description: "Visite de la grotte de Hira." }, { time: "Soir", description: "Temps libre pour prier et méditer." }] },
        { id: 8, title: "Jour 8 : La Mecque", activities: [{ time: "Matin", description: "Prière à la Mosquée Sacrée." }, { time: "Après-midi", description: "Visite de Mina et de la mosquée de Tanaïm." }, { time: "Soir", description: "Dîner et temps libre." }] },
        { id: 9, title: "Jour 9 : La Mecque", activities: [{ time: "Matin", description: "Prière et Tawaf." }, { time: "Après-midi", description: "Temps libre pour le shopping ou la prière." }, { time: "Soir", description: "Dîner et préparation pour le départ vers Médina." }] },
        { id: 10, title: "Jour 10 : La Mecque", activities: [{ time: "Matin", description: "Prière à la Mosquée Sacrée." }, { time: "Après-midi", description: "Temps libre pour prier ou explorer." }, { time: "Soir", description: "Dîner et temps libre." }] },
        { id: 11, title: "Jour 11 : La Mecque", activities: [{ time: "Matin", description: "Prière et Tawaf." }, { time: "Après-midi", description: "Visite de sites supplémentaires (exemple : mosquée de Tanaïm)." }, { time: "Soir", description: "Temps libre pour prier et méditer." }] },
        { id: 12, title: "Jour 12 : La Mecque", activities: [{ time: "Matin", description: "Prière à la Mosquée Sacrée." }, { time: "Après-midi", description: "Dernière visite à la Kaaba et prière." }, { time: "Soir", description: "Dîner et préparation pour le départ vers Médina." }] },
        { id: 13, title: "Jour 13 : Retour à Médina", activities: [{ time: "Matin", description: "Dernière prière à la Mosquée Sacrée." }, { time: "Transfert", description: "Départ pour Médina." }, { time: "Arrivée", description: "Installation à l'hôtel Arjowan Rose." }, { time: "Soir", description: "Prière à la Mosquée du Prophète." }] },
        { id: 14, title: "Jour 14 : Médina", activities: [{ time: "Matin", description: "Prière à la Mosquée du Prophète." }, { time: "Après-midi", description: "Temps libre pour explorer Médina." }, { time: "Soir", description: "Dîner et temps libre." }] },
        { id: 15, title: "Jour 15 : Départ pour Jeddah", activities: [{ time: "Matin", description: "Dernière prière à la Mosquée du Prophète." }, { time: "Transfert", description: "Départ pour l'aéroport de Jeddah" }, { time: "Vol", description: "Vol retour de Jeddah vers Alger." }] },
    ];

    const images = [
        "/images/omra1.jpg",
        "/images/omra2.jpg",
        "/images/omra3.jpg",
        "/images/omra4.jpg",
    ];

    const inclusions = [
        "Vol direct depuis l'aéroport d'Alger",
        "Programme de visites à La Mecque et à Médine",
        "Assurance médicale 24 heures sur 24",
        "Accompagnement par des guides jeunes, compétents et expérimentés",
        "Cours religieux par des imams qualifiés",
        "Transport entre La Mecque et Médine en bus climatisé",
        "Accès à la Rawda Sharifa",
        "Cadeaux pour les pèlerins",
    ];

    return (
        
        <div className="container pt-5" style={{ fontFamily: "Poppins, sans-serif" }}>
            <section id="program">
                <h3 className="fs-4 mb-4">Programme</h3>
                <div className="row">
                    <div className="col-md-7">
                        <div className="interary-item">
                            <div className="v-stepper mb-5">
                                <div className="circle">
                                    <span className="icon-left">
                                        <strong>
                                            La Omrah est un pèlerinage spirituel important pour les
                                            musulmans, effectué à La Mecque. Les rituels incluent Tawaf autour de la Kaaba,
                                            Sa'i entre Safa et Marwah, et prières de Tarawih pour renforcer foi et communauté.
                                        </strong>
                                    </span>
                                </div>
                                <div className="line"></div>
                            </div>

                            {days.map((day) => (
                                <div key={day.id}>
                                    <p style={paragraphStyles}>
                                        <span style={boldSpanStyles}>{day.title}</span>
                                    </p>
                                    <ul style={listStyles}>
                                        {day.activities.map((activity, index) => (
                                            <li key={index} style={listItemStyles}>
                                                <span style={boldSpanStyles}>{activity.time} :</span> {activity.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-5 d-flex flex-column align-items-start">
                        {images.map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt={`Omra image ${idx + 1}`}
                                style={{
                                    width: "100%",
                                    marginBottom: "50px",
                                    borderRadius: "20px",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                                    transition: "transform 0.4s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            />
                        ))}
                    </div>

                </div>
            </section>

            <section id="include_not_include" className="mt-5">
                <h3 className="fs-4 mb-4">Inclut </h3>
                <div className="row">
                    <div className="col-md-7">
                        <ul style={listStyles}>
                            {inclusions.map((item, index) => (
                                <li key={index} style={listItemStyles}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-5">
                        <div className="rounded-lg bg-yellow-100 text-blue-900 p-8 text-center">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-900">
                                Prêt pour cette expérience spirituelle ?
                            </h2>
                            <p className="mb-6 text-blue-800">
                                Réservez votre Omra et bénéficiez de notre accompagnement complet.
                            </p>
                            <button type="button" class="btn btn-warning rounded-pill px-4 py-2 fw-semibold text-blue-900">Réserver maintenant</button>
                        </div>
                    </div>


                </div>
            </section>
        </div>
    );
};

export default OmraProgram;
