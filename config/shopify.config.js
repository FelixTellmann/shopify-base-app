const shopify = {
  name: 'Liquix Product Manager',
  url: 'http://2092ea1f.ngrok.io ',
  scopes: ['read_content', 'write_content', 'read_themes', 'write_themes', 'read_products', 'write_products', 'read_product_listings', 'read_collection_listings', 'read_customers', 'write_customers', 'read_orders', 'write_orders', 'read_draft_orders', 'write_draft_orders', 'read_script_tags', 'write_script_tags', 'read_fulfillments', 'write_fulfillments', 'read_shipping', 'write_shipping', 'read_analytics', 'read_users', 'write_users', 'read_checkouts', 'write_checkouts', 'read_reports', 'write_reports', 'read_price_rules', 'write_price_rules', 'read_marketing_events', 'write_marketing_events', 'read_resource_feedbacks', 'write_resource_feedbacks', 'unauthenticated_read_collection_listings', 'unauthenticated_read_product_listings', 'unauthenticated_write_checkouts', 'unauthenticated_write_customers'],
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
      usage_charge_options:['test', 'overuse'],
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