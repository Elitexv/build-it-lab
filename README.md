# Build It Lab

Organization website for final year engineering project support.

## Contact form (email)

The contact form sends inquiries to your inbox via [Web3Forms](https://web3forms.com) (free for static sites).

1. Go to [web3forms.com](https://web3forms.com) and create an access key with the email address that should receive messages.
2. Open `config.js` and replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key.
3. In the Web3Forms dashboard, add your live domain under **Allowed Domains** (e.g. `elitexv.github.io` or your custom domain) so submissions work in production.

## Run locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080
