# Project Structure

Recommended initial structure:

```text
.
├── app
│   ├── (auth)
│   ├── (dashboard)
│   ├── api
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── ui
│   ├── layout
│   ├── navigation
│   ├── charts
│   ├── tables
│   ├── forms
│   ├── feedback
│   └── data-display
├── config
│   ├── navigation.ts
│   ├── site.ts
│   └── dashboard.ts
├── features
│   ├── dashboard
│   ├── users
│   ├── products
│   ├── orders
│   ├── projects
│   ├── billing
│   ├── messages
│   ├── notifications
│   └── settings
├── hooks
├── lib
│   ├── auth
│   ├── db
│   ├── demo
│   ├── permissions
│   ├── services
│   ├── validations
│   └── utils
├── providers
├── public
├── tests
├── docs
├── AGENTS.md
├── README-AI.md
└── package.json
```

Keep the structure stable. New code should fit an existing pattern whenever possible.
