
const stripe = Stripe("pk_test_51NsmYFL6UDKZvIsfbanqmmFTlLNz2fq5p9oai2NRjE7mMP6MOjmX6eUiaKPpeF3C3jAIsSxDbyS0wlQeiUqZu6aN00qMdOCEbV");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}