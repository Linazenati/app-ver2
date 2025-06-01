import React, { useState } from 'react';
import { DatePicker, Select, Button, Form, Row, Col, Input, AutoComplete } from 'antd';
import { SwapOutlined, UserOutlined, DownOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FlightSearchForm = ({ token }) => {
  const [form] = Form.useForm();
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (!values.origin || !values.destination || !values.dateRange?.[0]) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const searchParams = {
        origin: values.origin.substring(0, 3).toUpperCase(), destination: values.destination.substring(0, 3).toUpperCase(),

        departureDate: values.dateRange[0].format('YYYY-MM-DD'),
        adults: parseInt(values.adults) || 1,
        children: parseInt(values.children) || 0,
        infants: parseInt(values.infants) || 0,
        travelClass: values.flightClass?.toUpperCase() || 'ECONOMY',
        currency: values.currency || 'EUR',
      };

      if (isRoundTrip && values.dateRange[1]) {
        searchParams.returnDate = values.dateRange[1].format('YYYY-MM-DD');
      }

      localStorage.setItem('flightSearchParams', JSON.stringify(searchParams));
      localStorage.setItem('flightSearchToken', token);
      navigate('/web/vols/resultat');
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    const origin = form.getFieldValue('origin');
    const destination = form.getFieldValue('destination');
    form.setFieldsValue({
      origin: destination,
      destination: origin
    });
  };

  const handleTripTypeChange = (value) => {
    setIsRoundTrip(value === 'roundtrip');
    if (value === 'oneway') {
      const currentDates = form.getFieldValue('dateRange');
      if (currentDates && currentDates.length > 1) {
        form.setFieldsValue({
          dateRange: [currentDates[0]],
        });
      }
    }
  };

  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={styles.backgroundContainer}>
      <div style={styles.overlay}>
        <div style={styles.contentContainer}>
          <div style={styles.formCard}>
            <h1 style={styles.mainTitle}>Trouvez votre vol idéal</h1>
            <p style={styles.subTitle}>Comparez les prix parmi des centaines de compagnies aériennes</p>

            <Form
              form={form}
              onFinish={handleSubmit}
              initialValues={{
                tripType: 'roundtrip',
                adults: 1,
                children: 0,
                infants: 0,
                flightClass: 'ECONOMY',
                currency: 'EUR',
              }}
            >
              <div style={styles.controlsRow}>
                <Form.Item name="tripType" style={styles.tripTypeControl}>
                  <Select
                    onChange={handleTripTypeChange}
                    suffixIcon={<DownOutlined style={styles.selectIcon} />}
                    style={styles.select}
                  >
                    <Option value="roundtrip">Aller-retour</Option>

                  </Select>
                </Form.Item>

                <div style={styles.passengersContainer}>
                  <Form.Item name="adults" label="Adultes" style={styles.passengerControl}>
                    <Select
                      suffixIcon={<DownOutlined style={styles.selectIcon} />}
                      style={styles.select}
                    >
                      {[...Array(10).keys()].map(i => (
                        <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="children" label="Enfants" style={styles.passengerControl}>
                    <Select
                      suffixIcon={<DownOutlined style={styles.selectIcon} />}
                      style={styles.select}
                    >
                      {[...Array(10).keys()].map(i => (
                        <Option key={i} value={i}>{i}</Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="flightClass" style={styles.classControl}>
                    <Select
                      suffixIcon={<DownOutlined style={styles.selectIcon} />}
                      style={styles.select}
                    >
                      <Option value="ECONOMY">ECONOMY</Option>
                      <Option value="PREMIUM_ECONOMY">PREMIUM_ECONOMY</Option>
                      <Option value="BUSINESS">BUSINESS</Option>
                      <Option value="FIRST">FIRST</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <div style={styles.searchRow}>
                <div style={styles.locationInputs}>
                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>Départ</label>
                    <Form.Item
                      name="origin"
                      rules={[{ required: true, message: 'Veuillez sélectionner une ville de départ' }]}
                    >
                      <AutoComplete
                        options={[
                          { value: 'ALG - Alger' },
                          { value: 'CDG - Paris Charles de Gaulle' },
                          { value: 'ORY - Paris Orly' },
                          { value: 'IST - Istanbul' },
                          { value: 'DXB - Dubai' },
                          { value: 'BCN - Barcelone' },
                          { value: 'FRA - Francfort' },
                          { value: 'MAD - Madrid' },
                          { value: 'LHR - Londres Heathrow' },
                          { value: 'LYS - Lyon' },
                          { value: 'MRS - Marseille' },
                          { value: 'TUN - Tunis' },
                          { value: 'CMN - Casablanca' },
                          { value: 'CAI - Le Caire' },
                          { value: 'DOH - Doha' },
                          { value: 'AMM - Amman' },
                          { value: 'RUH - Riyad' },
                           { value: 'CAI - Le Caire (Égypte)' },
                          { value: 'DPS - Denpasar (Bali, Indonésie)' },
                             { value: 'LIS - Lisbonne (Portugal)' },
                          { value: 'MLE - Malé (Maldives)' },
                          { value: 'MRU - Île Maurice' },
                          { value: 'RUH - Riyad (Arabie Saoudite)' }
                        ]}
                        filterOption={(inputValue, option) =>
                          option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                      >
                        <Input
                          prefix={<UserOutlined style={styles.inputIcon} />}
                          placeholder="Ville ou aéroport"
                          style={styles.input}
                        />
                      </AutoComplete>
                    </Form.Item>

                  </div>

                  <button type="button" style={styles.swapButton} onClick={swapLocations}>
                    <SwapOutlined style={styles.swapIcon} />
                  </button>

                  <div style={styles.inputWrapper}>
                    <label style={styles.inputLabel}>Destination</label>
                    <Form.Item
                      name="destination"
                      rules={[{ required: true, message: 'Veuillez sélectionner une destination' }]}
                    >
                      <AutoComplete
                        options={[
                          { value: 'ALG - Alger' },
                          { value: 'CDG - Paris Charles de Gaulle' },
                          { value: 'ORY - Paris Orly' },
                          { value: 'IST - Istanbul' },
                          { value: 'DXB - Dubai' },
                          { value: 'BCN - Barcelone' },
                          { value: 'FRA - Francfort' },
                          { value: 'MAD - Madrid' },
                          { value: 'LHR - Londres Heathrow' },
                          { value: 'LYS - Lyon' },
                          { value: 'MRS - Marseille' },
                          { value: 'TUN - Tunis' },
                          { value: 'CMN - Casablanca' },
                          { value: 'CAI - Le Caire' },
                          { value: 'DOH - Doha' },
                          { value: 'AMM - Amman' },
                          { value: 'RUH - Riyad' },
                          { value: 'CAI - Le Caire (Égypte)' },
                          { value: 'DPS - Denpasar (Bali, Indonésie)' },
                         
                          { value: 'LIS - Lisbonne (Portugal)' },
                          { value: 'MLE - Malé (Maldives)' },
                          { value: 'MRU - Île Maurice' },
                          { value: 'RUH - Riyad (Arabie Saoudite)' },
                        ]}
                        filterOption={(inputValue, option) =>
                          option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                      >
                        <Input
                          prefix={<UserOutlined style={styles.inputIcon} />}
                          placeholder="Ville ou aéroport"
                          style={styles.input}
                        />
                      </AutoComplete>
                    </Form.Item>

                  </div>
                </div>

                <div style={styles.dateInputWrapper}>
                  <label style={styles.inputLabel}>
                    <CalendarOutlined style={styles.calendarIcon} />
                    {isRoundTrip ? 'Dates de voyage' : 'Date de départ'}
                  </label>
                  <Form.Item
                    name="dateRange"
                    rules={[{ required: true, message: 'Veuillez sélectionner une date de départ' }]}
                  >
                    {isRoundTrip ? (
                      <RangePicker
                        format="DD/MM/YYYY"
                        style={styles.datePicker}
                        separator={<span style={styles.dateSeparator}>→</span>}
                      />
                    ) : (
                      <DatePicker
                        format="DD/MM/YYYY"
                        style={styles.datePicker}
                      />
                    )}
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button
                    htmlType="submit"
                    loading={loading}
                    style={styles.searchButton}
                  >
                    <SearchIcon />
                    <span>Rechercher</span>
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backgroundContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    backgroundImage: 'url(/images/vols1.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
    imageRendering: "crisp-edges",
    backgroundAttachment: "fixed",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  contentContainer: {
    maxWidth: '800px',
    width: '80%',
    margin: '0 auto',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
  },
  mainTitle: {
    color: '#003366',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subTitle: {
    color: '#666',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  tripTypeControl: {
    margin: 0,
  },
  passengersContainer: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  passengerControl: {
    margin: 0,
  },
  classControl: {
    margin: 0,
  },
  select: {
    width: '140px',
    borderRadius: '8px',
    border: '1px solid #d9d9d9',
    padding: '4px 8px',
  },
  selectIcon: {
    color: '#003366',
  },
  searchRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  locationInputs: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '16px',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    flex: 1,
    minWidth: '250px',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    height: '30px',
    borderRadius: '8px',
    border: '1px solid #d9d9d9',
    padding: '0 16px',
    fontSize: '16px',
  },
  inputIcon: {
    color: '#003366',
    fontSize: '18px',
    marginRight: '8px',
  },
  swapButton: {
    backgroundColor: '#003366',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'all 0.3s',
  },
  swapIcon: {
    color: 'white',
    fontSize: '18px',
  },
  dateInputWrapper: {
    flex: 1,
    minWidth: '300px',
  },
  calendarIcon: {
    color: '#003366',
    fontSize: '18px',
    marginRight: '8px',
  },
  datePicker: {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
  },
  dateSeparator: {
    color: '#003366',
    padding: '0 8px',
  },
  searchButton: {
    backgroundColor: '#003366',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
    height: '56px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0, 51, 102, 0.3)',
  },
};

export default FlightSearchForm;