import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'petPhotos',
  access: (allow) => ({
    'pictures/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  }),
});