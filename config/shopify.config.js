const settings = {
  name: 'Liquix Product Manager',
  url: 'https://5723b622.ngrok.io',
  scopes: {
    read_content: true,
    write_content: true,
    read_themes: true,
    write_themes: true,
    read_products: true,
    write_products: true,
    read_product_listings: true,
    read_collection_listings: true,
    read_customers: true,
    write_customers: true,
    read_orders: true,
    write_orders: true,
    read_draft_orders: true,
    write_draft_orders: true,
    read_script_tags: true,
    write_script_tags: true,
    read_fulfillments: true,
    write_fulfillments: true,
    read_shipping: true,
    write_shipping: true,
    read_analytics: true,
    read_checkouts: true,
    write_checkouts: true,
    read_reports: true,
    write_reports: true,
    read_price_rules: true,
    write_price_rules: true,
    read_marketing_events: true,
    write_marketing_events: true,
    read_resource_feedbacks: true,
    write_resource_feedbacks: true,
    unauthenticated_read_collection_listings: true,
    unauthenticated_read_product_listings: true,
    unauthenticated_write_checkouts: true,
    unauthenticated_write_customers: true
  },
  scope: '',
  auth: 'per-user',
  charge_options: ['free', 'pro', 'advanced', 'enterprise', 'test', 'credit'],
  charges: {
    free: {
      name: 'Liquix Product Manager - Free Developer Module',
      test: true,
      type: 'application_charges',
      price: 123.02,
      cap: 123.12,
      terms: 'Terms & Conditions apply. THis is the good thing here!',
      trial: 12
    },
    pro: {
      name: 'Liquix Product Manager - Free Developer Module',
      test: true,
      type: 'recurring_application_charges',
      price: 12.02,
      cap: 300.12,
      usage_charge_options: ['test', 'overuse'],
      usage_charges: {
        test: {
          price: 12.00,
          description: 'this is a usage charge'
        },
        overuse: {
          price: 4.00,
          description: 'this is a usage charge'
        }
      },
      terms: 'Terms & Conditions apply. THis is the good thing here!',
      trial: 12
    },
    advanced: {
      name: 'Liquix Product Manager - Free Developer Module',
      test: true,
      type: 'recurring_application_charges',
      price: 5.02,
      cap: 33.12,
      terms: 'Terms & Conditions apply. THis is the good thing here!',
      trial: 12
    },
    enterprise: {
      name: 'Liquix Product Manager - Free Developer Module',
      test: true,
      type: 'recurring_application_charges',
      price: 78.02,
      cap: 222.12,
      terms: 'Terms & Conditions apply. THis is the good thing here!',
      trial: 12
    },
    test: {
      name: 'Liquix Product Manager - Free Developer Module',
      test: true,
      type: 'recurring_application_charges',
      price: 12.02,
      cap: 5443.12,
      terms: 'Terms & Conditions apply. THis is the good thing here!',
      trial: 12
    },
    credit: {
      name: 'Liquix Product Manager - Free Developer Module',
      test: true,
      type: 'application_credits',
      price: 12.02,
      cap: 5443.12,
      terms: 'Terms & Conditions apply. THis is the good thing here!',
      trial: 12
    }
  }
};

Object.keys(settings.scopes).map((key) => settings.scopes[key] ? settings.scope += key + ',' : null);

export default settings;