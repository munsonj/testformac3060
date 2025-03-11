import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  User: a.model({
    givenName: a.string().required(),
    surname: a.string().required(),
    pets: a.hasMany('Pet', 'userId'),
  }),
  Pet: a.model({
    name: a.string(),
    userId: a.id().required(),
    user: a.belongsTo('User', 'userId'),
  }),
}).authorization((allow) => allow.publicApiKey());

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
