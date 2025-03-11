import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    // Maps to Cognito standard attribute 'family_name'
    familyName: {
      mutable: true,
      required: false,
    },
    // Maps to Cognito standard attribute 'given_name'
    givenName: {
      mutable: true,
      required: false,
    },
  },
});
