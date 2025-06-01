const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname, '../config');

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

const API_CONFIG = {
  amadeus: {
    template: (data) => `const Amadeus = require('amadeus');
module.exports = new Amadeus({
  clientId: '${data.clientId}',
  clientSecret: '${data.clientSecret}'
});`
  },
  chargily: {
    template: (data) => `module.exports = {
  CHARGILY_SECRET_KEY: '${data.CHARGILY_SECRET_KEY}',
  CHARGILY_API_BASE_URL: '${data.CHARGILY_API_BASE_URL || 'https://pay.chargily.net/test/api/v2'}'
};`
  },
  cloudinary: {
    template: (data) => `const cloudinary = require('cloudinary').v2;
module.exports = cloudinary.config({
  cloud_name: '${data.cloud_name || 'daz2lntzd'}',
  api_key: '${data.api_key}',
  api_secret: '${data.api_secret}'
});`
  },
  facebook: {
    template: (data) => `module.exports = {
  PAGE_ACCESS_TOKEN: '${data.PAGE_ACCESS_TOKEN}',
  PAGE_ID: '${data.PAGE_ID || '665147193344725'}',
  GRAPH_API_VERSION: '${data.GRAPH_API_VERSION || 'v22.0'}'
};`
  },
  instagram: {
    template: (data) => `module.exports = {
  INSTAGRAM_USER_ID: '${data.INSTAGRAM_USER_ID || '17841474541066139'}',
  PAGE_ID: '${data.PAGE_ID || '665147193344725'}',
  IG_ACCESS_TOKEN: '${data.IG_ACCESS_TOKEN}',
  GRAPH_API_VERSION: '${data.GRAPH_API_VERSION || 'v22.0'}'
};`
  },
  stripe: {
    template: (data) => `module.exports = {
  STRIPE_SECRET_KEY: '${data.STRIPE_SECRET_KEY}',
  STRIPE_API_BASE_URL: '${data.STRIPE_API_BASE_URL || 'https://api.stripe.com/v1'}'
};`
  }
};

function loadConfigFromFile(configName) {
  const configPath = path.join(CONFIG_DIR, `${configName}.config.js`);
  if (fs.existsSync(configPath)) {
    delete require.cache[require.resolve(configPath)];
    return require(configPath);
  }
  return {};
}

exports.getAll = async () => {
  const files = fs.readdirSync(CONFIG_DIR);
  const configs = [];

  files.forEach(file => {
    if (file.endsWith('.config.js')) {
      const configName = file.replace('.config.js', '');
      try {
        const config = loadConfigFromFile(configName);
        const fields = API_CONFIG_MAPPING[configName] || [];

        const mappedFields = fields.map(f => ({
          key: f.key,
          label: f.label,
          value: config[f.key] || '',
          secure: f.secure
        }));

        configs.push({
          id: configName,
          name: configName.charAt(0).toUpperCase() + configName.slice(1),
          fields: mappedFields,
          active: config.active || false,
          hasWebhook: config.webhookSecret !== undefined
        });
      } catch (err) {
        console.error(`Error loading config ${file}:`, err);
      }
    }
  });

  return configs;
};

exports.getById = async (id) => {
  try {
    const config = loadConfigFromFile(id);
    const fields = API_CONFIG_MAPPING[id] || [];

    const mappedFields = fields.map(f => ({
      key: f.key,
      label: f.label,
      value: config[f.key] || '',
      secure: f.secure
    }));

    return {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      fields: mappedFields,
      active: config.active || false,
      hasWebhook: config.webhookSecret !== undefined
    };
  } catch (err) {
    return null;
  }
};

exports.update = async (id, data) => {
  const configPath = path.join(CONFIG_DIR, `${id}.config.js`);
  try {
    const currentConfig = loadConfigFromFile(id);
    const fields = API_CONFIG_MAPPING[id] || [];
    const updatedData = { ...currentConfig };

    fields.forEach(f => {
      if (data[f.key] !== undefined) {
        updatedData[f.key] = data[f.key];
      }
    });

    const templateFunc = API_CONFIG[id]?.template;
    const configContent = templateFunc
      ? templateFunc(updatedData)
      : `module.exports = ${JSON.stringify(updatedData, null, 2)};`;

    fs.writeFileSync(configPath, configContent);

    const mappedFields = fields.map(f => ({
      key: f.key,
      label: f.label,
      value: updatedData[f.key] || '',
      secure: f.secure
    }));

    return {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      fields: mappedFields,
      active: updatedData.active || false,
      hasWebhook: updatedData.webhookSecret !== undefined
    };
  } catch (err) {
    console.error(`Error updating config ${id}:`, err);
    return null;
  }
};

exports.updateStatus = async (id, active) => {
  return this.update(id, { active });
};
