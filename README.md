# co3-dashboard

Initial version of the C03 Dashboard

- Loads Members (Beneficiaries, Merchants, CoopBoxes) from C03 UUM
- Loads Profiles for each Member to get blockchain_public_key
- Loads Balance and TX activity for each blockchain_public_key via
Middleware
- Displays a QR Code in Beneficiaries to be scanned by a wallet holder
- Displays sum of circulating supply of token. Implementation is naiv,
  sums up all balances retreived via Middleware
- Login via SSO
- Logout delets Cookie, no request is made.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
see `.env` file
