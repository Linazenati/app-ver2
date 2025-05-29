import { Link } from "react-router-dom";
import imgDest1 from "../../assets/fo/img/turkey.jpg";
import imgDest2 from "../../assets/fo/img/unatedstate.jpg";
import imgDest3 from "../../assets/fo/img/germany.jpg";
import imgDest4 from "../../assets/fo/img/france.jpg";
import imgDest5 from "../../assets/fo/img/spain.jpg";
import imgDest6 from "../../assets/fo/img/australia.jpg";
import mondeImg from "../../assets/fo/img/1.png";
import singapourImg from "../../assets/fo/img/2.png";
import azerbaijanImg from "../../assets/fo/img/3.png";
import malaisieImg from "../../assets/fo/img/4.png";
import franceImg from "../../assets/fo/img/5.png";
import istanbulImg from "../../assets/fo/img/6.png";
import omrahImg from "../../assets/fo/img/7.jpg";
import hotImg from "../../assets/fo/img/8.jpg";
import mosqueImg from "../../assets/fo/img/9.jpg";

const DestinationItem = (props) => {
    const { img, country, info, toLink } = props;

    const styles = {
        col: {
            padding: '0 15px',
            marginBottom: '30px'
        },
        destinationItem: {
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '15px',
            transition: 'all 0.5s ease',
            height: '300px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        imgContainer: {
            width: '100%',
            height: '100%',
            position: 'relative'
        },
        img: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(90%)',
            transition: 'all 0.3s ease'
        },
        destinationOverlay: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '20px',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
        },
        countryText: {
            color: 'white',
            marginBottom: '5px',
            fontSize: '1.25rem',
            fontWeight: '600'
        },
        infoText: {
            display: 'block',
            fontSize: '0.9rem',
            opacity: '0.9'
        }
    };

    return (
        <div className="col-lg-4 col-md-6 mb-4" style={styles.col}>
            <div className="destination-item" style={styles.destinationItem}>
                <div style={styles.imgContainer}>
                    <img className="img-fluid" src={img} alt={country} style={styles.img} />
                    <Link className="destination-overlay" to={toLink} style={styles.destinationOverlay}>
                        <h5 style={styles.countryText}>{country}</h5>
                        <span style={styles.infoText}>{info}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const VisaItem = ({ img, title, toLink }) => {
    const styles = {
        visaCard: {
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            height: '250px',
            transition: 'all 0.6s cubic-bezier(0.5, 0, 0, 1)',
            transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
            '&:hover': {
                transform: 'perspective(1000px) rotateY(5deg) rotateX(5deg)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }
        },
        imageWrapper: {
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        },
        visaImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease'
        },
        visaTitle: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '15px',
            margin: '0',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: '600'
        }
    };

    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <Link to={toLink} style={{ textDecoration: 'none' }}>
                <div className="visa-card" style={styles.visaCard}>
                    <div style={styles.imageWrapper}>
                        <img src={img} alt={title} style={styles.visaImage} />
                    </div>
                    <h3 style={styles.visaTitle}>{title}</h3>
                </div>
            </Link>
        </div>
    );
};

function Destination() {
    const styles = {
        containerFluid: {
            padding: '3rem 0'
        },
        container: {
            padding: '3rem 0',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        textCenter: {
            textAlign: 'center',
            marginBottom: '1rem',
            paddingBottom: '1rem'
        },
        textPrimary: {
            color: '#003366',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            fontSize: '1.25rem'
        },
        bgLight: {
            backgroundColor: '#f8f9fa'
        },
        bgDark: {
            backgroundColor: '#003366',
            color: 'white'
        },
        sectionTitle: {
            color: '#003366',
            marginBottom: '2rem'
        },
        serviceCard: {
            background: 'white',
            borderRadius: '10px',
            transition: 'all 0.3s',
            height: '100%',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        serviceIcon: {
            fontSize: '2.5rem',
            color: 'var(--jaune)',
            marginBottom: '1rem'
        },
        serviceTitle: {
            marginBottom: '1rem',
            color: '#2c3e50'
        },
        serviceDesc: {
            color: '#7f8c8d'
        },
        hoverEffects: {
            transform: 'translateY(-10px)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
        },
        // Styles pour la section Omra
        omraSection: {
            padding: '80px 0',
            backgroundColor: '#f9f9f9'
        },
        omraTitle: {
            textAlign: 'center',
            marginBottom: '40px',
            color: '#003366',
            fontSize: '2rem',
            fontWeight: '600'
        },
        omraDescription: {
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '1.1rem',
            color: '#555'
        },
        omraGallery: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginTop: '30px'
        },
        omraImage: {
            width: '300px',
            height: '200px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'scale(1.05)'
            }
        },
        omraImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        }
    };

    return (
        <>
            {/* Section Destination */}
            <div className="container-fluid py-5" style={styles.containerFluid}>
                <div className="container pt-5 pb-3" style={styles.container}>
                    <div className="text-center mb-3 pb-3" style={styles.textCenter}>
                        <h6 style={styles.textPrimary}>Destination</h6>
                        <h1>Explore Top Destination</h1>
                    </div>
                    <div className="row">
                        <DestinationItem
                            img={imgDest1}
                            country="Turquie"
                            info="Découvrez Istanbul, Cappadoce et les plages méditerranéennes. Un mélange unique d'Orient et d'Occident."
                            toLink="/web/Voyage"
                        />
                        <DestinationItem
                            img={imgDest2}
                            country="États-Unis"
                            info="Explorez New York, les parcs nationaux et la Californie. Le rêve américain sous toutes ses facettes."
                            toLink="/web/Voyage"
                        />
                        <DestinationItem
                            img={imgDest3}
                            country="Allemagne"
                            info="Berlin, Munich et la Forêt-Noire. Culture, histoire et nature au cœur de l'Europe."
                            toLink="/web/Voyage"
                        />
                        <DestinationItem
                            img={imgDest4}
                            country="France"
                            info="Paris, la Provence et la Côte d'Azur. Art de vivre, gastronomie et paysages variés."
                            toLink="/web/Voyage"
                        />
                        <DestinationItem
                            img={imgDest5}
                            country="Espagne"
                            info="Barcelone, Madrid et la Costa del Sol. Soleil, fête et patrimoine culturel exceptionnel."
                            toLink="/web/Voyage"
                        />
                        <DestinationItem
                            img={imgDest6}
                            country="Australie"
                            info="Sydney, la Grande Barrière et l'Outback. Nature sauvage et villes cosmopolites."
                            toLink="/web/Voyage"
                        />
                    </div>
                </div>
            </div>

           <div className="container-fluid py-5 bg-light" style={{ ...styles.containerFluid, ...styles.bgLight }}>
    <div className="container py-5" style={styles.container}>
        <div className="text-center mb-5" style={styles.textCenter}>
            <h1 style={styles.sectionTitle}>Découvrez Nos Services</h1>
        </div>

        <div className="row">
            <div className="col-md-6 col-lg-3 mb-4">
                <Link to="/web/Voyage" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                        className="service-card"
                        style={{ 
                            ...styles.serviceCard,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.querySelector('i').style.transform = 'rotate(5deg) scale(1.1)';
                            e.currentTarget.querySelector('i').style.color = '#003366';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.querySelector('i').style.transform = '';
                            e.currentTarget.querySelector('i').style.color = 'var(--jaune)';
                        }}
                    >
                        <i className="fas fa-map-marked-alt" style={{ 
                            ...styles.serviceIcon,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}></i>
                        <h3 style={styles.serviceTitle}>Voyages Personnalisés</h3>
                        <p style={styles.serviceDesc}>
                            Créez votre propre voyage sur mesure selon vos préférences et votre budget.
                        </p>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '3px',
                            background: 'linear-gradient(90deg, #003366 0%, var(--jaune) 100%)',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.4s ease-out'
                        }}></div>
                    </div>
                </Link>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
                <Link to="/web/hotel/Hammamet" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                        className="service-card"
                        style={{ 
                            ...styles.serviceCard,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.querySelector('i').style.transform = 'rotate(5deg) scale(1.1)';
                            e.currentTarget.querySelector('i').style.color = '#003366';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.querySelector('i').style.transform = '';
                            e.currentTarget.querySelector('i').style.color = 'var(--jaune)';
                        }}
                    >
                        <i className="fas fa-hotel" style={{ 
                            ...styles.serviceIcon,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}></i>
                        <h3 style={styles.serviceTitle}>Réservation d'Hôtels</h3>
                        <p style={styles.serviceDesc}>Réservez des hôtels de qualité pour un séjour agréable et serein.</p>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '3px',
                            background: 'linear-gradient(90deg, #003366 0%, var(--jaune) 100%)',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.4s ease-out'
                        }}></div>
                    </div>
                </Link>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
                <Link to="/web/Vols" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                        className="service-card"
                        style={{ 
                            ...styles.serviceCard,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.querySelector('i').style.transform = 'rotate(5deg) scale(1.1)';
                            e.currentTarget.querySelector('i').style.color = '#003366';
                            e.currentTarget.querySelector('div').style.transform = 'scaleX(1)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.querySelector('i').style.transform = '';
                            e.currentTarget.querySelector('i').style.color = 'var(--jaune)';
                            e.currentTarget.querySelector('div').style.transform = 'scaleX(0)';
                        }}
                    >
                        <i className="fas fa-plane-departure" style={{ 
                            ...styles.serviceIcon,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}></i>
                        <h3 style={styles.serviceTitle}>Vols</h3>
                        <p style={styles.serviceDesc}>
                            Réservez facilement vos billets d'avion vers de nombreuses destinations à prix compétitifs.
                        </p>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '3px',
                            background: 'linear-gradient(90deg, #003366 0%, var(--jaune) 100%)',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.4s ease-out'
                        }}></div>
                    </div>
                </Link>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
                <Link to="/web/Assurance" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                        className="service-card"
                        style={{ 
                            ...styles.serviceCard,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.querySelector('i').style.transform = 'rotate(5deg) scale(1.1)';
                            e.currentTarget.querySelector('i').style.color = '#003366';
                            e.currentTarget.querySelector('div').style.transform = 'scaleX(1)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = '';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.querySelector('i').style.transform = '';
                            e.currentTarget.querySelector('i').style.color = 'var(--jaune)';
                            e.currentTarget.querySelector('div').style.transform = 'scaleX(0)';
                        }}
                    >
                        <i className="fas fa-wallet" style={{ 
                            ...styles.serviceIcon,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}></i>
                        <h3 style={styles.serviceTitle}>Assurance Voyage</h3>
                        <p style={styles.serviceDesc}>Bénéficiez d'une couverture complète avec notre assurance voyage.</p>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '3px',
                            background: 'linear-gradient(90deg, #003366 0%, var(--jaune) 100%)',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.4s ease-out'
                        }}></div>
                    </div>
                </Link>
            </div>
        </div>
    </div>
</div>
            {/* Section Omra */}
           {/* Section Omra */}
<section id="omra" className="omra-section" style={styles.omraSection}>
    <div className="container" style={styles.container}>
        <div className="text-center mb-3 pb-3" style={styles.textCenter}>
            <h6 style={styles.textPrimary}>Omra</h6>
            <h1>Pèlerinage à La Mecque</h1>
        </div>
        <div className="row">
            <DestinationItem
                img={omrahImg}
                country="Omra Standard"
                info="Découvrez notre package Omra standard avec hébergement proche de la Sainte Mosquée."
                toLink="http://localhost:5173/web/Omra"
            />
            <DestinationItem
                img={hotImg}
                country="Omra Luxe"
                info="Vivez une expérience premium avec nos packages Omra haut de gamme et hôtels 5 étoiles."
                toLink="http://localhost:5173/web/Omra"
            />
            <DestinationItem
                img={mosqueImg}
                country="Omra en Groupe"
                info="Rejoignez nos groupes organisés avec accompagnateurs expérimentés pour un pèlerinage spirituel."
                toLink="http://localhost:5173/web/Omra"
            />
        </div>
    </div>
</section>


            {/* Section Visas */}
            <div className="container-fluid py-5" style={styles.containerFluid}>
                <div className="container py-5" style={styles.container}>
                    <div className="text-center mb-5" style={styles.textCenter}>
                        <h1 style={styles.sectionTitle}>Nos Visas</h1>
                        <p className="lead">Explorez nos services de visas disponibles pour des destinations à travers le monde.</p>
                    </div>

                    <div className="row">
                        <VisaItem
                            img={mondeImg}
                            title="Visa à travers le monde"
                            toLink="/web/Visatouristique"
                        />
                        <VisaItem
                            img={singapourImg}
                            title="Visa Singapour"
                            toLink="/web/Visatouristique"
                        />
                        <VisaItem
                            img={azerbaijanImg}
                            title="Visa Azerbaïdjan"
                            toLink="/web/Visatouristique"
                        />
                        <VisaItem
                            img={malaisieImg}
                            title="Visa Malaisie"
                            toLink="/web/Visatouristique"
                        />
                        <VisaItem
                            img={franceImg}
                            title="Visa France"
                            toLink="/web/Visatouristique"
                        />
                        <VisaItem
                            img={istanbulImg}
                            title="Visa Istanbul"
                            toLink="/web/Visatouristique"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Destination;