const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
exports.createCheckoutSession = async (paymentData) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: paymentData.currency,
          product_data: { name: paymentData.title },
          unit_amount: paymentData.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: paymentData.success_url,
      cancel_url: paymentData.cancel_url,
      customer_email: paymentData.customer_email,
      metadata: {  // <-- Ceci est essentiel
        paiementId: paymentData.paiementId.toString(),
        reservationId: paymentData.reservationId.toString()
      },
      payment_intent_data: {  // Double sécurité
        metadata: {
          paiementId: paymentData.paiementId.toString(),
          reservationId: paymentData.reservationId.toString()
        }
      }
    });

    console.log('Session créée avec metadata:', session.metadata); // Log de vérification
    return session;
  } catch (error) {
    console.error("Erreur création session Stripe:", error);
    throw error;
  }
};