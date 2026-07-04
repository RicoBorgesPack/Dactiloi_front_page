const EMAILJS_DEFAULT_CONFIG = {
  publicKey: '',
  serviceId: '',
  templateId: '',
  toEmail: ''
};

const EMAILJS_CONFIG = Object.assign(
  {},
  EMAILJS_DEFAULT_CONFIG,
  window.EMAILJS_CONFIG || {}
);

if (window.emailjs && EMAILJS_CONFIG.publicKey) {
  emailjs.init({
    publicKey: EMAILJS_CONFIG.publicKey
  });
}

function buildLeadTemplateParams(lead) {
  return {
    to_email: EMAILJS_CONFIG.toEmail,
    from_name: lead.name,
    from_email: lead.email,
    phone: lead.phone,
    message: [
      lead.message,
      lead.company ? `Empresa: ${lead.company}` : '',
      lead.sector ? `Setor: ${lead.sector}` : ''
    ].filter(Boolean).join('\n\n')
  };
}

function sendLeadEmail(lead) {
  if (!window.emailjs) {
    return Promise.reject(new Error('EmailJS SDK nao foi carregado.'));
  }

  const hasConfig = EMAILJS_CONFIG.publicKey &&
    EMAILJS_CONFIG.serviceId &&
    EMAILJS_CONFIG.templateId &&
    EMAILJS_CONFIG.toEmail;

  if (!hasConfig) {
    return Promise.reject(new Error('Configure publicKey, serviceId, templateId e toEmail em email.config.js.'));
  }

  const templateParams = buildLeadTemplateParams(lead);

  return emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
  ).then(function(response) {
    console.log('Email enviado com sucesso!', response.status, response.text);
    return response;
  }, function(error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  });
}
