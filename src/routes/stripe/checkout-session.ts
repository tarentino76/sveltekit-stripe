import stripe from './_stripe';

export async function post(req: EndpointRequest): Promise<EndpointResponse> {
  if (typeof req.body.priceId !== 'string') {
    return {
      status: 400,
      body: {
        error: {
          message: 'priceId is required'
        }
      }
    }
  }

  const priceId = req.body.priceId;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: 'http://localhost:3000/counter?sessionId={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/'
    });
    return {
      status: 200,
      body: {
        sessionId: session.id
      }
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        error: err
      }
    }
  }
}