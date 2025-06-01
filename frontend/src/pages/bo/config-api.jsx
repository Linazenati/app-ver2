import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, message, Modal, Space, Select } from 'antd';
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    PlusOutlined,
    EditOutlined
} from '@ant-design/icons';
import apiConfigService from '../../services-call/apiconfig';

const API_CONFIG_MAPPING = {
    amadeus: [
        { key: 'clientId', label: 'Client ID', secure: true },
        { key: 'clientSecret', label: 'Client Secret', secure: true }
    ],
    chargily: [
        { key: 'CHARGILY_SECRET_KEY', label: 'Secret Key', secure: true },
        { key: 'CHARGILY_API_BASE_URL', label: 'API URL', secure: false }
    ],
    cloudinary: [
        { key: 'cloud_name', label: 'Cloud Name', secure: false },
        { key: 'api_key', label: 'API Key', secure: true },
        { key: 'api_secret', label: 'API Secret', secure: true }
    ],
    facebook: [
        { key: 'PAGE_ACCESS_TOKEN', label: 'Page Token', secure: true },
        { key: 'PAGE_ID', label: 'Page ID', secure: false },
        { key: 'GRAPH_API_VERSION', label: 'API Version', secure: false }
    ],
    instagram: [
        { key: 'INSTAGRAM_USER_ID', label: 'User ID', secure: false },
        { key: 'PAGE_ID', label: 'Page ID', secure: false },
        { key: 'IG_ACCESS_TOKEN', label: 'Access Token', secure: true },
        { key: 'GRAPH_API_VERSION', label: 'API Version', secure: false }
    ],
    stripe: [
        { key: 'STRIPE_SECRET_KEY', label: 'Secret Key', secure: true },
        { key: 'STRIPE_API_BASE_URL', label: 'API URL', secure: false }
    ]
};

const ConfigAPIsPage = () => {
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingApi, setEditingApi] = useState(null);
    const [form] = Form.useForm();
    const [showKeys, setShowKeys] = useState(false);

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        fetchAPIs();
    }, []);

    const fetchAPIs = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await apiConfigService.getAll(token);
            const apisToExclude = ['amadeus', 'cloudinary', 'jwt'];
            const filteredData = response.data
                .filter(api => !apisToExclude.includes(api.id))
                .map(api => {
                    const apiValues = {};
                    api.fields?.forEach(field => {
                        apiValues[field.key] = field.value;
                    });

                    return {
                        ...api,
                        ...apiValues,
                        configData: API_CONFIG_MAPPING[api.id]?.map(field => ({
                            label: field.label,
                            value: apiValues[field.key] || '',
                            secure: field.secure
                        })) || []
                    };
                });

            setApis(filteredData);
        } catch (error) {
            message.error('Erreur lors du chargement des APIs');
        } finally {
            setLoading(false);
        }
    };

    const renderApiConfig = (configData) => (
        <div>
            {configData.map((item, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                    <div><strong>{item.label}:</strong></div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 8,
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        maxWidth: '100%'
                    }}>
                        <div style={{ maxWidth: '80%' }}>
                            {item.value
                                ? (item.secure && !showKeys ? '••••••••••••••••' : item.value)
                                : <span style={{ color: 'red' }}>Non configuré</span>
                            }
                        </div>
                        {item.secure && item.value && (
                            <Button
                                type="text"
                                size="small"
                                icon={showKeys ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                onClick={() => setShowKeys(!showKeys)}
                            />
                        )}
                    </div>

                </div>
            ))}
        </div>
    );

    const handleEdit = (api) => {
        setEditingApi(api);
        form.setFieldsValue({
            id: api.id,
            ...Object.fromEntries(
                API_CONFIG_MAPPING[api.id]?.map(field => [field.key, api[field.key]]) || []
            )
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const token = getToken();

            if (!editingApi.id) {
                await apiConfigService.create(values, token);
                message.success('API créée avec succès');
            } else {
                await apiConfigService.update(editingApi.id, values, token);
                message.success('Configuration mise à jour avec succès');
            }

            setEditingApi(null);
            fetchAPIs();
        } catch (error) {
            message.error(error.response?.data?.error || 'Erreur lors de la sauvegarde');
        }
    };

    const renderFormFields = () => {
        if (!editingApi) return null;
        const apiType = editingApi.id || form.getFieldValue('id');
        const fields = API_CONFIG_MAPPING[apiType] || [];

        return fields.map(field => (
            <Form.Item
                key={field.key}
                name={field.key}
                label={field.label}
                rules={[{ required: true, message: `${field.label} est requis` }]}
            >
                {field.secure ? (
                    <Input.Password visibilityToggle={true} />
                ) : (
                    <Input />
                )}
            </Form.Item>
        ));
    };

    const columns = [
        {
            title: 'API',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Configuration',
            key: 'config',
            render: (_, record) => renderApiConfig(record.configData)
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="config-apis-page">
            <Card
                title="Configuration des APIs"
                bordered={false}
                extra={
                    <Button
                       
                    >
                        
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={apis}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </Card>

            <Modal
                title={editingApi?.id ? `Modifier ${editingApi.name}` : 'Ajouter une API'}
                open={!!editingApi}
                onCancel={() => setEditingApi(null)}
                onOk={handleSave}
                okText={editingApi?.id ? 'Mettre à jour' : 'Créer'}
                cancelText="Annuler"
                width={700}
            >
                <Form form={form} layout="vertical">
                    {!editingApi?.id && (
                        <Form.Item
                            name="id"
                            label="Type d'API"
                            rules={[{ required: true, message: 'Ce champ est requis' }]}
                        >
                            <Select placeholder="Sélectionnez le type d'API">
                                {Object.keys(API_CONFIG_MAPPING).map(apiType => (
                                    <Select.Option key={apiType} value={apiType}>
                                        {apiType.charAt(0).toUpperCase() + apiType.slice(1)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    {renderFormFields()}
                </Form>
            </Modal>
        </div>
    );
};

export default ConfigAPIsPage;
