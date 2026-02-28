require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const YOUR_DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

const PRODUCTS = {
  basic: {
    name: 'Neuro-Dashboard Basic',
    amount: 9700, // $97.00 in cents
    description: 'AI-powered cognitive performance tracking dashboard with personalized neuroscience protocols and biometric insights.',
  },
  pro: {
    name: 'Neuro-Dashboard Pro',
    amount: 19700, // $197.00 in cents
    description: 'Complete autonomous content pipeline blueprint. Scripts, templates, workflows, and automation recipes included.',
  },
  elite: {
    name: 'Neuro-Dashboard Elite',
    amount: 29700, // $297.00 in cents
    description: 'Custom AI automation setup for your small business. Local infrastructure deployment, workflow configuration, and training.',
  },
};

// Create checkout session for each product tier
app.post('/create-checkout-session/:tier', async (req, res) => {
  const tier = req.params.tier;
  const product = PRODUCTS[tier];

  if (!product) {
    return res.status(400).json({ error: 'Invalid product tier' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Success page
app.get('/success', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Successful — Evolve The Cosmos</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --black: #000000;
    --deep: #030308;
    --accent: #00f5ff;
    --accent2: #7b2fff;
    --gold: #ffd700;
    --white: #e8e8f0;
    --dim: #6b6b8a;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--deep);
    color: var(--white);
    font-family: 'Rajdhani', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 24px;
  }
  .grid-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }
  .container {
    position: relative;
    z-index: 1;
    max-width: 680px;
    border: 1px solid rgba(0,245,255,0.15);
    padding: 64px 48px;
    background: rgba(0,245,255,0.02);
  }
  .check-icon {
    font-size: 64px;
    display: block;
    margin-bottom: 32px;
  }
  .tag {
    font-size: 11px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--accent);
    font-family: 'Orbitron', monospace;
    margin-bottom: 20px;
    display: block;
  }
  h1 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 900;
    color: var(--white);
    margin-bottom: 24px;
    line-height: 1.1;
  }
  h1 span {
    color: var(--accent);
  }
  p {
    font-size: 16px;
    color: var(--dim);
    line-height: 1.8;
    font-weight: 300;
    margin-bottom: 16px;
  }
  .download-box {
    background: rgba(0,245,255,0.05);
    border: 1px solid rgba(0,245,255,0.2);
    padding: 32px;
    margin: 40px 0;
    text-align: left;
  }
  .download-box h2 {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .step {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: flex-start;
  }
  .step-num {
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 900;
    color: var(--accent);
    background: rgba(0,245,255,0.1);
    padding: 4px 8px;
    letter-spacing: 2px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-text {
    font-size: 15px;
    color: var(--white);
    line-height: 1.6;
    font-weight: 300;
  }
  .step-text strong {
    color: var(--accent);
    font-weight: 500;
  }
  .btn {
    display: inline-block;
    margin-top: 16px;
    padding: 14px 36px;
    background: var(--accent);
    color: var(--black);
    font-family: 'Orbitron', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.3s ease;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
  }
  .btn:hover {
    background: var(--white);
    transform: translateY(-2px);
  }
</style>
</head>
<body>
<div class="grid-overlay"></div>
<div class="container">
  <span class="check-icon">✅</span>
  <span class="tag">// Payment Confirmed</span>
  <h1>Welcome to the <span>Evolution</span></h1>
  <p>Your payment was processed successfully. You now have access to your Neuro-Dashboard product.</p>

  <div class="download-box">
    <h2>// Access Instructions</h2>
    <div class="step">
      <span class="step-num">01</span>
      <span class="step-text">Check your <strong>email inbox</strong> for your order confirmation and download link from Evolve The Cosmos.</span>
    </div>
    <div class="step">
      <span class="step-num">02</span>
      <span class="step-text">If you don't see it within 5 minutes, <strong>check your spam/junk folder</strong>.</span>
    </div>
    <div class="step">
      <span class="step-num">03</span>
      <span class="step-text">Need help? Email us at <strong>support@evolvethecosmos.com</strong> with your order confirmation number.</span>
    </div>
    <div class="step">
      <span class="step-num">04</span>
      <span class="step-text">Follow the setup guide included in your download to get your Neuro-Dashboard fully operational.</span>
    </div>
  </div>

  <p>Questions? We're here to help you evolve.</p>
  <a href="https://evolvethecosmos.com" class="btn">Return to Home</a>
</div>
</body>
</html>`);
});

// Cancel page — redirect back to main site
app.get('/cancel', (req, res) => {
  res.redirect('https://evolvethecosmos.com/#products');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Evolve The Cosmos Stripe server running`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop\n`);
});
