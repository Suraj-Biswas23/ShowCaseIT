import { graph, config, auth, connector } from '@grafbase/sdk';

const g = graph.Standalone()

const mongodb = connector.MongoDB('MongoDB', {
  url: g.env('MONGODB_URL'),
  apiKey: g.env('MONGODB_API_KEY'),
  dataSource: g.env('MONGODB_DATA_SOURCE'),
  database: g.env('MONGODB_DATABASE'),
})

// Define the models directly
const User = mongodb.model('User', {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(), 
  projects: g.ref('Project').list().optional(),
})
.collection('users')
.auth(rules => rules.public().read())

const Project = mongodb.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(), 
  image: g.url(),
  liveSiteUrl: g.url(), 
  githubUrl: g.url(), 
  category: g.string(),
  createdBy: g.ref('User'),
})
.auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret:  g.env('NEXTAUTH_SECRET')
})

export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
})