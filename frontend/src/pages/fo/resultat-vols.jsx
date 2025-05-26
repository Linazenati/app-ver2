import React, { useState, useEffect } from 'react';
import { List, Card, Spin, message, Tooltip, Button, Divider, Collapse, Typography } from 'antd';
import { InfoCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import amadeusService from '../../services-call/amadeus';
import volsService from '../../services-call/vols';
import { TailSpin } from 'react-loader-spinner';
const { Panel } = Collapse;
const { Text, Title } = Typography;
import { useNavigate , useParams} from 'react-router-dom';

const EXCHANGE_RATES = {
    EUR: 245,
    USD: 135,
    GBP: 170,
    DZD: 1
};

const FlightResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedKeys, setExpandedKeys] = useState([]);
   const { id } = useParams();
    const navigate = useNavigate();
    const [volId, setvolId] = useState(0);
    const convertToDZD = (price, currency) => {
        if (!price || !currency) return 'N/A';
        const rate = EXCHANGE_RATES[currency] || 1;
        const amount = parseFloat(price);
        if (isNaN(amount)) return 'N/A';
        return Math.round(amount * rate) + ' DZD';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleString('fr-FR', options);
        } catch {
            return dateString;
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        return duration.replace(/PT|H|M/g, match => {
            if (match === 'PT') return '';
            if (match === 'H') return 'h ';
            if (match === 'M') return 'min';
            return match;
        });
    };

    const handleExpand = (key) => {
        setExpandedKeys(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const searchParams = JSON.parse(localStorage.getItem('flightSearchParams'));
                const token = localStorage.getItem('flightSearchToken');

                if (!searchParams || !token) {
                    throw new Error('Paramètres de recherche non trouvés');
                }

                const params = {
                    originLocationCode: searchParams.origin,
                    destinationLocationCode: searchParams.destination,
                    departureDate: searchParams.departureDate,
                    adults: searchParams.adults,
                    children: searchParams.children,
                    infants: searchParams.infants,
                    nonStop: searchParams.nonStop,
                    max: 59,
                    travelClass: searchParams.travelClass,
                    currencyCode: searchParams.currency,
                    withBaggage: searchParams.withBaggage,
                    refundable: searchParams.refundable,
                };

                if (searchParams.returnDate) {
                    params.returnDate = searchParams.returnDate;
                }

                const response = await amadeusService.searchFlights(params, token);
                if (!response) throw new Error('Aucune réponse du serveur');
                if (response.errors) throw new Error(response.errors.map(e => e.detail).join(', '));

                const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
                setResults(data);
                // Sauvegarde des résultats dans la BDD
                try {
                    const saveResponse = await volsService.searchAndSave({
                        searchParams: params,
                        results: data
                    }, token);

                    if (saveResponse && saveResponse.success) {
                        console.log('Résultats sauvegardés avec succès');
                    } else {
                        console.warn('Échec de la sauvegarde des résultats');
                    }
                } catch (saveError) {
                    console.error('Erreur lors de la sauvegarde:', saveError);
                }
                if (data.length > 0) {
                    message.success(`${data.length} vols trouvés`);
                } else {
                    message.info('Aucun vol trouvé pour ces critères');
                }
            } catch (err) {
                console.error('Erreur:', err);
                setResults([]);
                message.error(err.message || 'Erreur lors de la recherche');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const handleReservation = async (vol) => {
  try {
    const numeroVol = vol.itineraries[0]?.segments[0]?.number;

    if (!numeroVol) {
      throw new Error("Numéro de vol introuvable");
    }

    const res = await volsService.getByNumeroVol(numeroVol);

    if (!res.data || !res.data.id) {
      throw new Error("Vol non trouvé dans la base");
    }

    const idVolBase = res.data.id;

    localStorage.setItem('selectedFlight', JSON.stringify({
      id: idVolBase,
      compagnie: vol.validatingAirlineCodes?.[0] || vol.itineraries[0]?.segments[0]?.carrierCode,
      numeroVol: numeroVol,
      depart: {
        aeroport: vol.itineraries[0]?.segments[0]?.departure?.iataCode,
        date: vol.itineraries[0]?.segments[0]?.departure?.at,
        terminal: vol.itineraries[0]?.segments[0]?.departure?.terminal
      },
      arrivee: {
        aeroport: vol.itineraries[0]?.segments[0]?.arrival?.iataCode,
        date: vol.itineraries[0]?.segments[0]?.arrival?.at,
        terminal: vol.itineraries[0]?.segments[0]?.arrival?.terminal
      },
      prix: vol.price?.total || vol.price?.grandTotal,
      devise: vol.price?.currency,
      duree: vol.itineraries[0]?.duration,
      bagagesInclus: vol.pricingOptions?.includedCheckedBagsOnly || false,
      segments: vol.itineraries[0]?.segments || []
    }));

    navigate(`/web/Reservation1/${idVolBase}`);

  } catch (err) {
    console.error("Erreur lors de la récupération de l'ID du vol :", err);
  }
};


const getListVols = async (volId) => {
        const listVols = await volsService.getById(volId);

        // console.log("=========================================\n")
        // console.log(listPublications)
        // console.log("=========================================\n")

        if (listVols.data.length > 0){
            setvolId ( listVols.data[0].id );
        }
    }

    useEffect( ()=>{
        //Envoyer une requête pour récupérer la liste des publications avec id_omra = id
        getListVols( id );
    }, [] )

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Title
                level={3}
                style={{
                    marginBottom: 24,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#003366',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
            >
                Résultats des vols
            </Title>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <TailSpin
                        height="80"
                        width="80"
                        color="#1890ff"
                        ariaLabel="loading"
                    />
                    <div style={{ marginTop: 16, fontSize: 18, color: '#1890ff' }}>
                        Chargement des résultats...
                    </div>
                </div>
            ) : (
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={results}
                    locale={{ emptyText: 'Aucun résultat trouvé' }}
                    renderItem={(item) => {
                        const itinerary = item.itineraries?.[0] || {};
                        const segments = itinerary.segments || [];
                        const price = item.price || {};
                        const carrierCode = item.validatingAirlineCodes?.[0] || segments[0]?.carrierCode;
                        const logoUrl = `https://content.airhex.com/content/logos/airlines_${carrierCode}_100_100_r.png`;
                        const cardKey = `flight-${item.id}`;
                        const isExpanded = expandedKeys.includes(cardKey);

                        // EXTRAIT POUR PRIX DÉTAILLÉ
                        const basePrice = price.base || 'N/A';
                        const taxes = price.taxes || 'N/A';

                        // EXTRAIT REFUNDABILITÉ (si présent)
                        const refundable = item.refundable !== undefined ? (item.refundable ? 'Oui' : 'Non') : 'N/A';

                        return (
                            <List.Item key={item.id}>
                                <Card
                                    style={{
                                        borderRadius: 12,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        border: '1px solid #f0f0f0',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: 'pointer',
                                        minHeight: 180,
                                        maxWidth: 320,
                                        margin: 'auto',
                                        overflow: 'hidden',
                                    }}
                                    bodyStyle={{ padding: 12 }}
                                    hoverable
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                        <Tooltip title={carrierCode}>
                                            <img
                                                src={logoUrl}
                                                alt={carrierCode}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: 'contain',
                                                    borderRadius: '4px',
                                                    marginRight: 12
                                                }}
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/40/CCCCCC/000000?text=${carrierCode || 'N/A'}`;
                                                }}
                                            />
                                        </Tooltip>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text strong>{carrierCode || 'Compagnie inconnue'}</Text>
                                                <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                                                    {price.grandTotal || price.total || 'N/A'} {price.currency || ''}
                                                </Text>
                                            </div>
                                            <Text type="secondary">{convertToDZD(price.grandTotal || price.total, price.currency)}</Text>
                                        </div>
                                    </div>

                                    <Divider style={{ margin: '12px 0' }} />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div>
                                            <Text strong>{segments[0]?.departure?.iataCode}</Text>
                                            <br />
                                            <Text type="secondary">{formatDate(segments[0]?.departure?.at)}</Text>
                                            {segments[0]?.departure?.terminal && (
                                                <Text type="secondary" style={{ display: 'block' }}>
                                                    Terminal: {segments[0].departure.terminal}
                                                </Text>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <Text type="secondary">{formatDuration(itinerary.duration)}</Text>
                                            <br />
                                            <Text>{segments.length === 1 ? 'Direct' : `${segments.length - 1} escale(s)`}</Text>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <Text strong>{segments[segments.length - 1]?.arrival?.iataCode}</Text>
                                            <br />
                                            <Text type="secondary">{formatDate(segments[segments.length - 1]?.arrival?.at)}</Text>
                                            {segments[segments.length - 1]?.arrival?.terminal && (
                                                <Text type="secondary" style={{ display: 'block' }}>
                                                    Terminal: {segments[segments.length - 1].arrival.terminal}
                                                </Text>
                                            )}
                                        </div>
                                    </div>

                                    <Collapse
                                        bordered={false}
                                        activeKey={expandedKeys}
                                        onChange={(keys) => setExpandedKeys(keys)}
                                    >
                                        <Panel
                                            key={cardKey}
                                            header={
                                                <span style={{ color: '#1890ff', fontWeight: 500 }}>
                                                    {expandedKeys.includes(cardKey) ? 'Masquer les détails' : 'Voir plus de détails'}
                                                </span>
                                            }
                                            showArrow={false}
                                        >
                                            <div style={{ fontSize: 14, lineHeight: '1.5' }}>
                                                {segments.map((seg, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            borderBottom: '1px solid #f0f0f0',
                                                            marginBottom: 8,
                                                            paddingBottom: 8
                                                        }}
                                                    >
                                                        <Text strong>
                                                            Segment {idx + 1} - Vol {seg.carrierCode} {seg.number}
                                                        </Text>
                                                        <br />
                                                        <Text>
                                                            Départ : {seg.departure.iataCode} à {formatDate(seg.departure.at)}{' '}
                                                            {seg.departure.terminal ? `(Terminal ${seg.departure.terminal})` : ''}
                                                        </Text>
                                                        <br />
                                                        <Text>
                                                            Arrivée : {seg.arrival.iataCode} à {formatDate(seg.arrival.at)}{' '}
                                                            {seg.arrival.terminal ? `(Terminal ${seg.arrival.terminal})` : ''}
                                                        </Text>
                                                        <br />
                                                        <Text>Durée : {formatDuration(seg.duration)}</Text>
                                                        <br />
                                                        <Text>Appareil : {seg.aircraft?.code || 'N/A'}</Text>
                                                        {seg.operating && seg.operating.carrierCode !== seg.carrierCode && (
                                                            <Text type="warning">
                                                                Vol opéré par : {seg.operating.carrierCode}
                                                            </Text>
                                                        )}
                                                        <br />
                                                        {seg.baggageAllowance && (
                                                            <Text>
                                                                Bagages : {seg.baggageAllowance.weight} {seg.baggageAllowance.weightUnit}
                                                            </Text>
                                                        )}
                                                    </div>
                                                ))}

                                                <Divider />

                                                <Text strong>Prix détaillé :</Text>
                                                <br />
                                                <Text>Base : {basePrice} {price.currency}</Text>
                                                <br />
                                                <Text>Taxes : {taxes} {price.currency}</Text>
                                                <br />
                                                <Text strong>Total : {price.grandTotal || price.total} {price.currency}</Text>
                                                <br />
                                                <Text type="secondary">({convertToDZD(price.grandTotal || price.total, price.currency)})</Text>

                                                <Divider />

                                                <Text>Remboursable : {refundable}</Text>
                                                <br />
                                                <Text>Code de validation : {carrierCode}</Text>
                                            </div>
                                        </Panel>
                                    </Collapse>

                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        style={{ marginTop: 12, width: '100%', borderRadius: 6 }}
                                        onClick={() => handleReservation(item)}
                                    >
                                        Réserver ce vol
                                    </Button>
                                </Card>
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default FlightResultsPage;
